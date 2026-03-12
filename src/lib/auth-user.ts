import { auth, currentUser } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { ClubMember } from '@/models/ClubMember'
import { Club } from '@/models/Club'
import { cookies } from 'next/headers'

export type ClubMembership = {
    clubId: string
    clubName: string
    sport: string
    role: 'admin' | 'member'
    status: 'active' | 'inactive' | 'pending_approval' | 'leaving'
}

export type AuthUser = {
    clerkId: string
    email: string
    mongoId: string
    name: string
    photoUrl?: string
    memberships: ClubMembership[]

    // The currently active or default club context for legacy/incremental compatibility
    role: 'admin' | 'member'
    status: 'active' | 'inactive' | 'unavailable' | 'pending_approval' | 'onboarding'
    activeClubId?: string
    activeClubName?: string
    activeClubSport?: string
}

/**
 * Server-side helper: returns the authenticated user's data merged from
 * Clerk and MongoDB. Returns null if the user is not signed in or not
 * found in the database.
 *
 * On the user's first sign-in with Clerk, this auto-creates or links
 * their MongoDB User record via their email address.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
    const { userId } = await auth()
    if (!userId) return null

    await connectDB()

    // Try to find by clerkId first (fast path for returning users)
    let dbUser = await User.findOne({ clerkId: userId }).lean<any>()

    if (!dbUser) {
        // First time signing in — get the Clerk profile and link / create DB record
        const clerkUser = await currentUser()
        if (!clerkUser) return null

        const email = clerkUser.emailAddresses[0]?.emailAddress
        if (!email) return null

        // Instead of automatically assigning admin or pending_approval based on count, 
        // we put everyone in 'onboarding'. They must claim their role in the UI.

        // Handle parallel requests creating the same user simultaneously.
        try {
            dbUser = await User.findOneAndUpdate(
                { email },
                {
                    $set: {
                        clerkId: userId,
                        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || email.split('@')[0],
                        photoUrl: clerkUser.imageUrl,
                    }
                },
                { new: true, upsert: true }
            ).lean<any>()
        } catch (error: any) {
            if (error.code === 11000) {
                // If a duplicate key collision happened on clerkId_1, another thread just inserted it.
                dbUser = await User.findOne({ clerkId: userId }).lean<any>()
            } else {
                throw error
            }
        }
    }

    if (!dbUser) return null

    // Fetch all memberships for this user
    // We populate the clubId field to grab the club name and sport
    let membershipsDb = await ClubMember.find({ userId: dbUser._id }).populate('clubId').lean<any[]>()

    // Apply 7-day auto-release rule for 'leaving' members
    const now = new Date()
    const autoReleaseThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    let hasCleanups = false

    membershipsDb = membershipsDb.filter(m => {
        if (m.status === 'leaving' && m.leaveRequestedAt && new Date(m.leaveRequestedAt) < autoReleaseThreshold) {
            // Member has been waiting for more than 7 days, auto-release them asynchronously
            ClubMember.findByIdAndDelete(m._id).exec().catch(console.error)
            hasCleanups = true
            return false // Remove them from current session array
        }
        return true
    })

    const memberships: ClubMembership[] = membershipsDb.filter(m => m.clubId != null).map(m => ({
        clubId: String(m.clubId._id),
        clubName: m.clubId.name,
        sport: m.clubId.sport,
        role: m.role,
        status: m.status
    }))

    // Determine a default context for the user to maintain backwards compatibility
    // while we transition to a full multi-tenant route structure.
    const cookieStore = await cookies()
    const ctxPref = cookieStore.get('active_club_context')?.value

    let defaultRole: 'admin' | 'member' = 'member'
    let defaultStatus: 'active' | 'inactive' | 'unavailable' | 'pending_approval' | 'onboarding' = 'onboarding'
    let activeClubId: string | undefined = undefined
    let activeClubName: string | undefined = undefined
    let activeClubSport: string | undefined = undefined

    if (memberships.length > 0) {
        // Try to respect the cookie constraint first, otherwise fallback to the first active membership
        const defaultMembership = memberships.find(m => m.status === 'active' && m.clubId === ctxPref)
            || memberships.find(m => m.status === 'active')
            || memberships[0]

        defaultRole = defaultMembership.role
        defaultStatus = defaultMembership.status as any
        activeClubId = defaultMembership.clubId
        activeClubName = defaultMembership.clubName
        activeClubSport = defaultMembership.sport
    }

    return {
        clerkId: userId,
        email: dbUser.email,
        mongoId: String(dbUser._id),
        name: dbUser.name,
        photoUrl: dbUser.photoUrl,
        memberships,
        role: defaultRole,
        status: defaultStatus,
        activeClubId,
        activeClubName,
        activeClubSport
    }
}
