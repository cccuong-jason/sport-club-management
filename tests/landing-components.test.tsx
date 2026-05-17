import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { CapabilitiesSection } from '@/components/landing/CapabilitiesSection'
import { FinalCta } from '@/components/landing/FinalCta'
import { Footer } from '@/components/landing/Footer'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { ShowcasesSection } from '@/components/landing/ShowcasesSection'
import { SocialProofBar } from '@/components/landing/SocialProofBar'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'

jest.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div>Language switcher</div>,
}))

jest.mock('@/components/mode-toggle', () => ({
  ModeToggle: () => <div>Theme toggle</div>,
}))

jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

beforeEach(() => {
  const translations: Record<string, string> = {
    'Landing.Header.howItWorks': 'How it works',
    'Landing.Header.features': 'Features',
    'Landing.Header.testimonials': 'Testimonials',
    'Landing.Header.dashboard': 'Dashboard',
    'Landing.Header.getStarted': 'Get started',
    'Landing.Hero.training': 'Training',
    'Landing.Hero.manageYour': 'Manage your',
    'Landing.Hero.squad': 'Squad',
    'Landing.Hero.description': 'Run your club from one place.',
    'Landing.Hero.returnToDashboard': 'Return to dashboard',
    'Landing.Hero.getStartedFree': 'Get started free',
    'Landing.Hero.explore': 'Explore',
    'Landing.Hero.ticker.payment': 'Payment received',
    'Landing.Hero.ticker.updated': 'Treasury updated',
    'Landing.Hero.ticker.alex': 'Alex checked in',
    'Landing.Hero.ticker.match': 'Match posted',
    'Landing.Hero.ticker.players': '12 players confirmed',
    'Landing.Hero.ticker.dues': 'Monthly dues collected',
    'Landing.Hero.ticker.sarah': 'Sarah paid dues',
    'Landing.HowItWorks.title': 'How it works',
    'Landing.HowItWorks.heading': 'Three steps',
    'Landing.HowItWorks.description': 'Launch your club workflow.',
    'Landing.HowItWorks.steps.step1.name': 'Join',
    'Landing.HowItWorks.steps.step1.description': 'Players join the club.',
    'Landing.HowItWorks.steps.step2.name': 'Plan',
    'Landing.HowItWorks.steps.step2.description': 'Schedule events quickly.',
    'Landing.HowItWorks.steps.step3.name': 'Collect',
    'Landing.HowItWorks.steps.step3.description': 'Track dues and penalties.',
    'Landing.Capabilities.description1': 'Everything you need',
    'Landing.Capabilities.description2': 'to run a modern club',
    'Landing.Capabilities.items.attendance.title': 'Attendance',
    'Landing.Capabilities.items.attendance.description': 'Track every session.',
    'Landing.Capabilities.items.finances.title': 'Finances',
    'Landing.Capabilities.items.finances.description': 'See club cash flow.',
    'Landing.Capabilities.items.statistics.title': 'Statistics',
    'Landing.Capabilities.items.statistics.description': 'Spot top performers.',
    'Landing.Capabilities.viewMore': 'View more',
    'Landing.Showcases.heading1': 'Impact in',
    'Landing.Showcases.heading2': 'Numbers',
    'Landing.Showcases.description': 'Operational wins across the club.',
    'Landing.Showcases.items.attendance.title': 'Attendance',
    'Landing.Showcases.items.attendance.description': 'Attendance stays on track.',
    'Landing.Showcases.items.time.title': 'Time saved',
    'Landing.Showcases.items.time.description': 'Admins save hours weekly.',
    'Landing.Showcases.items.finance.title': 'Finance control',
    'Landing.Showcases.items.finance.description': 'Dues collection improves.',
    'Landing.SocialProof.matches': 'Matches',
    'Landing.SocialProof.players': 'Players',
    'Landing.SocialProof.funds': 'Funds',
    'Landing.Testimonials.title': 'Testimonials',
    'Landing.Testimonials.heading': 'What clubs say',
    'Landing.Testimonials.items.1.body': 'It saved us time.',
    'Landing.Testimonials.items.1.author': 'Minh Tran',
    'Landing.Testimonials.items.1.role': 'Captain',
    'Landing.Testimonials.items.2.body': 'Payments became easy.',
    'Landing.Testimonials.items.2.author': 'Sarah Jones',
    'Landing.Testimonials.items.2.role': 'Treasurer',
    'Landing.Testimonials.items.3.body': 'Attendance is finally clear.',
    'Landing.Testimonials.items.3.author': 'Duc Cao',
    'Landing.Testimonials.items.3.role': 'Coach',
    'Landing.FinalCta.title1': 'Ready to',
    'Landing.FinalCta.title2': 'launch',
    'Landing.FinalCta.description': 'Start organizing your club today.',
    'Landing.FinalCta.dashboard': 'Open dashboard',
    'Landing.FinalCta.button': 'Start free',
    'Landing.Footer.sloganTop': 'Built for clubs',
    'Landing.Footer.sloganMain': 'Win <strong>together</strong>',
    'Landing.Footer.ctaButton': 'Create account',
    'Landing.Footer.quotes.1': 'Attendance handled.',
    'Landing.Footer.quotes.2': 'Finances organized.',
    'Landing.Footer.quotes.3': 'Everyone aligned.',
    'Landing.Footer.nav.features': 'Features',
    'Landing.Footer.nav.howItWorks': 'How it works',
    'Landing.Footer.nav.twitter': 'Twitter',
    'Landing.Footer.nav.support': 'Support',
    'Landing.Footer.copyright': 'Copyright Goalz',
  }

  globalThis.__TEST_INTL__.translate = (key: string) => translations[key] ?? key
})

test('LandingHeader swaps between sign-in and dashboard actions', () => {
  const { rerender } = render(<LandingHeader userId={null} />)

  expect(screen.getAllByText('How it works')).toHaveLength(2)
  expect(screen.getAllByText('Language switcher')).toHaveLength(2)
  expect(screen.getAllByText('Get started')).toHaveLength(2)

  rerender(<LandingHeader userId="user-1" />)
  expect(screen.getAllByText('Dashboard')).toHaveLength(2)
})

test('Landing auth CTAs fall back to links when Clerk is disabled', () => {
  const { rerender } = render(<LandingHeader userId={null} authEnabled={false} />)

  expect(screen.getAllByRole('link', { name: 'Get started' })[0]).toHaveAttribute('href', '/sign-in')

  rerender(<HeroSection userId={null} authEnabled={false} />)
  expect(screen.getByRole('link', { name: 'Get started free' })).toHaveAttribute('href', '/sign-in')

  rerender(<FinalCta userId={null} authEnabled={false} />)
  expect(screen.getByRole('link', { name: 'Start free' })).toHaveAttribute('href', '/sign-in')
})

test('HeroSection and FinalCta render the authenticated and unauthenticated CTAs', () => {
  const { rerender } = render(<HeroSection userId={null} />)

  expect(screen.getByText('Manage your')).toBeInTheDocument()
  expect(screen.getByText('Payment received')).toBeInTheDocument()
  expect(screen.getByText('Get started free')).toBeInTheDocument()

  rerender(<HeroSection userId="user-1" />)
  expect(screen.getByText('Return to dashboard')).toBeInTheDocument()

  rerender(<FinalCta userId={null} />)
  expect(screen.getByText('Start free')).toBeInTheDocument()

  rerender(<FinalCta userId="user-1" />)
  expect(screen.getByText('Open dashboard')).toBeInTheDocument()
})

test('HowItWorksSection, ShowcasesSection, and TestimonialsSection render core content', () => {
  render(
    <>
      <HowItWorksSection />
      <ShowcasesSection />
      <TestimonialsSection />
    </>
  )

  expect(screen.getByText('Three steps')).toBeInTheDocument()
  expect(screen.getByText('Join')).toBeInTheDocument()
  expect(screen.getByText('Impact in')).toBeInTheDocument()
  expect(screen.getByText('Numbers')).toBeInTheDocument()
  expect(screen.getByText('What clubs say')).toBeInTheDocument()
  expect(screen.getByText('“It saved us time.”')).toBeInTheDocument()
})

test('ShowcasesSection responds to pointer movement on a tilt card', () => {
  const { container } = render(<ShowcasesSection />)

  const card = Array.from(container.querySelectorAll('.cursor-crosshair'))[0]
  expect(card).toBeDefined()
  if (!card) {
    throw new Error('Expected showcase card')
  }

  fireEvent.mouseMove(card, { clientX: 150, clientY: 100 })
  fireEvent.mouseLeave(card)
})

test('CapabilitiesSection shows hover details and the floating cursor helper', () => {
  render(<CapabilitiesSection />)

  const section = screen.getByText('Attendance').closest('section')
  expect(section).not.toBeNull()
  if (!section) {
    throw new Error('Expected capabilities section')
  }

  fireEvent.mouseEnter(section)
  fireEvent.mouseEnter(screen.getByText('Attendance'))

  expect(screen.getByText('Track every session.')).toBeInTheDocument()
  expect(screen.getByText('View more')).toBeInTheDocument()
})

test('SocialProofBar animates the counters to the final totals', async () => {
  render(<SocialProofBar />)

  expect(
    await screen.findByText((_, element) => element?.textContent === '500+')
  ).toBeInTheDocument()
  expect(
    await screen.findByText((_, element) => element?.textContent === '2000+')
  ).toBeInTheDocument()
  expect(
    await screen.findByText((_, element) => element?.textContent === '$50k+')
  ).toBeInTheDocument()
})

test('Footer renders navigation and sign-up links', () => {
  render(<Footer />)

  expect(screen.getByText('Built for clubs')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Create account/i })).toHaveAttribute(
    'href',
    '/sign-up'
  )

  const nav = screen.getByRole('link', { name: 'Support' }).closest('nav')
  expect(nav).not.toBeNull()
  if (!nav) {
    throw new Error('Expected footer support nav')
  }
  expect(within(nav).getByRole('link', { name: 'Twitter' })).toHaveAttribute('href', '#')
  expect(within(nav).getByRole('link', { name: 'Support' })).toHaveAttribute(
    'href',
    'mailto:contact@goalz.com'
  )
})
