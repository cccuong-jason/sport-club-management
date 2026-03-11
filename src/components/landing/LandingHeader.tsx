'use client'

import { motion } from 'framer-motion'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

export function LandingHeader({ userId }: { userId: string | null }) {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/50"
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-3xl font-black tracking-tighter text-white font-heading group-hover:text-primary transition-colors">
                        GOALZ.
                    </span>
                </Link>

                {/* Desktop Navigation - Pill Shape */}
                <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 rounded-full px-8 py-3">
                    <ul className="flex items-center gap-10 text-sm font-bold tracking-[0.1em] uppercase text-zinc-400 font-heading">
                        <li>
                            <Link href="#about" className="hover:text-white transition-colors">About</Link>
                        </li>
                        <li>
                            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        </li>
                        <li>
                            <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
                        </li>
                    </ul>
                </nav>

                {/* Right Side Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    {userId ? (
                        <Button asChild className="bg-primary text-black hover:bg-white font-bold px-6 rounded-none uppercase tracking-wider text-sm transition-colors border border-transparent hover:border-zinc-200">
                            <Link href="/dashboard">Dashboard →</Link>
                        </Button>
                    ) : (
                        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                            <Button className="bg-primary text-black hover:bg-white font-bold px-6 rounded-none uppercase tracking-wider text-sm transition-colors border border-transparent hover:border-zinc-200">
                                Get Started →
                            </Button>
                        </SignInButton>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-zinc-950 border-zinc-800 p-6 flex flex-col justify-between">
                            <nav className="mt-12">
                                <ul className="flex flex-col gap-6 text-2xl font-black tracking-tighter uppercase text-zinc-400 font-heading">
                                    <li>
                                        <Link href="#about" className="hover:text-white transition-colors block">About</Link>
                                    </li>
                                    <li>
                                        <Link href="#features" className="hover:text-white transition-colors block">Features</Link>
                                    </li>
                                    <li>
                                        <Link href="#testimonials" className="hover:text-white transition-colors block">Testimonials</Link>
                                    </li>
                                </ul>
                            </nav>

                            <div className="pb-8">
                                {userId ? (
                                    <Button asChild size="lg" className="w-full bg-primary text-black hover:bg-white font-bold rounded-none uppercase tracking-wider text-lg transition-colors">
                                        <Link href="/dashboard">Dashboard →</Link>
                                    </Button>
                                ) : (
                                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                        <Button size="lg" className="w-full bg-primary text-black hover:bg-white font-bold rounded-none uppercase tracking-wider text-lg transition-colors">
                                            Get Started →
                                        </Button>
                                    </SignInButton>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </motion.header>
    )
}
