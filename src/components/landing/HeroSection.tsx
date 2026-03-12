'use client'

import { motion, Variants, useScroll, useTransform } from 'framer-motion'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'

export function HeroSection({ userId }: { userId: string | null }) {
    const sectionRef = useRef<HTMLElement>(null)
    const t = useTranslations('Landing.Hero')
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    })

    // Parallax logic: y2 moves up faster, y1 moves down
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])

    // Parent stagger variant
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    // Spring reveal variant
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 40, rotateX: 10 },
        show: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.8, type: "spring", bounce: 0.4 }
        }
    }

    // Text mask variant for headlines
    const textMaskVariants: Variants = {
        hidden: { y: "100%" },
        show: {
            y: "0%",
            transition: { duration: 0.6, type: "spring", bounce: 0.2 }
        }
    }

    return (
        <section ref={sectionRef} className="relative overflow-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white min-h-screen flex items-center">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing/hero-bg.png"
                    alt="Stadium Background"
                    fill
                    priority
                    className="object-cover object-center opacity-10 dark:opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/80 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/50 dark:to-transparent" />
                <div className="absolute inset-0 bg-white/20 dark:bg-zinc-950/20 mix-blend-multiply" />
            </div>

            {/* Massive Background Text Masks for Depth - With Parallax */}
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden select-none">
                <motion.div
                    style={{ y: y1 }}
                    className="text-[15vw] font-black leading-none tracking-tighter uppercase font-heading whitespace-nowrap text-zinc-900/10 dark:text-white/10"
                >
                    {t('training')}
                </motion.div>
                {/* <motion.div
                    style={{ y: y2 }}
                    className="text-[18vw] font-black leading-[0.8] tracking-tighter uppercase font-heading whitespace-nowrap text-primary/40 dark:text-primary/20"
                >
                    {t('develop')}
                </motion.div> */}
            </div>

            <div className="container relative z-10 mx-auto px-6 py-24 lg:py-32 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left Column: Copy & Actions */}
                    <motion.div
                        className="max-w-2xl text-center lg:text-left lg:col-span-5"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <div className="mb-6 overflow-hidden">
                            <motion.h1 variants={textMaskVariants} className="text-6xl font-black tracking-tighter sm:text-8xl font-heading text-zinc-900 dark:text-white uppercase leading-[0.9]">
                                {t('manageYour')}
                            </motion.h1>
                        </div>
                        <div className="mb-6 overflow-hidden">
                            <motion.h1 variants={textMaskVariants} className="text-6xl font-black tracking-tighter sm:text-8xl font-heading text-primary uppercase leading-[0.9]">
                                {t('squad')}
                            </motion.h1>
                        </div>

                        <motion.p variants={itemVariants} className="text-lg sm:text-xl leading-relaxed text-zinc-600 dark:text-zinc-300 font-sans mb-10 max-w-xl mx-auto lg:mx-0">
                            {t('description')}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                            {userId ? (
                                <Button asChild size="lg" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-bold px-8 py-7 text-lg rounded-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20">
                                    <Link href="/dashboard">{t('returnToDashboard')}</Link>
                                </Button>
                            ) : (
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                    <Button size="lg" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-bold px-8 py-7 text-lg rounded-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20">
                                        {t('getStartedFree')}
                                    </Button>
                                </SignInButton>
                            )}

                            <a href="#features" className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors flex items-center gap-2 group py-2">
                                {t('explore')} <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Floating Mockup in Pure CSS/React */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.9, type: "spring", bounce: 0.3, delay: 0.4 }}
                        className="hidden lg:block relative h-[700px] w-full lg:col-span-7 perspective-[1000px]"
                    >
                        <div className="absolute inset-0 flex items-center justify-center translate-z-0">
                            {/* Base Dashboard Window */}
                            <motion.div
                                animate={{ y: [-20, 20, -20], rotateX: [10, 15, 10], rotateY: [-15, -10, -15] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-full max-w-[700px] aspect-[4/3] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
                            >
                                {/* Top Bar (Header) */}
                                <div className="h-12 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/50 flex items-center px-4 gap-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                    </div>
                                    <div className="flex-1" />
                                    <div className="w-48 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50" />
                                </div>

                                {/* Middle Section: Inner "App" Content */}
                                <div className="p-4 grid grid-cols-3 gap-4 flex-1">
                                    {/* Sidebar representation */}
                                    <div className="col-span-1 space-y-3">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                            <div className="w-16 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                                        </div>
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-full h-8 rounded-sm bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50" />
                                        ))}
                                    </div>

                                    {/* Main Content Area */}
                                    <div className="col-span-2 space-y-6">
                                        {/* Top Stats */}
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { label: "Attendance", value: "95%", trend: "+5%" },
                                                { label: "Treasury", value: "$4.2K", trend: "+$250" },
                                                { label: "Upcoming", value: "Vs United", trend: "Tom." }
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col gap-2">
                                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</div>
                                                    <div className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</div>
                                                    <div className="text-xs text-primary font-bold">{stat.trend}</div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Chart Area */}
                                        <div className="bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl flex-1 h-48 p-4 flex flex-col justify-end gap-2">
                                            <div className="flex items-end justify-between h-full gap-2">
                                                {[30, 50, 45, 70, 60, 90, 80, 100].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-gradient-to-t from-primary/10 to-primary/80 rounded-t-sm" style={{ height: `${h}%` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Element 1 (Mobile Mockup) */}
                            <motion.div
                                animate={{ y: [-15, 15, -15] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute z-30 bottom-10 -right-4 w-[180px] h-[360px] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-300/50 dark:border-zinc-700/50 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 translate-z-20 rotate-y-[-10deg] rotate-x-[5deg]"
                            >
                                <div className="w-full h-full border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] overflow-hidden flex flex-col bg-zinc-50 dark:bg-zinc-900">
                                    <div className="h-6 w-full flex justify-center pt-2">
                                        <div className="w-16 h-4 bg-zinc-200 dark:bg-zinc-950 rounded-full" />
                                    </div>
                                    <div className="flex-1 p-4 space-y-4">
                                        <div className="w-20 h-5 bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-full" />
                                        <div className="w-full h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
                                        <div className="flex justify-between">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                                        </div>
                                        <div className="w-full h-16 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 rounded-xl" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Element 2 (Notification Pill) */}
                            <motion.div
                                animate={{ y: [10, -10, 10] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute z-40 top-20 -left-10 w-fit px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl dark:shadow-2xl rounded-2xl flex items-center gap-4 translate-z-30"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-primary rounded-sm rotate-45" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-zinc-900 dark:text-white leading-none mb-1">{t('ticker.payment')}</div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{t('ticker.updated')}</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scrolling Ticker Grounding */}
            <div className="absolute bottom-0 w-full overflow-hidden bg-white/80 dark:bg-black/80 border-t border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md py-4 z-20">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                    }}
                    className="flex whitespace-nowrap gap-12 font-heading text-sm font-bold text-zinc-400 uppercase tracking-[0.2em] px-6"
                >
                    <span className="text-white">{t('ticker.alex')}</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">{t('ticker.match')}</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">{t('ticker.players')}</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">{t('ticker.dues')}</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">{t('ticker.sarah')}</span>
                    <span className="text-primary">///</span>
                    {/* Duplicate sequence */}
                    <span className="text-white">{t('ticker.alex')}</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">{t('ticker.match')}</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">{t('ticker.players')}</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">{t('ticker.dues')}</span>
                </motion.div>
            </div>
        </section>
    )
}
