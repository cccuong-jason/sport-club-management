'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { UserPlus, ShieldCheck, Trophy } from 'lucide-react'

const steps = [
    {
        id: 1,
        name: 'Sign Up Free',
        description: 'Create your account in seconds using your email or Google account.',
        icon: UserPlus,
    },
    {
        id: 2,
        name: 'Join Your Club',
        description: 'Find your existing team or create a brand new club space for your squad.',
        icon: ShieldCheck,
    },
    {
        id: 3,
        name: 'Manage Together',
        description: 'Track attendance, collect funds, and organize events in one central hub.',
        icon: Trophy,
    },
]

export function HowItWorksSection() {
    return (
        <section className="bg-slate-50 py-24 sm:py-32 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-primary font-sans uppercase tracking-wider">
                        Clear Path to the Pitch
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
                        How It Works
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600 font-sans">
                        We built our onboarding to be entirely frictionless.
                        Get your whole team connected and organized before your next training session.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    {/* Main Illustration */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative w-full h-[300px] sm:h-[400px] mb-16 rounded-2xl overflow-hidden shadow-sm border border-green-100 bg-white"
                    >
                        <Image
                            src="/landing/how-it-works.png"
                            alt="How it works visual flow"
                            fill
                            className="object-contain p-8"
                        />
                    </motion.div>

                    {/* Text Steps */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.15 }}
                                className="relative flex flex-col items-center text-center p-6 bg-white rounded-lg border border-green-50 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-primary">
                                    <step.icon className="h-7 w-7" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 font-heading mb-2">
                                    <span className="text-primary mr-2">{step.id}.</span>
                                    {step.name}
                                </h3>
                                <p className="text-slate-600 font-sans leading-relaxed">
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
