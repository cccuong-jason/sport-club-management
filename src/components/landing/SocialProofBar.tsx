'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useTranslations } from 'next-intl'

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
        <span className="font-heading text-6xl font-black tracking-tighter text-zinc-900 dark:text-white">
            {prefix}{count}<span className="text-primary">{suffix}</span>
        </span>
    )
}

export function SocialProofBar() {
    const t = useTranslations('Landing.SocialProof')

    const stats = [
        { label: t('matches'), value: 500, suffix: '+' },
        { label: t('players'), value: 2000, suffix: '+' },
        { label: t('funds'), value: 50, prefix: '$', suffix: 'k+' },
    ]

    return (
        <section className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 py-20 relative z-10">
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-3">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0.4, delay: index * 0.15 }}
                            className="flex flex-col gap-3"
                        >
                            <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            <span className="font-sans text-sm tracking-[0.2em] text-zinc-500 uppercase font-bold">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
