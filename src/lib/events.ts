import type { AuthUser } from '@/lib/auth-user'
import { EventSchema } from '@/lib/validators'

type EventFormInput = {
  title: string
  type: 'training' | 'match'
  date: string
  startTime: string
  endTime: string
  location: string
  seasonId: string
}

export function validateEventFormInput(input: EventFormInput) {
  const parsed = EventSchema.safeParse({
    title: input.title,
    type: input.type,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    location: input.location,
  })

  if (!parsed.success) {
    throw new Error('Invalid event data')
  }

  const date = new Date(parsed.data.date)
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid event data')
  }

  return {
    ...parsed.data,
    date,
    seasonId: input.seasonId,
  }
}

export function buildEventCreateInput(input: EventFormInput, authUser: AuthUser) {
  const parsed = validateEventFormInput(input)

  if (!authUser.activeClubId) {
    throw new Error('Active club context is required')
  }

  return {
    ...parsed,
    clubId: authUser.activeClubId,
    teamId: null,
    seasonId: parsed.seasonId || null,
    createdBy: authUser.mongoId,
  }
}
