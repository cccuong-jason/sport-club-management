import { auth } from '@clerk/nextjs/server'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { HeroSection } from '@/components/landing/HeroSection'
import { SocialProofBar } from '@/components/landing/SocialProofBar'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { CapabilitiesSection } from '@/components/landing/CapabilitiesSection'
import { FeaturesDeepDive } from '@/components/landing/FeaturesDeepDive'
import { ShowcasesSection } from '@/components/landing/ShowcasesSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { FinalCta } from '@/components/landing/FinalCta'
import { Footer } from '@/components/landing/Footer'

import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <main className="bg-zinc-950 text-white flex flex-col min-h-screen">
      <LandingHeader userId={userId} />
      <HeroSection userId={userId} />
      <SocialProofBar />
      <HowItWorksSection />
      <CapabilitiesSection />
      <FeaturesDeepDive />
      <ShowcasesSection />
      <TestimonialsSection />
      <FinalCta userId={userId} />
      <Footer />
    </main>
  )
}
