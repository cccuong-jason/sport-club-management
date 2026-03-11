'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Footer() {
    return (
        <footer className="relative bg-zinc-950 overflow-hidden w-full h-[800px] flex flex-col justify-end">
            {/* Background Image replicating the grass/pitch base in the screenshot */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/landing/hero-bg.png"
                    alt="Stadium Grass Background"
                    fill
                    priority
                    className="object-cover object-bottom"
                />
                {/* Fade to black gradient overlaying the grass going down */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/80 to-zinc-950" />
            </div>

            {/* Top/Middle Area - Slogan exactly mapping the screenshot layout */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center -mt-64 mb-32 px-6">
                <span className="text-zinc-300 font-bold uppercase tracking-widest text-xs mb-6 font-mono">
                    CLUB MANAGEMENT
                </span>

                <h2 className="text-[12vw] sm:text-[10vw] font-black tracking-tighter text-primary font-heading uppercase leading-[0.85] text-center filter drop-shadow-[0_4px_10px_rgba(209,242,209,0.3)]">
                    MANAGE LESS. <br />
                    PLAY MORE.
                </h2>

                <Button asChild className="mt-12 bg-primary text-black hover:bg-white transition-colors duration-300 rounded-full px-8 py-6 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <Link href="/sign-up">CREATE YOUR CLUB <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
            </div>

            {/* Bottom Quotes Grid - 3 columns overlaying the dark gradient before the very bottom */}
            <div className="relative z-10 container mx-auto px-6 lg:px-8 pb-20 border-b border-zinc-800/40">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
                    <div>
                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest font-mono leading-relaxed">
                            "AUTOMATED RSVPS MEAN<br />NO MORE CHASING."
                        </p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest font-mono leading-relaxed">
                            "COMPLETE TRANSPARENCY<br />ON MATCH FEES."
                        </p>
                    </div>
                    <div className="text-right md:text-left">
                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest font-mono leading-relaxed whitespace-nowrap">
                            "YOUR SQUAD IN YOUR<br />POCKET ALWAYS."
                        </p>
                    </div>
                </div>
            </div>

            {/* Actual Nav Bottom Strip */}
            <div className="relative z-10 container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">

                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-black tracking-tighter text-white font-heading group-hover:text-primary transition-colors">
                        GOALZ.
                    </span>
                </Link>

                {/* Pill navigation lists */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <nav className="flex items-center bg-zinc-900 border border-zinc-800/80 rounded-sm">
                        <Link href="#features" className="px-6 py-2 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors border-r border-zinc-800/80">FEATURES</Link>
                        <Link href="#how-it-works" className="px-6 py-2 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">HOW IT WORKS</Link>
                    </nav>

                    <nav className="flex items-center bg-zinc-900 border border-zinc-800/80 rounded-sm">
                        <Link href="#" className="px-6 py-2 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors border-r border-zinc-800/80">TWITTER</Link>
                        <Link href="mailto:contact@goalz.com" className="px-6 py-2 text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">SUPPORT</Link>
                    </nav>
                </div>
            </div>

            <div className="relative z-10 text-center py-4 bg-zinc-950 text-zinc-600 text-[10px] tracking-widest font-bold uppercase w-full">
                ©GOALZ. ALL RIGHTS RESERVED.
            </div>

        </footer>
    )
}
