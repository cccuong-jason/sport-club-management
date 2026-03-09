'use client'

import { motion } from 'framer-motion'
import { CalendarDays, DollarSign, Users, Trophy } from 'lucide-react'
import Image from 'next/image'

const features = [
    {
        name: 'Event Management',
        description: 'Create matches and trainings. Track RSVPs instantly to ensure you always have enough players on the pitch.',
        icon: CalendarDays,
    },
    {
        name: 'Transparent Funds',
        description: 'Track club finances, log equipment purchases, and process match payments directly integrated with player attendance.',
        icon: DollarSign,
    },
    {
        name: 'Team Hub',
        description: 'Manage the full roster. Assign roles, store contact information, and organize your squad list smoothly.',
        icon: Users,
    },
    {
        name: 'Performance Metrics',
        description: 'Player of the Match voting and leaderboard stats to naturally build a highly engaged, energetic club culture.',
        icon: Trophy,
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-white sm:py-32">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-primary font-sans uppercase tracking-wider">Everything you need</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">
                        No more spreadsheets. Just football.
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 font-sans">
                        Built as a robust internal tool, we wrap complex management tasks behind a beautifully simple, energetic UI your team will love to use.
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">

                        {/* 3D Mockup Graphic */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="relative hidden lg:block rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 h-[500px]"
                        >
                            <Image
                                src="/landing/dashboard-mockup.png"
                                alt="Floating Abstract Dashboard UI Cards"
                                fill
                                className="object-cover object-center"
                            />
                        </motion.div>

                        {/* Feature Grid */}
                        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex flex-col group relative"
                                >
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary">
                                        <feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" aria-hidden="true" />
                                    </div>
                                    <dt className="text-xl font-semibold leading-7 text-gray-900 font-heading mb-2">
                                        {feature.name}
                                    </dt>
                                    <dd className="flex flex-auto flex-col text-base leading-7 text-gray-600 font-sans">
                                        <p className="flex-auto">{feature.description}</p>
                                    </dd>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
