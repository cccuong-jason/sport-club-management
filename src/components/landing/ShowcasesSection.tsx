'use client'

import { motion, useMotionValue, useSpring, useTransform, Variants } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

const showcases = [
    {
        title: "ATTENDANCE VISIBILITY",
        metric: "100%",
        description: "Clubs report perfect visibility into who is showing up to match days.",
        color: "from-emerald-500/20 to-zinc-950",
    },
    {
        title: "TIME SAVED",
        metric: "4Hrs",
        description: "Average time saved per week by managers cutting out WhatsApp chasing.",
        color: "from-blue-500/20 to-zinc-950",
    },
    {
        title: "FEE RECOVERY",
        metric: "30%",
        description: "Increase in recovered match fees through transparent digital ledgers.",
        color: "from-purple-500/20 to-zinc-950",
    }
]

// 3D Tilt Card Component
function TiltCard({ showcase, index }: { showcase: typeof showcases[0], index: number }) {
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
                className={`relative w-full h-[400px] border border-zinc-800 bg-zinc-900 overflow-hidden cursor-crosshair group`}
            >
                {/* Background Gradient responding to card type */}
                <div className={`absolute inset-0 bg-gradient-to-br ${showcase.color} opacity-40 transition-opacity duration-500 group-hover:opacity-80`} />

                {/* Internal Card Content that POPS further out in 3D space */}
                <div
                    style={{ transform: "translateZ(50px)" }} // Pushes content out towards user
                    className="absolute inset-0 p-8 flex flex-col justify-between z-10"
                >
                    <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-xs font-mono">
                        {showcase.title}
                    </h3>

                    <div>
                        <div className="text-7xl font-black text-white font-heading tracking-tighter mb-4">
                            {showcase.metric}
                        </div>
                        <p className="text-zinc-300 font-sans leading-relaxed max-w-xs">
                            {showcase.description}
                        </p>
                    </div>
                </div>

                {/* Optional grid overlay for texture */}
                <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-10" style={{ transform: "translateZ(10px)" }} />
            </motion.div>
        </motion.div>
    )
}

export function ShowcasesSection() {
    return (
        <section id="showcases" className="py-24 sm:py-32 bg-zinc-950 overflow-hidden border-b border-zinc-900 border-t">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-heading text-white mb-6"
                    >
                        Proven <span className="text-primary">Results.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-zinc-400 max-w-xl text-lg leading-relaxed font-sans"
                    >
                        Management systems that deliver tangible improvements to your club's efficiency, turnout, and financial health.
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
