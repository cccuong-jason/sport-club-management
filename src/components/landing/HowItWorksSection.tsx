'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { UserPlus, Calendar, CreditCard } from 'lucide-react'
import { useRef } from 'react'

import { useTranslations } from 'next-intl'

export function HowItWorksSection() {
    const t = useTranslations('Landing.HowItWorks')
    const sectionRef = useRef<HTMLElement>(null)

    const steps = [
        {
            id: '01',
            name: t('steps.step1.name'),
            description: t('steps.step1.description'),
            icon: UserPlus,
        },
        {
            id: '02',
            name: t('steps.step2.name'),
            description: t('steps.step2.description'),
            icon: Calendar,
        },
        {
            id: '03',
            name: t('steps.step3.name'),
            description: t('steps.step3.description'),
            icon: CreditCard,
        },
    ]
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    // Parallax logic for the illustration
    const illustrationY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])

    return (
        <section ref={sectionRef} id="how-it-works" className="py-24 sm:py-32 bg-white dark:bg-zinc-950 overflow-hidden relative">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-sm font-bold leading-7 text-primary font-heading uppercase tracking-[0.2em] mb-4">
                        {t('title')}
                    </h2>
                    <p className="mt-2 text-4xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-6xl font-heading uppercase">
                        {t('heading')}
                    </p>
                    <p className="mt-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 font-sans">
                        {t('description')}
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    {/* Main Diagram Animation replacing static Image */}
                    <div className="relative mb-24 h-[400px] w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent blur-3xl -z-10" />

                        <div className="relative w-full max-w-4xl flex items-center justify-between px-8">

                            {/* SVG Connection Lines (Behind Nodes) */}
                            <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" style={{ left: 0, top: 0 }}>
                                <motion.path
                                    d="M 150 200 C 300 200, 300 120, 450 120"
                                    fill="transparent"
                                    stroke="url(#gradient-line)"
                                    strokeWidth="3"
                                    strokeDasharray="6 6"
                                    animate={{ strokeDashoffset: -20 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                />
                                <motion.path
                                    d="M 450 120 C 600 120, 600 280, 750 280"
                                    fill="transparent"
                                    stroke="url(#gradient-line)"
                                    strokeWidth="3"
                                    strokeDasharray="6 6"
                                    animate={{ strokeDashoffset: -20 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                />
                                <defs>
                                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgba(209,242,209,0.1)" />
                                        <stop offset="50%" stopColor="rgba(209,242,209,0.5)" />
                                        <stop offset="100%" stopColor="rgba(209,242,209,0.1)" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Node 1: User Sign Up */}
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="w-64 bg-white dark:bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative z-10"
                            >
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex justify-center items-center border border-zinc-200 dark:border-zinc-800">
                                        <UserPlus className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                                    </div>
                                    <div className="w-20 h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                </div>
                                <div className="space-y-3">
                                    <div className="w-full h-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md" />
                                    <div className="w-full h-10 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-md" />
                                </div>
                            </motion.div>

                            {/* Node 2: Club Space (Elevated) */}
                            <motion.div
                                animate={{ y: [5, -5, 5] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="w-72 bg-white dark:bg-zinc-950 border border-primary/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(209,242,209,0.1)] relative z-10 -mt-32"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-24 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                    <Calendar className="w-5 h-5 text-primary" />
                                </div>
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <div key={i} className="aspect-square rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
                                    ))}
                                </div>
                                <div className="w-full h-8 bg-emerald-500/20 border border-emerald-500/30 rounded-md flex items-center justify-center">
                                    <div className="w-16 h-2 bg-emerald-500/50 rounded-full" />
                                </div>
                            </motion.div>

                            {/* Node 3: Finance/Management (Lowered) */}
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="w-64 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl relative z-10 mt-32"
                            >
                                <div className="flex justify-between items-center mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                    <div className="flex gap-2 items-end">
                                        <div className="text-2xl font-black font-mono text-zinc-900 dark:text-white">$450</div>
                                        <div className="text-xs text-zinc-500 mb-1">/ $600</div>
                                    </div>
                                    <CreditCard className="w-5 h-5 text-zinc-500" />
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex gap-3 items-center">
                                                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
                                                <div className="w-16 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                            </div>
                                            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>
                    </div>

                    {/* Text Steps */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, type: "spring", bounce: 0.4, delay: index * 0.15 }}
                                className="relative flex flex-col items-center text-center p-8 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-300 group"
                            >
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                                    <step.icon className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-white font-heading mb-3 uppercase tracking-wide">
                                    <span className="text-primary mr-3 opacity-50">{step.id}</span>
                                    {step.name}
                                </h3>
                                <p className="text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
