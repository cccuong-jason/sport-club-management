"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, ShieldCheck } from "lucide-react"
import { CreateClubForm } from "./CreateClubForm"
import { SearchClubForm } from "./SearchClubForm"

type FlowState = 'select' | 'create' | 'search'

export function OnboardingOptions() {
    const [flow, setFlow] = useState<FlowState>('select')

    if (flow === 'create') {
        return <CreateClubForm onBack={() => setFlow('select')} />
    }

    if (flow === 'search') {
        return <SearchClubForm onBack={() => setFlow('select')} />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto mt-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-pointer" onClick={() => setFlow('search')}>
                <div className="h-14 w-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 mb-6 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                    <User size={28} />
                </div>
                <h2 className="text-2xl font-bold font-heading mb-3 text-slate-900">I am a Player</h2>
                <p className="text-slate-600 font-sans mb-8 leading-relaxed">
                    Search for your team using their club name. Once you find them, request to join and get access to matches, RSVPs, and payments.
                </p>
                <div className="mt-auto">
                    <Button
                        size="lg"
                        className="w-full text-base font-semibold"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); setFlow('search') }}
                    >
                        Find My Club
                    </Button>
                </div>
            </div>

            <div className="flex flex-col p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-green-300 hover:shadow-md transition-all duration-200 group cursor-pointer" onClick={() => setFlow('create')}>
                <div className="h-14 w-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 mb-6 border border-slate-100 group-hover:bg-green-50 group-hover:text-emerald-600 group-hover:border-green-100 transition-colors">
                    <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-bold font-heading mb-3 text-slate-900">I am a Manager</h2>
                <p className="text-slate-600 font-sans mb-8 leading-relaxed">
                    Create a new club space. You will become the primary administrator to manage players, organize events, and track team finances.
                </p>
                <div className="mt-auto">
                    <Button
                        size="lg"
                        className="w-full text-base font-semibold text-white bg-primary hover:bg-primary/90"
                        onClick={(e) => { e.stopPropagation(); setFlow('create') }}
                    >
                        Create Club Space
                    </Button>
                </div>
            </div>
        </div>
    )
}
