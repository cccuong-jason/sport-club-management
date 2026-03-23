import type { AuthUser } from '@/lib/auth-user'
import {
  buildEventCreateInput,
  validateEventFormInput,
} from '@/lib/events'

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

test('buildEventCreateInput includes required club and creator context', () => {
  const result = buildEventCreateInput(
    {
      title: 'Friendly Match',
      type: 'match',
      date: '2026-03-20T12:00:00.000Z',
      startTime: '19:00',
      endTime: '21:00',
      location: 'Main Stadium',
      seasonId: '507f191e810c19729de860ef',
    },
    adminUser
  )

  expect(result).toMatchObject({
    title: 'Friendly Match',
    type: 'match',
    location: 'Main Stadium',
    clubId: adminUser.activeClubId,
    createdBy: adminUser.mongoId,
    teamId: null,
    seasonId: '507f191e810c19729de860ef',
  })
  expect(result.date).toEqual(new Date('2026-03-20T12:00:00.000Z'))
})

test('buildEventCreateInput normalizes an empty season selection to null', () => {
  const result = buildEventCreateInput(
    {
      title: 'Training Night',
      type: 'training',
      date: '2026-03-21T12:00:00.000Z',
      startTime: '18:00',
      endTime: '20:00',
      location: 'Pitch 2',
      seasonId: '',
    },
    adminUser
  )

  expect(result.seasonId).toBeNull()
})

test('validateEventFormInput rejects invalid event data', () => {
  expect(() =>
    validateEventFormInput({
      title: 'A',
      type: 'training',
      date: 'not-a-date',
      startTime: '',
      endTime: '',
      location: 'X',
      seasonId: '',
    })
  ).toThrow('Invalid event data')
})

test('buildEventCreateInput rejects users without an active club', () => {
  expect(() =>
    buildEventCreateInput(
      {
        title: 'Friendly Match',
        type: 'match',
        date: '2026-03-20T12:00:00.000Z',
        startTime: '19:00',
        endTime: '21:00',
        location: 'Main Stadium',
        seasonId: '507f191e810c19729de860ef',
      },
      {
        ...adminUser,
        activeClubId: undefined,
      }
    )
  ).toThrow('Active club context is required')
})
