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
import { isClerkConfigured } from '@/lib/clerk-env'

export default async function Home() {
  const clerkConfigured = isClerkConfigured()
  const { userId } = clerkConfigured ? await auth() : { userId: null }

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <main className="bg-zinc-950 text-white flex flex-col min-h-screen">
      <LandingHeader userId={userId} authEnabled={clerkConfigured} />
      <HeroSection userId={userId} authEnabled={clerkConfigured} />
      <SocialProofBar />
      <HowItWorksSection />
      <CapabilitiesSection />
      <FeaturesDeepDive />
      <ShowcasesSection />
      <TestimonialsSection />
      <FinalCta userId={userId} authEnabled={clerkConfigured} />
      <Footer />
    </main>
  )
}
