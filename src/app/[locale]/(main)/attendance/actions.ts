'use server'

import { connectDB } from '@/lib/db'
import { Attendance } from '@/models/Attendance'
import { User } from '@/models/User'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'

export async function markAll(eventId: string, status: 'present' | 'absent' | 'unexpected') {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role)) return
  await connectDB()
  const all = await User.find().lean<any>()
  for (const u of all) {
    await Attendance.updateOne({ eventId, userId: u._id }, { status, markedBy: null }, { upsert: true })
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
  await Attendance.updateOne({ eventId, userId }, { status, markedBy: null }, { upsert: true })
  revalidatePath(`/attendance/${eventId}`)
}
