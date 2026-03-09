'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const stats = [
    { label: 'Matches Played', value: 500, suffix: '+' },
    { label: 'Active Players', value: 2000, suffix: '+' },
    { label: 'Funds Managed', value: 50, prefix: '$', suffix: 'k+' },
]

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number | null = null
        const duration = 2000 // 2 seconds

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            // Use easeOutQuart for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOut * value))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [value])

    return (
        <span className="font-heading text-4xl font-bold tracking-tight text-primary">
            {prefix}{count}{suffix}
        </span>
    )
}

export function SocialProofBar() {
    return (
        <section className="bg-white border-b border-green-100 py-12">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col gap-2"
                        >
                            <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            <span className="font-sans text-sm tracking-wide text-slate-500 uppercase font-semibold">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
