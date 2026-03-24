import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFormStatus } from 'react-dom'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ModeToggle } from '@/components/mode-toggle'

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
  }) => (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  ),
}))

test('LanguageSwitcher navigates to the selected locale', async () => {
  globalThis.__TEST_INTL__.locale = 'en'
  const user = userEvent.setup()

  render(<LanguageSwitcher />)

  await user.click(screen.getByRole('button', { name: 'Tiếng Việt' }))

  expect(globalThis.__TEST_ROUTER__.replace).toHaveBeenCalledWith('/current-path', {
    locale: 'vi',
  })
  expect(screen.getByRole('button', { name: 'English' })).toHaveClass('font-bold')
})

test('LanguageSwitcher highlights the active Vietnamese locale', () => {
  globalThis.__TEST_INTL__.locale = 'vi'

  render(<LanguageSwitcher />)

  expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toHaveClass('font-bold')
})

test('ModeToggle flips from light to dark and back', async () => {
  const user = userEvent.setup()
  render(<ModeToggle />)

  await user.click(screen.getByRole('button', { name: 'Toggle theme' }))
  expect(globalThis.__TEST_THEME__.setTheme).toHaveBeenCalledWith('dark')

  globalThis.__TEST_THEME__.theme = 'dark'
  render(<ModeToggle />)
  await user.click(screen.getAllByRole('button', { name: 'Toggle theme' })[1])

  expect(globalThis.__TEST_THEME__.setTheme).toHaveBeenLastCalledWith('light')
})

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: jest.fn(() => ({ pending: false })),
}))

test('RemoveMemberButton blocks submit when confirmation is declined', async () => {
  const RemoveMemberButton = (await import('@/components/RemoveMemberButton')).default
  const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

  render(<RemoveMemberButton memberName="Alex" removeAction={jest.fn()} />)

  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  fireEvent(screen.getByRole('button', { name: 'Remove' }), event)

  expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to remove Alex from the team?')
  expect(event.defaultPrevented).toBe(true)
  confirmSpy.mockRestore()
  consoleSpy.mockRestore()
})

test('RemoveMemberButton shows a pending label while submitting', async () => {
  ;(useFormStatus as jest.Mock).mockReturnValueOnce({ pending: true })
  const RemoveMemberButton = (await import('@/components/RemoveMemberButton')).default
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)

  render(<RemoveMemberButton memberName="Alex" removeAction={jest.fn()} />)

  expect(screen.getByRole('button', { name: 'Removing...' })).toBeDisabled()
  consoleSpy.mockRestore()
})
