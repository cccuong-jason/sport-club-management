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

export default async function Home() {
  return (
    <main className="bg-zinc-950 text-white flex flex-col min-h-screen">
      <LandingHeader />
      <HeroSection />
      <SocialProofBar />
      <HowItWorksSection />
      <CapabilitiesSection />
      <FeaturesDeepDive />
      <ShowcasesSection />
      <TestimonialsSection />
      <FinalCta />
      <Footer />
    </main>
  )
}
