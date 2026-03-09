"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Search, Loader2 } from "lucide-react"
import { searchClubsAction, joinClubAction } from "./actions"
import { toast } from "sonner"

export function SearchClubForm({ onBack }: { onBack: () => void }) {
    const [query, setQuery] = useState("")
    const [sportFilter, setSportFilter] = useState("all")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, startSearch] = useTransition()
    const [isJoining, startJoin] = useTransition()
    const [joinTargetId, setJoinTargetId] = useState<string | null>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        const debounce = setTimeout(() => {
            startSearch(async () => {
                const res = await searchClubsAction(query, sportFilter)
                if (res.success) {
                    setSearchResults(res.clubs || [])
                }
            })
        }, query.trim().length > 0 ? 400 : 0)

        return () => clearTimeout(debounce)
    }, [query, sportFilter])

    const handleJoin = (clubId: string) => {
        setError("")
        setJoinTargetId(clubId)
        startJoin(async () => {
            const res = await joinClubAction(clubId)
            if (res && !res.success) {
                setError(res.message)
                toast.error(res.message)
                setJoinTargetId(null)
            }
        })
    }

    return (
        <div className="w-full max-w-md mx-auto text-left animate-in fade-in slide-in-from-left-4 duration-300">
            <button
                onClick={onBack}
                className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
            >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to options
            </button>

            <h2 className="text-2xl font-bold font-heading mb-2 text-slate-900">Find Your Club</h2>
            <p className="text-slate-600 mb-6 font-sans">Search for an existing club public space to request access.</p>

            {error && (
                <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
                    {error}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder="Search by club name..."
                        className="pl-10 h-12 bg-white"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="sm:w-1/3">
                    <Select value={sportFilter} onValueChange={setSportFilter}>
                        <SelectTrigger className="h-12 bg-white">
                            <SelectValue placeholder="All Sports" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sports</SelectItem>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="volleyball">Volleyball</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="badminton">Badminton</SelectItem>
                            <SelectItem value="pingpong">Ping Pong</SelectItem>
                            <SelectItem value="esports">Esports</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-3">
                {isSearching ? (
                    <div className="flex justify-center p-8 text-slate-400">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : searchResults.length > 0 ? (
                    searchResults.map(club => (
                        <div key={club.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
                            <div>
                                <h3 className="font-semibold text-slate-900 text-lg">{club.name}</h3>
                                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                                    {club.sport}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleJoin(club.id)}
                                disabled={isJoining}
                                className="font-semibold"
                            >
                                {isJoining && joinTargetId === club.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : "Join"}
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                        {query.trim().length > 0
                            ? `No clubs found matching "${query}"`
                            : `No public clubs available.`}
                    </div>
                )}
            </div>
        </div>
    )
}
