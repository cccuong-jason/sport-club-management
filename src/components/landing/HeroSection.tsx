'use client'

import { motion } from 'framer-motion'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export function HeroSection({ userId }: { userId: string | null }) {
    return (
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[90vh] flex items-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing/hero-bg.png"
                    alt="Stadium Background"
                    fill
                    priority
                    className="object-cover object-center opacity-40 blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto px-6 py-24 lg:py-32 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Copy & Actions */}
                    <div className="max-w-2xl text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl font-heading text-white mb-6 leading-[1.1]">
                                Manage Your Squad <br className="hidden sm:block" />
                                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-300">With Precision.</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <p className="text-lg sm:text-xl leading-8 text-gray-300 font-sans mb-10 max-w-xl mx-auto lg:mx-0">
                                The modern, active community hub capable of handling your entire team's heartbeat. Track events, handle funds, and enforce attendance seamlessly.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6"
                        >
                            {userId ? (
                                <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                    <Link href="/dashboard">Return to Dashboard</Link>
                                </Button>
                            ) : (
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                    <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                        Get Started Free
                                    </Button>
                                </SignInButton>
                            )}

                            <a href="#features" className="text-sm font-semibold leading-6 text-white hover:text-primary transition-colors flex items-center gap-2 group py-2">
                                Explore features <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right Column: Floating Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="hidden lg:block relative h-[600px] w-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-2xl -z-10" />
                        <Image
                            src="/landing/dashboard-mockup.png"
                            alt="Dashboard Preview Graphic"
                            fill
                            priority
                            className="object-contain drop-shadow-2xl brightness-110"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Scrolling Ticker Grounding */}
            <div className="absolute bottom-0 w-full overflow-hidden bg-slate-950/80 border-t border-white/5 backdrop-blur-sm py-3">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 20,
                        ease: "linear",
                    }}
                    className="flex whitespace-nowrap gap-12 font-sans text-sm font-medium text-slate-400 uppercase tracking-widest px-6"
                >
                    <span>Alex joined the club</span>
                    <span className="text-primary">•</span>
                    <span>Match Tonight at 8:00PM</span>
                    <span className="text-primary">•</span>
                    <span>12 players confirmed</span>
                    <span className="text-primary">•</span>
                    <span>Monthly dues collected: 85%</span>
                    <span className="text-primary">•</span>
                    <span>Sarah voted Player of the Match</span>
                    <span className="text-primary">•</span>
                    {/* Duplicate for seamless loop */}
                    <span>Alex joined the club</span>
                    <span className="text-primary">•</span>
                    <span>Match Tonight at 8:00PM</span>
                    <span className="text-primary">•</span>
                    <span>12 players confirmed</span>
                    <span className="text-primary">•</span>
                    <span>Monthly dues collected: 85%</span>
                </motion.div>
            </div>
        </section>
    )
}
