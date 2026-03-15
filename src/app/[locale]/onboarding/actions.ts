"use server"

import { getAuthUser } from "@/lib/auth-user"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { Club } from "@/models/Club"
import { ClubMember } from "@/models/ClubMember"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import mongoose from "mongoose"

function generateInviteCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function createClubAction(formData: FormData) {
    const user = await getAuthUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const name = formData.get('name') as string
    const sport = formData.get('sport') as string

    if (!name || name.trim().length < 3) return { success: false, message: "Club name must be at least 3 characters." }
    if (!sport) return { success: false, message: "Please select a sport." }

    await connectDB()

    // 1. Check if user already has an active or pending membership for this sport
    const existingMemberships = await ClubMember.find({ userId: user.mongoId, status: { $in: ['active', 'pending_approval'] } }).populate('clubId').lean<any>()

    for (const membership of existingMemberships) {
        if (membership.clubId && membership.clubId.sport === sport) {
            return { success: false, message: `You are already part of a ${sport} club. You cannot manage multiple clubs of the same sport.` }
        }
    }

    let createdClubId;

    try {
        // 2. Create the Club
        const newClub = await Club.create({
            name: name.trim(),
            sport,
            adminId: user.mongoId,
            inviteCode: generateInviteCode(),
            isPublic: true
        })

        createdClubId = newClub._id

        // 3. Create the ClubMember record (Admin + Active)
        await ClubMember.create({
            userId: user.mongoId,
            clubId: newClub._id,
            role: 'admin',
            status: 'active'
        })
    } catch (error) {
        console.error(error)
        // Manual rollback if partial creation happened
        if (createdClubId) {
            await Club.findByIdAndDelete(createdClubId).catch(console.error)
        }
        return { success: false, message: "Failed to create club. Please try again." }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function searchClubsAction(query: string, sport?: string) {
    await connectDB()

    const filter: any = { isPublic: true }
    if (sport && sport !== 'all') {
        filter.sport = sport
    }

    let clubs;

    if (query && query.trim().length >= 2) {
        filter.$text = { $search: query }
        // Find up to 10 matching public clubs
        clubs = await Club.find(
            filter,
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).limit(10).lean<any>()
    } else {
        clubs = await Club.find(filter).sort({ createdAt: -1 }).limit(10).lean<any>()
    }

    // Transform for client
    return {
        success: true,
        clubs: clubs.map((c: any) => ({
            id: String(c._id),
            name: c.name,
            sport: c.sport,
        }))
    }
}

export async function joinClubAction(clubId: string) {
    const user = await getAuthUser()
    if (!user) return { success: false, message: "Unauthorized" }

    await connectDB()

    const targetClub = await Club.findById(clubId).lean<any>()
    if (!targetClub) return { success: false, message: "Club not found." }

    // 1. Check if user already has an active or pending membership for this sport
    const existingMemberships = await ClubMember.find({ userId: user.mongoId, status: { $in: ['active', 'pending_approval'] } }).populate('clubId').lean<any>()

    for (const membership of existingMemberships) {
        if (membership.clubId && membership.clubId.sport === targetClub.sport) {
            return { success: false, message: `You are already in a ${targetClub.sport} club (${membership.clubId.name}). You must leave it before joining another.` }
        }
    }

    try {
        await ClubMember.create({
            userId: user.mongoId,
            clubId: targetClub._id,
            role: 'member',
            status: 'pending_approval'
        })
    } catch (error: any) {
        if (error.code === 11000) {
            return { success: false, message: "You have already requested to join this club." }
        }
        return { success: false, message: "Failed to send join request." }
    }

    revalidatePath('/onboarding')
    revalidatePath('/dashboard')
    redirect('/onboarding/pending')
}
