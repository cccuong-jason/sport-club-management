import { render, screen } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

function HookProbe() {
  return <div>{useIsMobile() ? 'mobile' : 'desktop'}</div>
}

test('useIsMobile returns true below the mobile breakpoint', () => {
  window.innerWidth = 640

  render(<HookProbe />)

  expect(screen.getByText('mobile')).toBeInTheDocument()
})

test('useIsMobile returns false at desktop widths', () => {
  window.innerWidth = 1200

  render(<HookProbe />)

  expect(screen.getByText('desktop')).toBeInTheDocument()
})
