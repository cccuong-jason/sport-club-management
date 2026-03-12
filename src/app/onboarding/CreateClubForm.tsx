"use client"

import { useState } from "react"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { createClubAction } from "./actions"
import { toast } from "sonner"

export function CreateClubForm({ onBack }: { onBack: () => void }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const res = await createClubAction(formData)
            if (res && !res.success) {
                setError(res.message)
                toast.error(res.message)
            }
        })
    }

    return (
        <div className="w-full max-w-md mx-auto text-left animate-in fade-in slide-in-from-right-4 duration-300">
            <button
                onClick={onBack}
                className="flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
            >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to options
            </button>

            <h2 className="text-2xl font-bold font-heading mb-2 text-slate-900">Create a New Club</h2>
            <p className="text-slate-600 mb-6 font-sans">Set up your workspace and invite members.</p>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border object-contain border-slate-200 shadow-sm">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700">Club Name</label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Hanoi FC"
                        required
                        minLength={3}
                        className="h-12"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="sport" className="text-sm font-semibold text-slate-700">Primary Sport</label>
                    <Select name="sport" required>
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="football">Football / Soccer</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="volleyball">Volleyball</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 mt-4 text-base font-semibold"
                    disabled={isPending}
                >
                    {isPending ? "Creating Space..." : "Create Club"}
                </Button>
            </form>
        </div>
    )
}
