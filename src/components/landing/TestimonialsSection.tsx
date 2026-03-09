'use client'

import { motion } from 'framer-motion'

const testimonials = [
    {
        body: "This app transformed how we run Sunday League. We used to chase people down on WhatsApp for subs and attendance. Now it's completely automated.",
        author: {
            name: "Marcus T.",
            role: "Club Manager",
            initials: "MT"
        }
    },
    {
        body: "Finally, a clean interface for amateur sports. It looks professional, and our players actually enjoy checking the app to see who is coming to training.",
        author: {
            name: "Sarah Jenkins",
            role: "Team Captain",
            initials: "SJ"
        }
    },
    {
        body: "The finance tracking alone makes it worth it. Knowing exactly who has paid match fees and what our remaining pitch budget is saves me hours of headache.",
        author: {
            name: "David Chen",
            role: "Treasurer",
            initials: "DC"
        }
    }
]

export function TestimonialsSection() {
    return (
        <section className="bg-white py-24 sm:py-32 border-t border-slate-100">
            <div className="container mx-auto px-6 lg:px-8">

                <div className="mx-auto max-w-xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-heading">
                        Built for the love of the game.
                    </h2>
                </div>

                <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.author.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.15 }}
                            className="flex flex-col justify-between bg-slate-50 rounded-2xl p-8 border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="text-lg leading-relaxed text-slate-700 font-sans italic mb-8">
                                "{testimonial.body}"
                            </p>
                            <div className="flex items-center gap-x-4 mt-auto">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-heading border border-primary/20">
                                    {testimonial.author.initials}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900 font-heading">{testimonial.author.name}</div>
                                    <div className="text-sm text-slate-500 font-sans">{testimonial.author.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
