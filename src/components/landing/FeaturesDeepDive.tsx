'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, DollarSign, Users, Activity } from 'lucide-react'

const tabs = [
    {
        id: 'events',
        title: 'Events & RSVPs',
        icon: CalendarDays,
        heading: 'NEVER PLAY SHORT-HANDED.',
        content: 'Schedule matches and training sessions instantly. Players RSVP with one tap, and you always know exactly who is showing up. Send automated reminders to those who forget.',
        image: '/landing/dashboard-mockup.png'
    },
    {
        id: 'finance',
        title: 'Club Finances',
        icon: DollarSign,
        heading: 'TRANSPARENT LEDGER.',
        content: 'Ditch the chaotic spreadsheets. Track member dues, match-day subs, and log equipment purchases directly against player accounts. Complete visibility for the whole team.',
        image: '/landing/dashboard-mockup.png'
    },
    {
        id: 'team',
        title: 'Roster Management',
        icon: Users,
        heading: 'SQUAD IN YOUR POCKET.',
        content: 'Keep all player contact info, preferred positions, and emergency details secure in one place. Easily assign Admin capabilities to your coaching staff.',
        image: '/landing/dashboard-mockup.png'
    },
    {
        id: 'performance',
        title: 'Performance',
        icon: Activity,
        heading: 'GAMIFY YOUR CULTURE.',
        content: 'Automatically track attendance rates across the season. Vote for Man of the Match and keep historical data to reward your most dedicated players at the end of the year.',
        image: '/landing/dashboard-mockup.png'
    }
]

export function FeaturesDeepDive() {
    const [activeTab, setActiveTab] = useState(tabs[0].id)

    const activeContent = tabs.find(t => t.id === activeTab)!

    return (
        <section id="features" className="bg-zinc-950 py-24 sm:py-32">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-sm font-bold leading-7 text-primary font-heading uppercase tracking-[0.2em] mb-4">
                        Core Capabilities
                    </h2>
                    <p className="mt-2 text-4xl font-black tracking-tighter text-white sm:text-6xl font-heading uppercase">
                        Everything Required.
                    </p>
                </div>

                <div className="mx-auto max-w-6xl">
                    {/* Tab Navigation */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        relative flex items-center justify-center gap-3 px-8 py-4 rounded-none font-bold text-sm tracking-wider uppercase transition-all duration-300
                                        ${isActive ? 'text-zinc-950 bg-primary shadow-[4px_4px_0px_#ffffff]' : 'text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-white hover:border-zinc-700'}
                                    `}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    {tab.title}
                                </button>
                            )
                        })}
                    </div>

                    {/* Tab Content Window */}
                    <div className="bg-zinc-900 rounded-none border border-zinc-800 overflow-hidden shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeContent.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                                className="grid grid-cols-1 lg:grid-cols-12"
                            >
                                {/* Text Content */}
                                <div className="p-8 lg:p-16 flex flex-col justify-center lg:col-span-5">
                                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-none bg-zinc-950 border border-zinc-800">
                                        <activeContent.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-white font-heading mb-6 uppercase leading-none">
                                        {activeContent.heading}
                                    </h3>
                                    <p className="text-lg leading-relaxed text-zinc-400 font-sans">
                                        {activeContent.content}
                                    </p>
                                </div>

                                {/* Visual Content */}
                                <div className="relative h-[300px] lg:h-auto min-h-[500px] bg-zinc-950 border-l border-zinc-800 overflow-hidden lg:col-span-7 flex items-center justify-center p-8">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent z-0" />
                                    <img
                                        src={activeContent.image}
                                        alt={`${activeContent.title} feature preview`}
                                        className="relative z-10 w-full h-auto object-contain drop-shadow-2xl brightness-125 contrast-125 transition-transform duration-700 hover:scale-105"
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    )
}
