import { connectDB } from '@/lib/db'
import { Attendance } from '@/models/Attendance'
import { listActiveClubMembers } from '@/lib/club-members'

export async function computeAttendanceReport(clubId?: string) {
  await connectDB()
  const users = await listActiveClubMembers(clubId)
  const records = await Attendance.find(clubId ? { clubId } : {}).lean<any>()
  const byUser: Record<string, { total: number; present: number }> = {}

  for (const u of users) byUser[String(u._id)] = { total: 0, present: 0 }

  for (const r of records) {
    const id = String(r.userId)
    if (!byUser[id]) byUser[id] = { total: 0, present: 0 }
    byUser[id].total += 1
    if (r.status === 'present') byUser[id].present += 1
  }

  return users
    .map((u: any) => ({
      userId: String(u._id),
      name: u.name,
      email: u.email,
      percent: byUser[String(u._id)].total
        ? Math.round((byUser[String(u._id)].present / byUser[String(u._id)].total) * 100)
        : 0,
      total: byUser[String(u._id)].total,
      present: byUser[String(u._id)].present,
    }))
    .sort((a: any, b: any) => b.percent - a.percent)
}
