'use server'

import { connectDB } from '@/lib/db'
import { MatchPayment } from '@/models/MatchPayment'
import { User } from '@/models/User'
import { FundTransaction } from '@/models/FundTransaction'
import { Event } from '@/models/Event'
import { getAuthUser } from '@/lib/auth-user'
import { isAdmin } from '@/lib/rbac'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'

export async function markPaid(matchId: string, formData: FormData) {
  const authUser = await getAuthUser()
  if (!authUser) return { success: false, message: 'Not authenticated' }
  await connectDB()
  const user = await User.findOne({ clerkId: authUser.clerkId }).lean<any>()
  if (!user) return { success: false, message: 'User not found' }
  const match = await Event.findById(matchId).select('clubId').lean<any>()
  if (!match?.clubId) return { success: false, message: 'Match not found' }
  const amount = parseFloat(String(formData.get('amount') || '0'))
  const reference = String(formData.get('reference') || '')

  try {
    await MatchPayment.updateOne(
      { matchId, userId: user._id, clubId: match.clubId },
      {
        clubId: match.clubId,
        amount,
        status: 'pending',
        reference: reference || `Payment by ${user.name}`,
        requestedAt: new Date()
      },
      { upsert: true }
    )
    revalidatePath(`/match-payments/${matchId}`)
    return { success: true, message: 'Payment marked as pending' }
  } catch (error) {
    return { success: false, message: 'Failed to mark payment' }
  }
}

export async function confirmPayment(matchId: string, formData: FormData) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role)) return { success: false, message: 'Unauthorized' }
  await connectDB()

  const match = await Event.findById(matchId).lean<any>()
  if (!match) return { success: false, message: 'Match not found' }

  const userId = String(formData.get('userId'))
  const amount = parseFloat(String(formData.get('amount') || '0'))
  const adminNote = String(formData.get('adminNote') || '')

  try {
    await MatchPayment.updateOne(
      { matchId, userId, clubId: match.clubId },
      {
        clubId: match.clubId,
        amount,
        status: 'paid',
        confirmedBy: authUser?.mongoId,
        confirmedAt: new Date(),
        adminNote
      }
    )

    // Create fund transaction for confirmed payment
    await FundTransaction.create({
      clubId: match.clubId,
      teamId: null,
      type: 'contribution',
      amount,
      date: new Date(),
      reason: `Match payment: ${match.title}`,
      createdBy: authUser?.mongoId,
      memberId: userId
    })

    // Send payment confirmation notification
    try {
      await createNotification(
        [userId],
        `Payment confirmed for ${match.title}: $${amount}`,
        'success',
        `/match-payments/${matchId}`
      )
    } catch (error) {
      console.error('Failed to send payment confirmation notification:', error)
    }

    revalidatePath(`/match-payments/${matchId}`)
    return { success: true, message: 'Payment confirmed successfully' }
  } catch (error) {
    return { success: false, message: 'Failed to confirm payment' }
  }
}

export async function rejectPayment(matchId: string, formData: FormData) {
  const authUser = await getAuthUser()
  if (!isAdmin(authUser?.role)) return { success: false, message: 'Unauthorized' }
  await connectDB()
  const match = await Event.findById(matchId).select('clubId').lean<any>()
  if (!match?.clubId) return { success: false, message: 'Match not found' }
  const userId = String(formData.get('userId'))
  const adminNote = String(formData.get('adminNote') || '')

  try {
    await MatchPayment.updateOne(
      { matchId, userId, clubId: match.clubId },
      {
        clubId: match.clubId,
        status: 'rejected',
        confirmedBy: authUser?.mongoId,
        confirmedAt: new Date(),
        adminNote
      }
    )

    await createNotification(
      [userId],
      `Payment rejected for match. Note: ${adminNote}`,
      'warning',
      `/match-payments/${matchId}`
    )

    revalidatePath(`/match-payments/${matchId}`)
    return { success: true, message: 'Payment rejected' }
  } catch (error) {
    return { success: false, message: 'Failed to reject payment' }
  }
}
