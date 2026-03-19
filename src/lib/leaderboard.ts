type MembershipLike = {
  clubId: string
  userId: string
  status: 'active' | 'inactive' | 'pending_approval' | 'leaving'
}

export function getEligibleClubMemberIds(
  memberships: MembershipLike[],
  clubId?: string
) {
  if (!clubId) return []

  return Array.from(
    new Set(
      memberships
        .filter((membership) => membership.clubId === clubId && membership.status === 'active')
        .map((membership) => membership.userId)
    )
  )
}
