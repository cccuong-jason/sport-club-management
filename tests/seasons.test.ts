import type { AuthUser } from '@/lib/auth-user'
import {
  buildSeasonCreateInput,
  validateSeasonFormInput,
} from '@/lib/seasons'

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

test('buildSeasonCreateInput includes required club and creator context', () => {
  const result = buildSeasonCreateInput(
    {
      name: 'Summer 2026',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
    },
    adminUser
  )

  expect(result).toMatchObject({
    name: 'Summer 2026',
    clubId: adminUser.activeClubId,
    createdBy: adminUser.mongoId,
    teamId: null,
  })
  expect(result.startDate).toEqual(new Date('2026-06-01'))
  expect(result.endDate).toEqual(new Date('2026-08-31'))
})

test('buildSeasonCreateInput rejects admins without an active club context', () => {
  expect(() =>
    buildSeasonCreateInput(
      {
        name: 'Summer 2026',
        startDate: '2026-06-01',
        endDate: '2026-08-31',
      },
      {
        ...adminUser,
        activeClubId: undefined,
      }
    )
  ).toThrow('Active club context is required')
})

test('validateSeasonFormInput rejects an end date before the start date', () => {
  expect(() =>
    validateSeasonFormInput({
      name: 'Summer 2026',
      startDate: '2026-08-31',
      endDate: '2026-06-01',
    })
  ).toThrow('End date must be on or after start date')
})

test('validateSeasonFormInput trims the name and rejects missing values', () => {
  expect(
    validateSeasonFormInput({
      name: '  Summer 2026  ',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
    }).name
  ).toBe('Summer 2026')

  expect(() =>
    validateSeasonFormInput({
      name: '   ',
      startDate: '2026-06-01',
      endDate: '2026-08-31',
    })
  ).toThrow('Season name is required')
})
