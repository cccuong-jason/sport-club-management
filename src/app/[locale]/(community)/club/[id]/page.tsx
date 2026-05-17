import { getAuthUser } from "@/lib/auth-user"
import { connectDB } from "@/lib/db"
import { Club } from "@/models/Club"
import { ClubMember } from "@/models/ClubMember"
import { notFound, redirect } from "next/navigation"
import { ShieldCheck, MapPin, Users, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { joinClubAction } from "@/app/[locale]/onboarding/actions"
import { getTranslations } from "next-intl/server"

export default async function ClubProfilePage({
    params
}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const resolvedParams = await params
    const t = await getTranslations("Community")
    const user = await getAuthUser()

    if (!user) {
        redirect('/')
    }

    await connectDB()

    const club = await Club.findById(resolvedParams.id).lean<any>()
    if (!club) {
        notFound()
    }

    const memberCount = await ClubMember.countDocuments({ clubId: club._id, status: 'active' })

    const isFreeAgent = user.status === 'free_agent'
    const isMember = user.memberships.some(m => m.clubId === String(club._id))
    
    const handleJoin = async (formData: FormData) => {
        "use server"
        await joinClubAction(String(club._id))
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -z-10" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="h-24 w-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                        {/* Placeholder for real club logo */}
                        <ShieldCheck size={48} className="text-primary/70" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-1 capitalize">
                            {club.sport}
                        </div>
                        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
                            {club.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-sans">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} />
                                {club.location?.city ? `${club.location.city}, ${club.location.country}` : 'Global Context'}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users size={16} />
                                {memberCount} {memberCount === 1 ? 'member' : 'members'}
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 mt-6 md:mt-0">
                        {isMember ? (
                            <Button variant="secondary" disabled className="w-full md:w-auto font-semibold">
                                Already a Member
                            </Button>
                        ) : isFreeAgent ? (
                            <form action={handleJoin}>
                                <Button type="submit" size="lg" className="w-full md:w-auto font-semibold text-white bg-primary hover:bg-primary/90">
                                    Request to Join
                                </Button>
                            </form>
                        ) : (
                            <Button variant="outline" disabled className="w-full md:w-auto font-semibold">
                                Unavailable
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                        <Activity size={20} />
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                        Recent Activity
                    </h2>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                        No public activities posted yet.
                    </p>
                </div>
            </div>
        </div>
    )
}
