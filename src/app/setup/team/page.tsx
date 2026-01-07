import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { connectDB } from '@/lib/db'
import { Team } from '@/models/Team'
import { User } from '@/models/User'
import { redirect } from 'next/navigation'
import { TeamSetupForm } from './team-setup-form'

export default async function TeamSetupPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect('/signin')
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findOne({ email: session.user.email })
    if (!user || user.role !== 'admin') {
        // Only admin can setup team.
        // If regular user, maybe show "Ask admin to setup" or redirect to dashboard (which might show "No team")
        redirect('/dashboard')
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ managerUserId: user._id })
    if (existingTeam) {
        redirect('/dashboard')
    }

    async function createTeam(formData: FormData) {
        'use server'
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return

        await connectDB()
        const user = await User.findOne({ email: session.user.email })
        if (!user || user.role !== 'admin') return

        const name = String(formData.get('name') || '').trim()
        const sport = String(formData.get('sport') || '').trim()
        const currency = String(formData.get('currency') || 'VND')
        const language = String(formData.get('language') || 'vi') // Received from form state

        if (!name || !sport) return

        await Team.create({
            name,
            sport,
            currency,
            language,
            managerUserId: user._id,
            memberIds: [user._id] // Add manager as a member too? Usually yes.
        })

        redirect('/dashboard')
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
            <TeamSetupForm createTeam={createTeam} />
        </main>
    )
}
