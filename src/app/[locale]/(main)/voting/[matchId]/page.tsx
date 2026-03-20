import { connectDB } from '@/lib/db'
import { Vote } from '@/models/Vote'
import { Event } from '@/models/Event'
import { User } from '@/models/User'
import { ClubMember } from '@/models/ClubMember'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { decryptSelections } from '@/lib/crypto'
import { tallyVotes, sortWithTiebreakers } from '@/lib/scoring'
import { redirect } from 'next/navigation'
import { VotingForm } from '@/components/voting/VotingForm'
import { announceResults } from '@/app/[locale]/(main)/voting/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Medal, Eye } from 'lucide-react'
import { getEligibleClubMemberIds } from '@/lib/leaderboard'
import { isVotingAvailableForEvent } from '@/lib/events'

export default async function VotingPage(props: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await props.params
  const authUser = await getAuthUser()
  if (!authUser) redirect('/')
  await connectDB()
  const event = await Event.findById(matchId).lean<any>()
  if (!event) return <main className="p-6">Invalid event</main>
  const memberships = await ClubMember.find().lean<any[]>()
  const eligibleMemberIds = getEligibleClubMemberIds(
    memberships.map((membership) => ({
      clubId: String(membership.clubId),
      userId: String(membership.userId),
      status: membership.status,
    })),
    String(event.clubId)
  )
  const members = await User.find({ _id: { $in: eligibleMemberIds } }).lean<any>().then(users => users.map((u: any) => ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt?.toISOString(),
    updatedAt: u.updatedAt?.toISOString()
  })))
  const voter = await User.findOne({ clerkId: authUser.clerkId }).lean<any>().then((u: any) => u ? ({
    ...u,
    _id: u._id.toString(),
    createdAt: u.createdAt?.toISOString(),
    updatedAt: u.updatedAt?.toISOString()
  }) : null)

  const hasVoted = voter ? await Vote.exists({ matchId, voterId: voter._id }) : false
  const isUserAdmin = isAdmin(authUser.role)
  const isVotingOpen = isVotingAvailableForEvent(
    {
      type: event.type,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
    },
    new Date()
  )

  async function computeResults() {
    'use server'
    await connectDB()
    const votes = await Vote.find({ matchId, clubId: event.clubId }).lean<any>()
    const decoded: Array<{ playerId: string, placement: 1 | 2 | 3 }> = []
    for (const v of votes) {
      try {
        const obj = JSON.parse(decryptSelections(v.selectionsEnc))
        if (obj.first && eligibleMemberIds.includes(obj.first)) decoded.push({ playerId: obj.first, placement: 1 })
        if (obj.second && eligibleMemberIds.includes(obj.second)) decoded.push({ playerId: obj.second, placement: 2 })
        if (obj.third && eligibleMemberIds.includes(obj.third)) decoded.push({ playerId: obj.third, placement: 3 })
      } catch { }
    }
    const tallied = tallyVotes(decoded)
    return sortWithTiebreakers(tallied)
  }

  async function getAdminDetailedVotes() {
    'use server'
    const authUser = await getAuthUser()
    if (!isAdmin(authUser?.role)) return null

    await connectDB()
    const votes = await Vote.find({ matchId, clubId: event.clubId }).populate('voterId', 'name email').lean<any>()

    return votes.map((v: any) => {
      let selections = { first: '', second: '', third: '' }
      try {
        selections = JSON.parse(decryptSelections(v.selectionsEnc))
      } catch { }

      return {
        _id: v._id.toString(),
        voterName: v.voterId?.name || 'Unknown',
        voterEmail: v.voterId?.email,
        selections
      }
    })
  }

  async function handleAnnounce() {
    'use server'
    await announceResults(matchId)
  }

  // Show results if user has voted OR is admin
  const showResults = isVotingOpen && (hasVoted || isUserAdmin)
  const results = showResults ? await computeResults() : null
  const detailedVotes = isUserAdmin ? await getAdminDetailedVotes() : null

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MVP Voting</h1>
          <p className="text-muted-foreground">{event.title} - {new Date(event.date).toLocaleDateString()}</p>
        </div>
        {showResults && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Votes</div>
            <div className="text-2xl font-bold text-primary">{results?.length ? results.reduce((acc: number, r: any) => acc + r.firsts + r.seconds + r.thirds, 0) / 3 : 0}</div>
          </div>
        )}
      </div>

      {/* Show Form only if NOT voted */}
      {!isVotingOpen && (
        <Card className="rounded-none border-zinc-200 bg-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.06)] dark:border-zinc-800 dark:bg-zinc-950/85">
          <CardHeader>
            <CardTitle className="font-heading uppercase tracking-[0.08em]">Bình chọn chưa mở</CardTitle>
            <CardDescription>
              MVP voting will unlock after the scheduled match end time{event.endTime ? ` (${event.endTime})` : ''}.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {isVotingOpen && !hasVoted && voter && (
        <div className="mb-8">
          <VotingForm matchId={matchId} members={members} voterId={String(voter._id)} />
        </div>
      )}

      {/* Show Aggregated Results (Anonymous) */}
      {showResults && results && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Voting Results</CardTitle>
                <CardDescription>Anonymous leaderboard visible to all voters</CardDescription>
              </div>
              {isUserAdmin && (
                <div className="flex items-center gap-2">
                  <form action={handleAnnounce}>
                    <Button type="submit" variant="default" size="sm">
                      Announce Results
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground text-lg">No votes cast yet</div>
                <p className="text-muted-foreground/60 mt-2">Voting is still open for this match</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((r: any, index) => (
                  <div key={r.playerId} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-600' :
                              'bg-slate-400'
                        }`}>
                        {index < 3 ? <Medal className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {members.find((m: any) => String(m._id) === r.playerId)?.name || r.playerId}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {r.firsts} firsts, {r.seconds} seconds, {r.thirds} thirds
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{r.total} pts</div>
                      <div className="text-sm text-muted-foreground">Total Score</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Admin Only: Detailed Votes */}
      {isUserAdmin && detailedVotes && detailedVotes.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50/50">
            <CardTitle className="text-red-900 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Admin View: Detailed Ballots
            </CardTitle>
            <CardDescription className="text-red-700">
              Only admins can see who voted for whom.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {detailedVotes.map((vote: any) => {
                const p1 = members.find((m: any) => String(m._id) === vote.selections.first)?.name || 'Unknown'
                const p2 = members.find((m: any) => String(m._id) === vote.selections.second)?.name || 'Unknown'
                const p3 = members.find((m: any) => String(m._id) === vote.selections.third)?.name || 'Unknown'

                return (
                  <div key={vote._id} className="p-4 rounded-lg border bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-primary">{vote.voterName}</div>
                      <div className="text-xs text-muted-foreground">{vote.voterEmail}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-yellow-600">1st:</span> {p1}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-500">2nd:</span> {p2}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-orange-600">3rd:</span> {p3}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
