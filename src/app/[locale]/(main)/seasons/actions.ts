'use server'

import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/db'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { Season } from '@/models/Season'
import { buildSeasonCreateInput } from '@/lib/seasons'

export async function createSeason(formData: FormData) {
  const authUser = await getAuthUser()
  if (!authUser || !isAdmin(authUser.role)) return

  await connectDB()

  const payload = buildSeasonCreateInput(
    {
      name: String(formData.get('name') || ''),
      startDate: String(formData.get('startDate') || ''),
      endDate: String(formData.get('endDate') || ''),
    },
    authUser
  )

  await Season.create(payload)
  revalidatePath('/seasons')
}
