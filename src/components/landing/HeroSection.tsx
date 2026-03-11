'use client'

import { motion, Variants, useScroll, useTransform } from 'framer-motion'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'

export function HeroSection({ userId }: { userId: string | null }) {
    const sectionRef = useRef<HTMLElement>(null)
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
        <section ref={sectionRef} className="relative overflow-hidden bg-zinc-950 text-white min-h-screen flex items-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing/hero-bg.png"
                    alt="Stadium Background"
                    fill
                    priority
                    className="object-cover object-center opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/50 to-transparent" />
                <div className="absolute inset-0 bg-zinc-950/20 mix-blend-multiply" />
            </div>

            {/* Massive Background Text Masks for Depth - With Parallax */}
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden select-none">
                <motion.div
                    style={{ y: y1 }}
                    className="text-[15vw] font-black leading-none tracking-tighter uppercase font-heading whitespace-nowrap"
                >
                    TRAINING
                </motion.div>
                <motion.div
                    style={{ y: y2 }}
                    className="text-[18vw] font-black leading-[0.8] tracking-tighter uppercase font-heading whitespace-nowrap text-primary"
                >
                    DEVELOP
                </motion.div>
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
                            <motion.h1 variants={textMaskVariants} className="text-6xl font-black tracking-tighter sm:text-8xl font-heading text-white uppercase leading-[0.9]">
                                Manage Your
                            </motion.h1>
                        </div>
                        <div className="mb-6 overflow-hidden">
                            <motion.h1 variants={textMaskVariants} className="text-6xl font-black tracking-tighter sm:text-8xl font-heading text-primary uppercase leading-[0.9]">
                                Squad.
                            </motion.h1>
                        </div>

                        <motion.p variants={itemVariants} className="text-lg sm:text-xl leading-relaxed text-zinc-300 font-sans mb-10 max-w-xl mx-auto lg:mx-0">
                            The modern, high-energy hub built for teams that demand excellence. Track attendance, unleash performance, and enforce accountability continuously.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                            {userId ? (
                                <Button asChild size="lg" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-bold px-8 py-7 text-lg rounded-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20">
                                    <Link href="/dashboard">RETURN TO DASHBOARD</Link>
                                </Button>
                            ) : (
                                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                    <Button size="lg" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-bold px-8 py-7 text-lg rounded-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20">
                                        GET STARTED FREE
                                    </Button>
                                </SignInButton>
                            )}

                            <a href="#features" className="text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors flex items-center gap-2 group py-2">
                                Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Floating Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.95, rotateY: 10 }}
                        animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.9, type: "spring", bounce: 0.3, delay: 0.4 }}
                        className="hidden lg:block relative h-[700px] w-full lg:col-span-7"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
                        <Image
                            src="/landing/dashboard-mockup.png"
                            alt="Dashboard Preview Graphic"
                            fill
                            priority
                            className="object-contain drop-shadow-2xl brightness-125 contrast-125"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Scrolling Ticker Grounding */}
            <div className="absolute bottom-0 w-full overflow-hidden bg-black/80 border-t border-zinc-800/80 backdrop-blur-md py-4 z-20">
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
                    <span className="text-white">ALEX JOINED THE CLUB</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">MATCH TONIGHT 8:00PM</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">12 PLAYERS CONFIRMED</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">MONTHLY DUES: 85%</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">SARAH VOTED MVP</span>
                    <span className="text-primary">///</span>
                    {/* Duplicate sequence */}
                    <span className="text-white">ALEX JOINED THE CLUB</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">MATCH TONIGHT 8:00PM</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">12 PLAYERS CONFIRMED</span>
                    <span className="text-primary">///</span>
                    <span className="text-white">MONTHLY DUES: 85%</span>
                </motion.div>
            </div>
        </section>
    )
}
