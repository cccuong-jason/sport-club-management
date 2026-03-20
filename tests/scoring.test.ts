import { placementPoints, tallyVotes, sortWithTiebreakers } from '@/lib/scoring'
import { attendancePoint } from '@/lib/scoring'

test('placement points', () => {
  expect(placementPoints(1)).toBe(5)
  expect(placementPoints(2)).toBe(3)
  expect(placementPoints(3)).toBe(1)
})

test('tally and sort', () => {
  const votes = [
    { playerId: 'A', placement: 1 },
    { playerId: 'A', placement: 2 },
    { playerId: 'B', placement: 1 },
    { playerId: 'B', placement: 3 },
    { playerId: 'C', placement: 3 },
  ] as Array<{ playerId: string, placement: 1 | 2 | 3 }>
  const tallied = tallyVotes(votes)
  const sorted = sortWithTiebreakers(tallied)
  expect(sorted[0].playerId).toBe('A')
})

test('attendance points follow leaderboard business rules', () => {
  expect(attendancePoint('present')).toBe(1)
  expect(attendancePoint('absent')).toBe(-1)
  expect(attendancePoint('unexpected')).toBe(0)
})
