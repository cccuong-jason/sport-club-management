'use server'

import { connectDB } from '@/lib/db'
import { Event } from '@/models/Event'
import { User } from '@/models/User'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'
import { buildEventCreateInput } from '@/lib/events'

export async function createEvent(formData: FormData) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role)) return { success: false, message: 'Unauthorized' }

  let seasonId = String(formData.get('seasonId') || '')
  if (seasonId === 'none') seasonId = ''

  await connectDB()

  try {
    const payload = buildEventCreateInput(
      {
        title: String(formData.get('title') || ''),
        type: String(formData.get('type') || 'training') as 'training' | 'match',
        date: String(formData.get('date') || ''),
        startTime: String(formData.get('startTime') || ''),
        endTime: String(formData.get('endTime') || ''),
        location: String(formData.get('location') || ''),
        seasonId,
      },
      authUser!
    )

    const event = await Event.create(payload)

    // Send In-App Notification
    try {
      await createNotification(
        'all',
        `New ${event.type} scheduled: ${event.title} on ${event.date.toLocaleDateString()}`,
        'info',
        `/events`
      )
    } catch (error) {
      console.error('Failed to send notifications:', error)
    }

    revalidatePath('/events')
    return { success: true, message: 'Event created successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, message: error instanceof Error ? error.message : 'Failed to create event' }
  }
}
