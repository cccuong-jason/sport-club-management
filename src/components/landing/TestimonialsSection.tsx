'use client'

import { motion } from 'framer-motion'

import { useTranslations } from 'next-intl'

export function TestimonialsSection() {
    const t = useTranslations('Landing.Testimonials')

    const testimonials = [
        {
            body: t('items.1.body'),
            author: {
                name: t('items.1.author'),
                role: t('items.1.role'),
                initials: "MT"
            }
        },
        {
            body: t('items.2.body'),
            author: {
                name: t('items.2.author'),
                role: t('items.2.role'),
                initials: "SJ"
            }
        },
        {
            body: t('items.3.body'),
            author: {
                name: t('items.3.author'),
                role: t('items.3.role'),
                initials: "DC"
            }
        }
    ]

    return (
        <section id="testimonials" className="bg-zinc-50 dark:bg-zinc-950 py-24 sm:py-32 border-t border-zinc-200 dark:border-zinc-900">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mx-auto max-w-2xl text-center mb-20">
                    <h2 className="text-sm font-bold leading-7 text-primary font-heading uppercase tracking-[0.2em] mb-4">
                        {t('title')}
                    </h2>
                    <p className="mt-2 text-4xl font-black tracking-tighter text-zinc-900 dark:text-white sm:text-6xl font-heading uppercase">
                        {t('heading')}
                    </p>
                </div>

                <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.author.name}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0.4, delay: i * 0.15 }}
                            className="flex flex-col justify-between bg-white dark:bg-zinc-900 rounded-none p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:border-primary/30 dark:hover:border-primary/30 transition-colors duration-300"
                        >
                            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 font-sans italic mb-10">
                                &ldquo;{testimonial.body}&rdquo;
                            </p>
                            <div className="flex items-center gap-x-5 mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
                                <div className="h-14 w-14 rounded-none bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-primary font-black font-heading border border-zinc-200 dark:border-zinc-800">
                                    {testimonial.author.initials}
                                </div>
                                <div>
                                    <div className="font-bold text-zinc-900 dark:text-white tracking-wide font-heading uppercase">{testimonial.author.name}</div>
                                    <div className="text-sm text-zinc-500 font-sans tracking-wider uppercase mt-1">{testimonial.author.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
