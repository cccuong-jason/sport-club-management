import { getEligibleClubMemberIds } from '@/lib/leaderboard'

test('getEligibleClubMemberIds keeps only active members from the active club', () => {
  const ids = getEligibleClubMemberIds(
    [
      { clubId: 'club-a', userId: 'user-1', status: 'active' },
      { clubId: 'club-a', userId: 'user-2', status: 'pending_approval' },
      { clubId: 'club-a', userId: 'user-3', status: 'inactive' },
      { clubId: 'club-b', userId: 'user-4', status: 'active' },
      { clubId: 'club-a', userId: 'user-1', status: 'active' },
    ],
    'club-a'
  )

  expect(ids).toEqual(['user-1'])
})

test('returns an empty list when no club id is provided', () => {
  expect(
    getEligibleClubMemberIds(
      [{ clubId: 'club-a', userId: 'user-1', status: 'active' }],
      undefined
    )
  ).toEqual([])
})
