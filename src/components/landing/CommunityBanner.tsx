'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const stats = [
    { id: 1, name: 'Matches Managed', value: '500+' },
    { id: 2, name: 'Active Players', value: '2,000+' },
    { id: 3, name: 'Funds Processed', value: '$50k+' },
]

export function CommunityBanner() {
    return (
        <section className="bg-slate-900 py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/landing/community-photo.png"
                    alt="Players celebrating"
                    fill
                    className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>

            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-heading"
                    >
                        Trusted by active weekend warriors
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-4 text-lg leading-8 text-gray-300 font-sans mb-12"
                    >
                        A high-activity environment fosters high-performing teams. Let the app handle the boring stuff so you can focus on the sport.
                    </motion.p>

                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.15 }}
                                className="mx-auto flex max-w-xs flex-col gap-y-4"
                            >
                                <dt className="text-base leading-7 text-gray-400 font-sans">{stat.name}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl font-heading">
                                    {stat.value}
                                </dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
