import { connectDB } from '@/lib/db'
import { ClubMember } from '@/models/ClubMember'

type LeanUser = {
  _id: { toString(): string }
  name: string
  email?: string
  createdAt?: Date
  updatedAt?: Date
  [key: string]: unknown
}

export async function getActiveClubMemberIds(clubId?: string) {
  if (!clubId) return []

  await connectDB()
  const memberships = await ClubMember.find({ clubId, status: 'active' }).select('userId').lean<any[]>()

  return Array.from(new Set(memberships.map((membership) => String(membership.userId))))
}

export async function listActiveClubMembers(clubId?: string) {
  if (!clubId) return []

  await connectDB()
  const memberships = await ClubMember.find({ clubId, status: 'active' })
    .populate<{ userId: LeanUser | null }>('userId')
    .lean<any[]>()

  return memberships
    .map((membership) => {
      const user = membership.userId as LeanUser | null
      if (!user) return null

      return {
        ...user,
        _id: String(user._id),
        role: membership.role,
        status: membership.status,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      }
    })
    .filter((member): member is NonNullable<typeof member> => member !== null)
}
