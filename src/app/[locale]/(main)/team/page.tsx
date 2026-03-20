import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { ClubMember } from '@/models/ClubMember'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { TeamList } from '@/components/team/TeamList'
import { AttendanceReportPanel } from '@/components/team/AttendanceReportPanel'
import { computeAttendanceReport } from '@/lib/attendance-report'

async function listMembers(clubId: string) {
  await connectDB()
  const memberships = await ClubMember.find({ clubId }).populate<{ userId: any }>('userId').lean<any[]>()

  return memberships.map(m => {
    const u = m.userId
    if (!u) return null
    return {
      ...u,
      _id: u._id.toString(),
      role: m.role,
      status: m.status,
      createdAt: u.createdAt?.toISOString(),
      updatedAt: u.updatedAt?.toISOString()
    }
  }).filter(Boolean)
}

export default async function TeamPage() {
  const authUser = await getAuthUser()
  if (!authUser || !authUser.activeClubId) return <main className="p-6">Vui lòng chọn hoặc tham gia một câu lạc bộ.</main>

  const members = await listMembers(authUser.activeClubId)
  const isUserAdmin = isAdmin(authUser.role)
  const currentUserId = authUser.mongoId
  const attendanceEntries = isUserAdmin ? await computeAttendanceReport(authUser.activeClubId) : []

  return (
    <main className="space-y-8">
      <TeamList
        members={members}
        isAdmin={isUserAdmin}
        currentUserId={currentUserId}
      />
      {isUserAdmin && <AttendanceReportPanel entries={attendanceEntries} />}
    </main>
  )
}
