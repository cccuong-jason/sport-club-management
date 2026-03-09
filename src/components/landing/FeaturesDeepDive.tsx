'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, DollarSign, Users, Activity } from 'lucide-react'

// Note: Using the dashboard mockup generated earlier as placeholder graphic for all tabs
// In a true production app, each tab would have a unique graphic
const tabs = [
    {
        id: 'events',
        title: 'Events & RSVPs',
        icon: CalendarDays,
        heading: 'Never play short-handed again.',
        content: 'Schedule matches and training sessions instantly. Players RSVP with one tap, and you always know exactly who is showing up. Send automated reminders to those who forget.',
        image: '/landing/dashboard-mockup.png'
    },
    {
        id: 'finance',
        title: 'Club Finances',
        icon: DollarSign,
        heading: 'Transparent ledger, zero friction.',
        content: 'Ditch the chaotic spreadsheets. Track member dues, match match-day subs, and log equipment purchases directly against player accounts. Complete visibility for the whole team.',
        image: '/landing/dashboard-mockup.png'
    },
    {
        id: 'team',
        title: 'Roster Management',
        icon: Users,
        heading: 'Your entire squad in your pocket.',
        content: 'Keep all player contact info, preferred positions, and emergency details secure in one place. Easily assign Admin capabilities to your coaching staff.',
        image: '/landing/dashboard-mockup.png'
    },
    {
        id: 'performance',
        title: 'Performance',
        icon: Activity,
        heading: 'Gamify your club culture.',
        content: 'Automatically track attendance rates across the season. Vote for Man of the Match and keep historical data to reward your most dedicated players at the end of the year.',
        image: '/landing/dashboard-mockup.png'
    }
]

export function FeaturesDeepDive() {
    const [activeTab, setActiveTab] = useState(tabs[0].id)

    const activeContent = tabs.find(t => t.id === activeTab)!

    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-primary font-sans uppercase tracking-wider">
                        Features
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
                        Everything your team needs.
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    {/* Tab Navigation */}
                    <div className="flex flex-col sm:flex-row justify-center gap-2 mb-12">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200
                    ${isActive ? 'text-primary bg-green-50 shadow-sm border border-green-100' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent'}
                  `}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    {tab.title}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabBadge"
                                            className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"
                                            initial={false}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Tab Content Window */}
                    <div className="bg-slate-50 rounded-2xl border border-green-100 overflow-hidden shadow-sm">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeContent.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 lg:grid-cols-2"
                            >
                                {/* Text Content */}
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                        <activeContent.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 font-heading mb-4">
                                        {activeContent.heading}
                                    </h3>
                                    <p className="text-lg leading-relaxed text-slate-600 font-sans">
                                        {activeContent.content}
                                    </p>
                                </div>

                                {/* Visual Content */}
                                <div className="relative h-[300px] lg:h-auto min-h-[400px] bg-slate-200 border-l border-green-100 overflow-hidden">
                                    {/* Fallback to standard color block if image missing, but uses our generated dashboard mockup */}
                                    <div className="absolute inset-0 p-8 flex items-center justify-center">
                                        <img
                                            src={activeContent.image}
                                            alt={`${activeContent.title} feature preview`}
                                            className="w-full h-full object-cover rounded-xl shadow-lg border border-white/20"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    )
}
