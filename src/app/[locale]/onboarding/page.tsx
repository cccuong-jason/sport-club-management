import { UserButton } from "@clerk/nextjs"
import { getAuthUser } from "@/lib/auth-user"
import { redirect } from "next/navigation"
import { OnboardingOptions } from "./OnboardingOptions"

export default async function OnboardingPage() {
    const user = await getAuthUser()

    if (!user) {
        redirect('/')
    }

    // Protect routes based on role advancement
    if (user.status === 'active') {
        redirect('/dashboard')
    }
    if (user.status === 'pending_approval') {
        redirect('/onboarding/pending')
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
            <div className="absolute top-6 right-6">
                <UserButton />
            </div>

            <div className="max-w-4xl w-full text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl font-heading">
                    Welcome to the Club.
                </h1>
                <p className="text-lg leading-7 text-slate-600 font-sans max-w-2xl mx-auto">
                    Before we drop you into the dashboard, tell us how you'll be using the platform.
                </p>

                <OnboardingOptions />
            </div>
        </main>
    )
}
