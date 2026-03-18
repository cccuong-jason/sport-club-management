import type { AuthUser } from '@/lib/auth-user'

type SeasonFormInput = {
  name: string
  startDate: string
  endDate: string
}

export function validateSeasonFormInput(input: SeasonFormInput) {
  const name = input.name.trim()
  const startDate = new Date(input.startDate)
  const endDate = new Date(input.endDate)

  if (!name) {
    throw new Error('Season name is required')
  }

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('Valid season dates are required')
  }

  if (endDate < startDate) {
    throw new Error('End date must be on or after start date')
  }

  return {
    name,
    startDate,
    endDate,
  }
}

export function buildSeasonCreateInput(input: SeasonFormInput, authUser: AuthUser) {
  const parsed = validateSeasonFormInput(input)

  if (!authUser.activeClubId) {
    throw new Error('Active club context is required')
  }

  return {
    ...parsed,
    clubId: authUser.activeClubId,
    teamId: null,
    createdBy: authUser.mongoId,
  }
}
