import { auth } from '@clerk/nextjs/server'
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProofBar } from '@/components/landing/SocialProofBar'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { FeaturesDeepDive } from '@/components/landing/FeaturesDeepDive'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { FinalCta } from '@/components/landing/FinalCta'

import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <main className="bg-gray-50 flex flex-col min-h-screen">
      <HeroSection userId={userId} />
      <SocialProofBar />
      <HowItWorksSection />
      <FeaturesDeepDive />
      <TestimonialsSection />
      <FinalCta userId={userId} />
    </main>
  )
}
