'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { UserPlus, Calendar, CreditCard } from 'lucide-react'
import { useRef } from 'react'

const steps = [
    {
        id: '01',
        name: 'Sign Up Free',
        description: 'Create your account in seconds using your email or Google account.',
        icon: UserPlus,
    },
    {
        id: '02',
        name: 'Join Your Club',
        description: 'Find your existing team or create a brand new club space for your squad.',
        icon: Calendar,
    },
    {
        id: '03',
        name: 'Manage Together',
        description: 'Track attendance, collect funds, and organize events in one central hub.',
        icon: CreditCard,
    },
]

export function HowItWorksSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    // Parallax logic for the illustration
    const illustrationY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])

    return (
        <section ref={sectionRef} id="how-it-works" className="py-24 sm:py-32 bg-zinc-950 overflow-hidden relative">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-sm font-bold leading-7 text-primary font-heading uppercase tracking-[0.2em] mb-4">
                        Clear Path to the Pitch
                    </h2>
                    <p className="mt-2 text-4xl font-black tracking-tighter text-white sm:text-6xl font-heading uppercase">
                        How It Works
                    </p>
                    <p className="mt-6 text-lg leading-relaxed text-zinc-400 font-sans">
                        We built our onboarding to be entirely frictionless.
                        Get your whole team connected and organized before your next training session.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    {/* Main Illustration */}
                    <div className="relative">
                        <motion.div
                            style={{ y: illustrationY }}
                            className="relative h-[600px] w-full rounded-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl -z-10" />
                            <Image
                                src="/landing/how-it-works.png"
                                alt="Management Flow"
                                fill
                                className="object-contain drop-shadow-2xl brightness-110 contrast-125"
                            />
                        </motion.div>
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
                                className="relative flex flex-col items-center text-center p-8 bg-zinc-900 rounded-xl border border-zinc-800 shadow-lg hover:border-primary/50 transition-colors duration-300 group"
                            >
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800 text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                                    <step.icon className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-black text-white font-heading mb-3 uppercase tracking-wide">
                                    <span className="text-primary mr-3 opacity-50">{step.id}</span>
                                    {step.name}
                                </h3>
                                <p className="text-zinc-400 font-sans leading-relaxed">
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
