'use client'

import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

// Removed static showcases array

import { useTranslations } from 'next-intl'

// 3D Tilt Card Component
function TiltCard({ showcase, index }: { showcase: { title: string, metric: string, description: string, color: string }, index: number }) {
    const ref = useRef<HTMLDivElement>(null)

    // Mouse tracking values
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Spring physics for smooth return
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 })
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 })

    // Map mouse position to rotation ranges (-10deg to 10deg)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()

        // Calculate mouse position relative to the center of the card
        const width = rect.width
        const height = rect.height

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    // Mask reveal animation for the card entering the viewport
    const maskVariants: Variants = {
        hidden: {
            clipPath: "inset(100% 0% 0% 0%)", // Hidden from top
            y: 50
        },
        show: {
            clipPath: "inset(0% 0% 0% 0%)",   // Fully revealed
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1], // Custom bounce/ease similar to Flexfollio
                delay: index * 0.15
            }
        }
    }

    return (
        <motion.div
            variants={maskVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            style={{ perspective: 1000 }} // Needed for 3D effect
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className={`relative w-full h-[400px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden cursor-crosshair group shadow-xl`}
            >
                {/* Background Gradient responding to card type */}
                <div className={`absolute inset-0 bg-gradient-to-br ${showcase.color} opacity-20 dark:opacity-40 transition-opacity duration-500 group-hover:opacity-60 dark:group-hover:opacity-80`} />

                {/* Internal Card Content that POPS further out in 3D space */}
                <div
                    style={{ transform: "translateZ(50px)" }} // Pushes content out towards user
                    className="absolute inset-0 p-8 flex flex-col justify-between z-10"
                >
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs font-mono">
                        {showcase.title}
                    </h3>

                    <div>
                        <div className="text-7xl font-black text-zinc-900 dark:text-white font-heading tracking-tighter mb-4">
                            {showcase.metric}
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed max-w-xs">
                            {showcase.description}
                        </p>
                    </div>
                </div>

                {/* Optional grid overlay for texture */}
                <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-5 dark:opacity-10" style={{ transform: "translateZ(10px)" }} />
            </motion.div>
        </motion.div>
    )
}

export function ShowcasesSection() {
    const t = useTranslations('Landing.Showcases')

    const showcases = [
        {
            title: t('items.attendance.title'),
            metric: "100%",
            description: t('items.attendance.description'),
            color: "from-emerald-500/20 to-zinc-50 dark:to-zinc-950",
        },
        {
            title: t('items.time.title'),
            metric: "4Hrs",
            description: t('items.time.description'),
            color: "from-blue-500/20 to-zinc-50 dark:to-zinc-950",
        },
        {
            title: t('items.finance.title'),
            metric: "30%",
            description: t('items.finance.description'),
            color: "from-purple-500/20 to-zinc-50 dark:to-zinc-950",
        }
    ]

    return (
        <section id="showcases" className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-950 overflow-hidden border-b border-zinc-200 dark:border-zinc-900 border-t">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-heading text-zinc-900 dark:text-white mb-6"
                    >
                        {t('heading1')} <span className="text-primary">{t('heading2')}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-600 dark:text-zinc-400 max-w-xl text-lg leading-relaxed font-sans"
                    >
                        {t('description')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {showcases.map((showcase, i) => (
                        <TiltCard key={showcase.title} showcase={showcase} index={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}
