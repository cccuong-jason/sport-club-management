import {
  attendancePoint,
  placementPoints,
  tallyVotes,
  sortWithTiebreakers,
} from '@/lib/scoring'

test('placement points', () => {
  expect(placementPoints(1)).toBe(3)
  expect(placementPoints(2)).toBe(2)
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

test('sortWithTiebreakers falls back to firsts, seconds, thirds, then player id', () => {
  const sorted = sortWithTiebreakers([
    { playerId: 'charlie', total: 4, firsts: 1, seconds: 0, thirds: 1 },
    { playerId: 'bravo', total: 4, firsts: 1, seconds: 1, thirds: 0 },
    { playerId: 'alpha', total: 4, firsts: 1, seconds: 1, thirds: 0 },
  ])

  expect(sorted.map((entry) => entry.playerId)).toEqual(['alpha', 'bravo', 'charlie'])
})

test('attendance points reward present members only', () => {
  expect(attendancePoint('present')).toBe(2)
  expect(attendancePoint('absent')).toBe(0)
  expect(attendancePoint('unexpected')).toBe(0)
})

