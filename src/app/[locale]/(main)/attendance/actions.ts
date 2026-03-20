'use server'

import { connectDB } from '@/lib/db'
import { Attendance } from '@/models/Attendance'
import { Event } from '@/models/Event'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import { getActiveClubMemberIds } from '@/lib/club-members'

export async function markAll(eventId: string, status: 'present' | 'absent' | 'unexpected') {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role)) return
  await connectDB()
  const event = await Event.findById(eventId).select('clubId').lean<any>()
  const all = await getActiveClubMemberIds(event?.clubId?.toString())
  for (const userId of all) {
    await Attendance.updateOne(
      { eventId, userId, clubId: event?.clubId },
      { status, markedBy: authUser?.mongoId, clubId: event?.clubId },
      { upsert: true }
    )
  }
  revalidatePath(`/attendance/${eventId}`)
}

export async function setOne(formData: FormData) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role)) return
  await connectDB()
  const eventId = String(formData.get('eventId'))
  const userId = String(formData.get('userId'))
  const status = String(formData.get('status')) as 'present' | 'absent' | 'unexpected'
  const event = await Event.findById(eventId).select('clubId').lean<any>()
  await Attendance.updateOne(
    { eventId, userId, clubId: event?.clubId },
    { status, markedBy: authUser?.mongoId, clubId: event?.clubId },
    { upsert: true }
  )
  revalidatePath(`/attendance/${eventId}`)
}
