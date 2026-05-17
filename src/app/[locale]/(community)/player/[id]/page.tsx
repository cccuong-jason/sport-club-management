import { getAuthUser } from "@/lib/auth-user"
import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { notFound, redirect } from "next/navigation"
import { User as UserIcon, MapPin, Target, Activity } from "lucide-react"
import Image from "next/image"

export default async function PlayerProfilePage({
    params
}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const resolvedParams = await params
    const authUser = await getAuthUser()

    if (!authUser) {
        redirect('/')
    }

    await connectDB()

    const player = await User.findById(resolvedParams.id).lean<any>()
    if (!player) {
        notFound()
    }

    // Determine location string depending on privacy settings if applicable, or just city/country
    // Right now it's using standard fallback for MVP.
    const locationString = player.publicLocation?.city && player.publicLocation?.country
        ? `${player.publicLocation.city}, ${player.publicLocation.country}`
        : 'Registered Free Agent'

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-full -z-10" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="h-24 w-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                        {player.photoUrl ? (
                            <Image src={player.photoUrl} alt={player.name} width={96} height={96} className="h-full w-full object-cover" />
                        ) : (
                            <UserIcon size={48} className="text-emerald-500/70" />
                        )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                        {player.onboardingCompleted && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-1">
                                Free Agent
                            </div>
                        )}
                        <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
                            {player.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-sm font-sans">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} />
                                {locationString}
                            </div>
                            {player.position && (
                                <div className="flex items-center gap-1.5">
                                    <Target size={16} />
                                    {player.position}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                        <Activity size={20} />
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                        Recent Posts
                    </h2>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                        No activity available to display.
                    </p>
                </div>
            </div>
        </div>
    )
}
