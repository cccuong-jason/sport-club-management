'use client'

import { motion } from 'framer-motion'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function FinalCta({ userId }: { userId: string | null }) {
    return (
        <section className="bg-slate-900 py-24 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 blur-3xl rounded-full bg-primary pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-2xl"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-heading mb-6">
                        Your club deserves better tools.
                    </h2>
                    <p className="text-lg leading-8 text-gray-300 font-sans mb-10">
                        Stop chasing payments and attendance. Get your whole squad aligned today.
                    </p>

                    <div className="flex justify-center flex-col sm:flex-row gap-4">
                        {userId ? (
                            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                <Link href="/dashboard">Return to Dashboard</Link>
                            </Button>
                        ) : (
                            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                    Get Started Free
                                </Button>
                            </SignInButton>
                        )}
                        <Button variant="ghost" asChild size="lg" className="text-white hover:text-white hover:bg-white/10 font-semibold px-10 py-6 text-lg rounded-xl transition-all">
                            <a href="#">Back to Top</a>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
