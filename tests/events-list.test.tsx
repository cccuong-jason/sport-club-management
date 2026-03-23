import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventsList } from '@/components/events/EventsList'

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <article>{children}</article>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({
    asChild,
    children,
  }: {
    asChild?: boolean
    children: React.ReactElement | React.ReactNode
  }) => (asChild ? children : <button type="button">{children}</button>),
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

jest.mock('@/components/ui/select', () => {
  const ReactModule = require('react') as typeof React
  const SelectContext = ReactModule.createContext<{
    value: string
    onValueChange?: (value: string) => void
  }>({ value: 'all' })

  return {
    Select: ({
      value,
      onValueChange,
      children,
    }: {
      value: string
      onValueChange?: (value: string) => void
      children: React.ReactNode
    }) => (
      <SelectContext.Provider value={{ value, onValueChange }}>
        <div>{children}</div>
      </SelectContext.Provider>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
    SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SelectItem: ({
      value,
      children,
    }: {
      value: string
      children: React.ReactNode
    }) => {
      const context = ReactModule.useContext(SelectContext)
      return (
        <button type="button" onClick={() => context.onValueChange?.(value)}>
          {children}
        </button>
      )
    },
  }
})

const events = [
  {
    _id: '1',
    title: 'Morning Training',
    type: 'training' as const,
    date: '2026-03-21T00:00:00.000Z',
    startTime: '07:00',
    endTime: '09:00',
    location: 'Pitch A',
  },
  {
    _id: '2',
    title: 'Cup Match',
    type: 'match' as const,
    date: '2026-03-18T00:00:00.000Z',
    startTime: '19:00',
    endTime: '21:00',
    location: 'Stadium',
  },
]

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date('2026-03-20T00:00:00.000Z'))
})

afterEach(() => {
  jest.useRealTimers()
})

test('filters events by search term, type, and status', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
  render(<EventsList events={events} />)

  expect(screen.getByText('Morning Training')).toBeInTheDocument()
  expect(screen.getByText('Cup Match')).toBeInTheDocument()

  await user.type(screen.getByPlaceholderText('Tìm kiếm sự kiện...'), 'cup')
  expect(screen.queryByText('Morning Training')).not.toBeInTheDocument()
  expect(screen.getByText('Cup Match')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Tập luyện' }))
  expect(screen.getByText('Không tìm thấy sự kiện nào.')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Tất cả loại' }))
  await user.click(screen.getByRole('button', { name: 'Đã qua' }))
  expect(screen.getByText('Cup Match')).toBeInTheDocument()
})

test('shows match-specific actions and fallback location text', () => {
  render(
    <EventsList
      events={[{ ...events[1], location: undefined }]}
    />
  )

  expect(screen.getByRole('link', { name: 'Bình chọn MVP' })).toHaveAttribute(
    'href',
    '/voting/2'
  )
  expect(screen.getByRole('link', { name: 'Thanh toán' })).toHaveAttribute(
    'href',
    '/match-payments/2'
  )
  expect(screen.getByText('Chưa xác định')).toBeInTheDocument()
})
