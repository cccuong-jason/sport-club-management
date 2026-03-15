'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, DollarSign, Users, Activity } from 'lucide-react'

import { useTranslations } from 'next-intl'

export function FeaturesDeepDive() {
    const t = useTranslations('Landing.FeaturesDeepDive')

    // We recreate tabs array inside to use `t`
    const tabs = [
        {
            id: 'events',
            title: t('tabs.events.title'),
            icon: CalendarDays,
            heading: t('tabs.events.heading'),
            content: t('tabs.events.content')
        },
        {
            id: 'finance',
            title: t('tabs.finance.title'),
            icon: DollarSign,
            heading: t('tabs.finance.heading'),
            content: t('tabs.finance.content')
        },
        {
            id: 'team',
            title: t('tabs.team.title'),
            icon: Users,
            heading: t('tabs.team.heading'),
            content: t('tabs.team.content')
        },
        {
            id: 'performance',
            title: t('tabs.performance.title'),
            icon: Activity,
            heading: t('tabs.performance.heading'),
            content: t('tabs.performance.content')
        }
    ]

    const [activeTab, setActiveTab] = useState(tabs[0].id)

    const activeContent = tabs.find(t => t.id === activeTab)!

    return (
        <section id="features" className="bg-zinc-50 dark:bg-zinc-950 py-24 sm:py-32">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-sm font-bold leading-7 text-primary font-heading uppercase tracking-[0.2em] mb-4">
                        {t('title')}
                    </h2>
                    <p className="mt-2 text-4xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-6xl font-heading uppercase">
                        {t('heading')}
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
                                        relative flex items-center justify-center gap-3 px-8 py-4 rounded-none font-bold text-sm tracking-wider uppercase transition-all duration-300 border
                                        ${isActive ? 'text-zinc-950 bg-primary border-primary shadow-[4px_4px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_#ffffff]' : 'text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700'}
                                    `}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    {tab.title}
                                </button>
                            )
                        })}
                    </div>

                    {/* Tab Content Window */}
                    <div className="bg-white dark:bg-zinc-900 rounded-none border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
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
                                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-none bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                                        <activeContent.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white font-heading mb-6 uppercase leading-none">
                                        {activeContent.heading}
                                    </h3>
                                    <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 font-sans">
                                        {activeContent.content}
                                    </p>
                                </div>

                                {/* Visual Content / CSS Mockups */}
                                <div className="relative h-[300px] lg:h-auto min-h-[500px] w-full bg-zinc-100/80 dark:bg-zinc-950/80 border-l border-zinc-200 dark:border-zinc-800 overflow-hidden lg:col-span-7 flex items-center justify-center p-8 group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent z-0 transition-opacity duration-700 group-hover:opacity-100 opacity-50" />

                                    {/* MOCKUP CONTAINER */}
                                    <div className="relative z-10 w-full max-w-lg h-full max-h-[400px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-6 flex flex-col gap-4 transform transition-transform duration-700 hover:scale-[1.02] overflow-hidden">

                                        {/* Header area of Mockup */}
                                        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                                                <div className="flex flex-col gap-2">
                                                    <div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                                                    <div className="w-16 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                <activeContent.icon className="w-4 h-4 text-zinc-500" />
                                            </div>
                                        </div>

                                        {/* Dynamic Content based on Tab */}
                                        <div className="flex-1 flex flex-col gap-3">

                                            {activeTab === 'events' && (
                                                <>
                                                    <div className="w-full h-12 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center px-4 justify-between">
                                                        <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-primary" /><div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full" /></div>
                                                        <div className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">{t('mockups.inOut')}</div>
                                                    </div>
                                                    <div className="w-full h-12 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center px-4 justify-between">
                                                        <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-emerald-500" /><div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full" /></div>
                                                        <div className="text-xs font-bold text-zinc-500">{t('mockups.pending')}</div>
                                                    </div>
                                                    <div className="w-full h-12 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center px-4 justify-between opacity-50">
                                                        <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-red-500" /><div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full" /></div>
                                                        <div className="text-xs font-bold text-red-500">{t('mockups.out')}</div>
                                                    </div>
                                                </>
                                            )}

                                            {activeTab === 'finance' && (
                                                <>
                                                    <div className="w-full h-24 bg-primary/10 border border-primary/20 rounded-lg flex flex-col justify-center px-6 mb-2">
                                                        <div className="text-xs font-bold text-primary mb-1 tracking-widest uppercase">{t('mockups.clubBalance')}</div>
                                                        <div className="text-3xl font-black text-zinc-900 dark:text-white font-mono">$1,240.50</div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <div className="flex-1 h-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col justify-center px-4">
                                                            <div className="w-12 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-2" />
                                                            <div className="text-zinc-600 dark:text-zinc-300 font-mono text-sm">+ $150</div>
                                                        </div>
                                                        <div className="flex-1 h-16 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col justify-center px-4">
                                                            <div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-2" />
                                                            <div className="text-zinc-600 dark:text-zinc-300 font-mono text-sm">- $45</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {activeTab === 'team' && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[1, 2, 3, 4].map(idx => (
                                                        <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                                                            <div className="flex flex-col gap-1.5 flex-1">
                                                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                                                                <div className="w-1/2 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {activeTab === 'performance' && (
                                                <div className="flex-1 flex flex-col justify-end gap-2 pb-2">
                                                    <div className="flex items-end justify-between h-32 px-4 gap-2">
                                                        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                                                            <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                                                        ))}
                                                    </div>
                                                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between items-center px-2">
                                                        <div className="w-20 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                                        <div className="text-xs font-bold text-primary">+12%</div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
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
