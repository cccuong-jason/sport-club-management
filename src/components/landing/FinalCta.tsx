'use client'

import { motion } from 'framer-motion'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { useTranslations } from 'next-intl'

export function FinalCta({
    userId,
    authEnabled = true,
}: {
    userId: string | null
    authEnabled?: boolean
}) {
    const t = useTranslations('Landing.FinalCta')

    return (
        <section className="bg-white dark:bg-zinc-950 py-32 relative overflow-hidden border-t border-zinc-200 dark:border-zinc-900">
            {/* Decorative background element */}
            <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] opacity-10 blur-[100px] bg-primary pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="mx-auto max-w-4xl"
                >
                    <h2 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-7xl font-heading mb-6 uppercase leading-[0.9]">
                        {t('title1')} <br className="hidden sm:block" />
                        <span className="text-primary">{t('title2')}</span>
                    </h2>
                    <p className="text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 font-sans mb-12 max-w-2xl mx-auto">
                        {t('description')}
                    </p>

                    <div className="flex justify-center flex-col sm:flex-row gap-6">
                        {userId ? (
                            <Button asChild size="lg" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-black px-12 py-8 text-xl rounded-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 uppercase tracking-widest">
                                <Link href="/dashboard">{t('dashboard')}</Link>
                            </Button>
                        ) : (
                            <UnauthenticatedFinalCta authEnabled={authEnabled} label={t('button')} />
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

function UnauthenticatedFinalCta({
    authEnabled,
    label,
}: {
    authEnabled: boolean
    label: string
}) {
    if (authEnabled) {
        return (
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-black px-12 py-8 text-xl rounded-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 uppercase tracking-widest">
                    {label}
                </Button>
            </SignInButton>
        )
    }

    return (
        <Button asChild size="lg" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 font-black px-12 py-8 text-xl rounded-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 uppercase tracking-widest">
            <Link href="/sign-in">{label}</Link>
        </Button>
    )
}
