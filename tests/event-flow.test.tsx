import {
  buildEventCreateInput,
  getEventCardActions,
  getEventLifecycleState,
  isVotingAvailableForEvent,
  validateEventFormInput,
} from '@/lib/events'
import type { AuthUser } from '@/lib/auth-user'

const adminUser: AuthUser = {
  clerkId: 'clerk_1',
  email: 'admin@example.com',
  mongoId: '507f191e810c19729de860ea',
  name: 'Admin User',
  memberships: [
    {
      clubId: '507f191e810c19729de860eb',
      clubName: 'Goalz FC',
      sport: 'football',
      role: 'admin',
      status: 'active',
    },
  ],
  role: 'admin',
  status: 'active',
  activeClubId: '507f191e810c19729de860eb',
  activeClubName: 'Goalz FC',
  activeClubSport: 'football',
}

describe('event lifecycle rules', () => {
  test('match voting stays locked until the scheduled end time', () => {
    expect(
      isVotingAvailableForEvent(
        {
          type: 'match',
          date: '2026-03-20T00:00:00.000Z',
          startTime: '19:00',
          endTime: '21:00',
        },
        new Date('2026-03-20T20:30:00.000Z')
      )
    ).toBe(false)

    expect(
      isVotingAvailableForEvent(
        {
          type: 'match',
          date: '2026-03-20T00:00:00.000Z',
          startTime: '19:00',
          endTime: '21:00',
        },
        new Date('2026-03-20T21:30:00.000Z')
      )
    ).toBe(true)
  })

  test('event lifecycle marks matches without an end time as upcoming to avoid premature unlocks', () => {
    expect(
      getEventLifecycleState(
        {
          type: 'match',
          date: '2026-03-20T00:00:00.000Z',
          startTime: '19:00',
          endTime: '',
        },
        new Date('2026-03-21T00:00:00.000Z')
      )
    ).toBe('upcoming')
  })
})

describe('event card actions', () => {
  test('match cards show RSVP and reveal MVP only after the match ends', () => {
    const actions = getEventCardActions(
      {
        type: 'match',
        date: '2026-03-20T00:00:00.000Z',
        startTime: '19:00',
        endTime: '21:00',
      },
      new Date('2026-03-20T22:30:00.000Z')
    )

    expect(actions).toEqual({
      showRsvp: true,
      showAttendance: true,
      showVoting: true,
      showPayments: true,
    })
  })

  test('upcoming matches hide MVP while training keeps only the shared event actions', () => {
    expect(
      getEventCardActions(
        {
          type: 'match',
          date: '2026-03-20T00:00:00.000Z',
          startTime: '19:00',
          endTime: '21:00',
        },
        new Date('2026-03-20T18:30:00.000Z')
      )
    ).toEqual({
      showRsvp: true,
      showAttendance: true,
      showVoting: false,
      showPayments: true,
    })

    expect(
      getEventCardActions(
        {
          type: 'training',
          date: '2026-03-21T00:00:00.000Z',
          startTime: '19:00',
          endTime: '21:00',
        },
        new Date('2026-03-20T18:30:00.000Z')
      )
    ).toEqual({
      showRsvp: true,
      showAttendance: true,
      showVoting: false,
      showPayments: false,
    })
  })
})

describe('datetime range normalization', () => {
  test('buildEventCreateInput derives date and clock fields from a datetime range', () => {
    const result = buildEventCreateInput(
      {
        title: 'Validation Match',
        type: 'match',
        date: '',
        startTime: '',
        endTime: '',
        dateTimeStart: '2026-03-20T19:00',
        dateTimeEnd: '2026-03-20T21:00',
        location: 'Validation Arena',
        seasonId: '',
      },
      adminUser
    )

    expect(result.date).toEqual(new Date('2026-03-20T00:00:00.000Z'))
    expect(result.startTime).toBe('19:00')
    expect(result.endTime).toBe('21:00')
  })

  test('validateEventFormInput rejects datetime ranges where the end is not after the start', () => {
    expect(() =>
      validateEventFormInput({
        title: 'Validation Match',
        type: 'match',
        date: '',
        startTime: '',
        endTime: '',
        dateTimeStart: '2026-03-20T21:00',
        dateTimeEnd: '2026-03-20T19:00',
        location: 'Validation Arena',
        seasonId: '',
      })
    ).toThrow('Event end time must be after the start time')
  })
})
