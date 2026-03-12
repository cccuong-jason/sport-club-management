'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// Tailored to the Club Management System capabilities
const capabilities = [
    {
        title: "ATTENDANCE",
        description: "Never chase players on WhatsApp again. Automated RSVPs, instant squad views, and strict cutoffs to ensure you always have numbers."
    },
    {
        title: "FINANCES",
        description: "Total transparency on match fees and club dues. Track who paid, who owes, and manage the seasonal budget without the headache."
    },
    {
        title: "STATISTICS",
        description: "Vote for MVP, track goalscorers, and analyze attendance reliability. Build a culture of performance and accountability."
    }
]

export function CapabilitiesSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [isHoveringSection, setIsHoveringSection] = useState(false)

    // Cursor tracking state
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Low velocity spring configuration for the "laggy/heavy" cursor feel
    const springConfig = { damping: 20, stiffness: 100, mass: 1.5 }
    const cursorX = useSpring(mouseX, springConfig)
    const cursorY = useSpring(mouseY, springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Offset by half the cursor width/height to center it exactly on the mouse
            mouseX.set(e.clientX - 60)
            mouseY.set(e.clientY - 20)
        }

        if (isHoveringSection) {
            window.addEventListener('mousemove', handleMouseMove)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
        }

        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [isHoveringSection, mouseX, mouseY])

    return (
        <section
            ref={containerRef}
            className="bg-zinc-950 py-32 sm:py-48 relative border-t border-zinc-900 border-b overflow-hidden cursor-none" // Hide default cursor when inside
            onMouseEnter={() => setIsHoveringSection(true)}
            onMouseLeave={() => {
                setIsHoveringSection(false)
                setHoveredIndex(null)
            }}
        >
            <div className="container mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 font-heading max-w-2xl mx-auto leading-relaxed">
                        Our management infrastructure automates the admin work, <br className="hidden sm:block" />
                        so you can focus entirely on the match.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center relative">
                    {capabilities.map((item, index) => {
                        const isHovered = hoveredIndex === index;
                        const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

                        return (
                            <div
                                key={item.title}
                                className={`relative w-full text-center group py-4 transition-all duration-500 ease-out ${isHovered ? 'z-50' : 'z-10'}`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* The massive stacked text */}
                                <motion.h2
                                    className={`text-[12vw] sm:text-[10vw] font-black uppercase tracking-tighter font-heading leading-[0.85] transition-all duration-500 ease-out inline-block
                                        ${isHovered ? 'text-primary drop-shadow-[0_0_30px_rgba(209,242,209,0.3)]' :
                                            isOtherHovered ? 'text-zinc-900 blur-[2px]' : 'text-zinc-200'}
                                    `}
                                >
                                    {item.title}
                                </motion.h2>

                                {/* The overlay description that appears on hover */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-md pointer-events-none"
                                        >
                                            <p className="text-white text-lg sm:text-2xl font-bold p-6 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 shadow-2xl leading-relaxed tracking-wide font-sans">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Custom Floating Cursor (Goalz Style) */}
            <AnimatePresence>
                {isHoveringSection && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            x: cursorX,
                            y: cursorY,
                        }}
                        className="fixed top-0 left-0 w-[120px] h-[40px] bg-primary rounded-full flex items-center justify-center gap-1 z-50 pointer-events-none shadow-[0_0_20px_rgba(209,242,209,0.4)]"
                    >
                        <span className="text-black text-[10px] font-black uppercase tracking-widest">
                            View More
                        </span>
                        <ArrowRight className="w-3 h-3 text-black" />
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    )
}
