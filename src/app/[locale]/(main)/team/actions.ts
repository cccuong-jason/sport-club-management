'use server'

import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { ClubMember } from '@/models/ClubMember'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function addMember(formData: FormData) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role) || !authUser?.activeClubId) return { success: false, message: 'Unauthorized' }
  await connectDB()
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const position = String(formData.get('position') || '')
  if (!email || !name) return { success: false, message: 'Missing name or email' }

  try {
    let user = await User.findOne({ email })
    if (!user) {
      const hashedPassword = await bcrypt.hash('123456', 10)
      user = await User.create({
        name,
        email,
        position,
        passwordHash: hashedPassword
      })
    }

    const existingMember = await ClubMember.findOne({ userId: user._id, clubId: authUser.activeClubId })
    if (existingMember) return { success: false, message: 'User is already in this club' }

    await ClubMember.create({
      userId: user._id,
      clubId: authUser.activeClubId,
      role: 'member',
      status: 'active'
    })

    revalidatePath('/team')
    return { success: true, message: 'Member added to club' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Failed to add member' }
  }
}

export async function setRole(formData: FormData) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role) || !authUser?.activeClubId) return { success: false, message: 'Unauthorized' }
  await connectDB()
  const memberId = String(formData.get('userId')) // refers to User._id
  const role = String(formData.get('role')) as 'admin' | 'member'

  try {
    await ClubMember.updateOne({ userId: memberId, clubId: authUser.activeClubId }, { role })
    revalidatePath('/team')
    return { success: true, message: 'Role updated successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to update role' }
  }
}

export async function setStatus(formData: FormData) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role) || !authUser?.activeClubId) return { success: false, message: 'Unauthorized' }
  await connectDB()
  const memberId = String(formData.get('userId'))
  const status = String(formData.get('status')) as 'active' | 'inactive' | 'pending_approval' | 'leaving'

  try {
    await ClubMember.updateOne({ userId: memberId, clubId: authUser.activeClubId }, { status })
    revalidatePath('/team')
    return { success: true, message: 'Status updated successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to update status' }
  }
}

export async function updateMemberDetails(formData: FormData) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role)) return { success: false, message: 'Unauthorized' }
  await connectDB()

  const userId = String(formData.get('userId'))
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const position = String(formData.get('position') || '')

  try {
    await User.updateOne(
      { _id: userId },
      { name, email, position }
    )
    revalidatePath('/team')
    return { success: true, message: 'Member details updated successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to update member details' }
  }
}

export async function removeMember(userId: string) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role) || !authUser?.activeClubId) return { success: false, message: 'Unauthorized' }
  await connectDB()

  try {
    await ClubMember.findOneAndDelete({ userId, clubId: authUser.activeClubId })
    revalidatePath('/team')
    return { success: true, message: 'Member removed from club successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to remove member' }
  }
}

export async function requestLeaveClub() {
  const authUser = await getAuthUser()
  if (!authUser || !authUser.activeClubId) return { success: false, message: 'Not authenticated' }
  await connectDB()

  try {
    await ClubMember.updateOne(
      { userId: authUser.mongoId, clubId: authUser.activeClubId },
      { status: 'leaving', leaveRequestedAt: new Date() }
    )
    revalidatePath('/team')
    revalidatePath('/dashboard')
    return { success: true, message: 'Leave request submitted successfully. Waiting for admin approval or 7-day auto-release.' }
  } catch (error) {
    return { success: false, message: 'Failed to request leave' }
  }
}

export async function approveTransfer(userId: string) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role) || !authUser?.activeClubId) return { success: false, message: 'Unauthorized' }
  await connectDB()

  try {
    await ClubMember.findOneAndDelete({ userId, clubId: authUser.activeClubId })
    revalidatePath('/team')
    return { success: true, message: 'Transfer approved and member removed from club.' }
  } catch (error) {
    return { success: false, message: 'Failed to approve transfer' }
  }
}


