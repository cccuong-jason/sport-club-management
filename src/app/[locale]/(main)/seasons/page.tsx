import { connectDB } from '@/lib/db'
import { Season } from '@/models/Season'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { User } from '@/models/User'
import { Vote } from '@/models/Vote'
import { Attendance } from '@/models/Attendance'
import { ClubMember } from '@/models/ClubMember'
import { decryptSelections } from '@/lib/crypto'
import { tallyVotes, sortWithTiebreakers, attendancePoint } from '@/lib/scoring'
import { getEligibleClubMemberIds } from '@/lib/leaderboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createSeason } from './actions'
import Link from 'next/link'

async function listSeasons(clubId?: string) {
  await connectDB()
  if (!clubId) return []
  return Season.find({ clubId }).sort({ startDate: -1 }).lean<any>()
}

export default async function SeasonsPage() {
  const authUser = await getAuthUser()
  const seasons = await listSeasons(authUser?.activeClubId)
  return (
    <main className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.22em] text-primary">Season Command</p>
          <h1 className="font-heading text-4xl uppercase tracking-[0.06em] text-zinc-950 dark:text-white">Seasons</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">Manage competitive seasons and view historical leaderboards.</p>
        </div>
        <Button asChild variant="outline" className="rounded-none border-zinc-300 font-heading uppercase tracking-[0.12em] dark:border-zinc-700">
          <Link href="/seasons/calendar">Open Calendar</Link>
        </Button>
      </div>

      {isAdmin(authUser?.role) && <CreateSeasonForm />}

      <div className="grid grid-cols-1 gap-6">
        {seasons.map((s: any) => (
          <SeasonRow key={s._id} season={s} />
        ))}
        {seasons.length === 0 && (
          <div className="text-center py-10 text-muted-foreground bg-white rounded-lg border border-dashed">
            No seasons created yet.
          </div>
        )}
      </div>
    </main>
  )
}

function CreateSeasonForm() {
  return (
    <Card className="overflow-hidden rounded-none border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-950/85">
      <CardHeader className="border-b border-zinc-200/70 bg-gradient-to-r from-primary/12 via-transparent to-transparent dark:border-zinc-800/70 dark:from-primary/15">
        <CardTitle className="font-heading text-2xl uppercase tracking-[0.08em]">Create New Season</CardTitle>
        <CardDescription>Define a new time range for tracking points and MVP stats.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createSeason} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Season Name</Label>
              <Input name="name" id="name" placeholder="e.g. Summer 2025" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input name="startDate" id="startDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input name="endDate" id="endDate" type="date" required />
            </div>
          </div>
          <Button type="submit">Create Season</Button>
        </form>
      </CardContent>
    </Card>
  )
}

async function computeLeaderboard(from: Date, to: Date, clubId?: string) {
  await connectDB()
  const memberships = await ClubMember.find().lean<any[]>()
  const eligibleUserIds = getEligibleClubMemberIds(
    memberships.map((membership) => ({
      clubId: String(membership.clubId),
      userId: String(membership.userId),
      status: membership.status,
    })),
    clubId
  )

  if (eligibleUserIds.length === 0) {
    return { users: [], entries: [] }
  }

  const users = await User.find({ _id: { $in: eligibleUserIds } }).lean<any>()
  const votes = await Vote.find(clubId ? { clubId } : {}).lean<any>()
  const decoded: Array<{ playerId: string, placement: 1 | 2 | 3 }> = []
  for (const v of votes) {
    try {
      const d = JSON.parse(decryptSelections(v.selectionsEnc))
      if (eligibleUserIds.includes(d.first)) decoded.push({ playerId: d.first, placement: 1 })
      if (eligibleUserIds.includes(d.second)) decoded.push({ playerId: d.second, placement: 2 })
      if (eligibleUserIds.includes(d.third)) decoded.push({ playerId: d.third, placement: 3 })
    } catch { }
  }
  const voteTallies = tallyVotes(decoded)
  const attendance = await Attendance.find(clubId ? { clubId } : {}).lean<any>()
  const attendanceTallies: Record<string, number> = {}
  for (const a of attendance) {
    const created = new Date(a.createdAt)
    if (from && created < from) continue
    if (to && created > to) continue
    const id = String(a.userId)
    if (!eligibleUserIds.includes(id)) continue
    attendanceTallies[id] = (attendanceTallies[id] || 0) + attendancePoint(a.status)
  }

  const combined = voteTallies.map(v => ({
    playerId: v.playerId,
    total: v.total + (attendanceTallies[v.playerId] ? attendanceTallies[v.playerId] / 4 : 0),
    firsts: v.firsts,
    seconds: v.seconds,
    thirds: v.thirds,
    mvpPoints: v.total,
    attendancePoints: attendanceTallies[v.playerId] || 0
  }))

  for (const u of users) {
    const id = String(u._id)
    if (!combined.find(c => c.playerId === id)) {
      combined.push({
        playerId: id,
        total: attendanceTallies[id] ? attendanceTallies[id] / 4 : 0,
        firsts: 0, seconds: 0, thirds: 0,
        mvpPoints: 0,
        attendancePoints: attendanceTallies[id] || 0
      })
    }
  }
  return { users, entries: sortWithTiebreakers(combined) }
}

async function Leaderboard({ season }: { season: any }) {
  const { users, entries } = await computeLeaderboard(
    new Date(season.startDate),
    new Date(season.endDate),
    String(season.clubId)
  )
  return (
    <div className="mt-4 overflow-hidden border border-zinc-200 bg-white/95 shadow-[0_18px_40px_rgba(0,0,0,0.05)] dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-zinc-950 text-white dark:bg-black">
            <tr>
              <th className="px-4 py-4 text-left font-heading text-xs uppercase tracking-[0.14em]">Name</th>
              <th className="px-4 py-4 text-right font-heading text-xs uppercase tracking-[0.14em]">Chuyên cần</th>
              <th className="px-4 py-4 text-right font-heading text-xs uppercase tracking-[0.14em]">Thái độ</th>
              <th className="px-4 py-4 text-right font-heading text-xs uppercase tracking-[0.14em]">Tiến bộ</th>
              <th className="px-4 py-4 text-right font-heading text-xs uppercase tracking-[0.14em]">Ngoài sân</th>
              <th className="px-4 py-4 text-right font-heading text-xs uppercase tracking-[0.14em]">MVP</th>
              <th className="bg-primary px-4 py-4 text-right font-heading text-xs uppercase tracking-[0.14em] text-black">Điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {entries.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">No data recorded for this period.</td>
              </tr>
            )}
            {entries.map((e: any, idx: number) => (
              <tr key={e.playerId} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/65">
                <td className="px-4 py-4 font-medium text-zinc-950 dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-primary/30 bg-primary text-xs font-black text-black">
                      {idx + 1}
                    </div>
                    <span>{users.find((u: any) => String(u._id) === e.playerId)?.name || e.playerId}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-300">{e.attendancePoints}</td>
                <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-300">0</td>
                <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-300">0</td>
                <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-300">0</td>
                <td className="px-4 py-4 text-right text-zinc-600 dark:text-zinc-300">{e.mvpPoints}</td>
                <td className="bg-primary/12 px-4 py-4 text-right font-black text-zinc-950 dark:text-white">{e.total.toFixed(1).replace('.0', '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SeasonRow({ season }: { season: any }) {
  return (
    <Card className="overflow-hidden rounded-none border-zinc-200 bg-[linear-gradient(180deg,rgba(194,255,87,0.08),transparent_28%),rgba(255,255,255,0.92)] shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-[linear-gradient(180deg,rgba(194,255,87,0.08),transparent_30%),rgba(5,10,8,0.96)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-3xl uppercase tracking-[0.06em] text-zinc-950 dark:text-white">{season.name}</CardTitle>
          <span className="border border-primary/25 bg-primary/10 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200">
            {new Date(season.startDate).toLocaleDateString()} — {new Date(season.endDate).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Leaderboard season={season} />
      </CardContent>
    </Card>
  )
}
