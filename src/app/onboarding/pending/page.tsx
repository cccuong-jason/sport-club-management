import { UserButton } from "@clerk/nextjs"
import { getAuthUser } from "@/lib/auth-user"
import { redirect } from "next/navigation"

export default async function PendingPage() {
    const user = await getAuthUser()

    if (!user) redirect('/')

    // Auto-advance if admin approved them while they were waiting
    if (user.status === 'active') redirect('/dashboard')

    // Kick back if they manually hit this route but haven't selected an option yet
    if (user.status === 'onboarding') redirect('/onboarding')

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-center">
            <div className="absolute top-6 right-6">
                <UserButton />
            </div>

            <div className="max-w-md space-y-6 bg-white p-10 rounded-2xl shadow-sm border border-green-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 border border-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-heading">
                    Pending Approval
                </h1>

                <p className="text-lg leading-relaxed text-slate-600 font-sans">
                    Your request to join the club has been sent to the Manager.
                    Please wait for their approval before accessing the dashboard.
                </p>
            </div>
        </main>
    )
}
