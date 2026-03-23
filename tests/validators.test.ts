import { EventSchema, VoteSchema } from '@/lib/validators'

test('EventSchema accepts valid event payloads', () => {
  expect(
    EventSchema.parse({
      title: 'Training Night',
      type: 'training',
      date: '2026-03-24',
      startTime: '19:00',
      endTime: '21:00',
      location: 'Pitch 1',
    })
  ).toMatchObject({
    title: 'Training Night',
    type: 'training',
  })
})

test('VoteSchema accepts unique selections and optional other reasons', () => {
  expect(
    VoteSchema.parse({
      first: 'player-1',
      firstReasons: ['leadership'],
      firstOtherReason: 'Clutch finish',
      second: 'player-2',
      secondReasons: ['assists'],
      third: 'player-3',
      thirdReasons: ['defense'],
    })
  ).toMatchObject({
    first: 'player-1',
    second: 'player-2',
    third: 'player-3',
  })
})

test('VoteSchema rejects duplicate player selections', () => {
  const result = VoteSchema.safeParse({
    first: 'player-1',
    firstReasons: ['leadership'],
    second: 'player-1',
    secondReasons: ['assists'],
    third: 'player-3',
    thirdReasons: ['defense'],
  })

  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.issues[0]?.message).toContain('Selections must be unique')
  }
})
