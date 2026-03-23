import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FundsTabs } from '@/components/funds/FundsTabs'
import { TeamList } from '@/components/team/TeamList'

jest.mock('@/components/ui/tabs', () => {
  const ReactModule = require('react') as typeof React
  const TabsContext = ReactModule.createContext<{
    value: string
    setValue: (value: string) => void
  }>({
    value: 'overview',
    setValue: () => undefined,
  })

  return {
    Tabs: ({
      defaultValue,
      children,
    }: {
      defaultValue: string
      children: React.ReactNode
    }) => {
      const [value, setValue] = ReactModule.useState(defaultValue)
      return (
        <TabsContext.Provider value={{ value, setValue }}>
          <div>{children}</div>
        </TabsContext.Provider>
      )
    },
    TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TabsTrigger: ({
      value,
      children,
    }: {
      value: string
      children: React.ReactNode
    }) => {
      const context = ReactModule.useContext(TabsContext)
      return (
        <button type="button" onClick={() => context.setValue(value)}>
          {children}
        </button>
      )
    },
    TabsContent: ({
      value,
      children,
    }: {
      value: string
      children: React.ReactNode
    }) => {
      const context = ReactModule.useContext(TabsContext)
      return context.value === value ? <div>{children}</div> : null
    },
  }
})

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
}))

jest.mock('@/components/team/MemberCard', () => ({
  MemberCard: ({ member }: { member: { name: string } }) => <div>{member.name}</div>,
}))

jest.mock('@/components/team/AddMemberForm', () => ({
  AddMemberForm: () => <div>Add member form</div>,
}))

test('FundsTabs switches between content panes', async () => {
  const user = userEvent.setup()
  render(
    <FundsTabs
      overview={<div>Overview panel</div>}
      monthly={<div>Monthly panel</div>}
      penalties={<div>Penalty panel</div>}
    />
  )

  expect(screen.getByText('Overview panel')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Quỹ hàng tháng' }))
  expect(screen.getByText('Monthly panel')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Tiền phạt' }))
  expect(screen.getByText('Penalty panel')).toBeInTheDocument()
})

test('TeamList groups members, filters by search, and shows the admin tools', async () => {
  const user = userEvent.setup()
  render(
    <TeamList
      isAdmin
      currentUserId="1"
      members={[
        { _id: '1', name: 'Alice', email: 'alice@example.com', role: 'admin' },
        { _id: '2', name: 'Bob', email: 'bob@example.com', role: 'member' },
      ]}
    />
  )

  expect(screen.getByText('2 thành viên • 1 quản trị viên')).toBeInTheDocument()
  expect(screen.getByText('Add member form')).toBeInTheDocument()
  expect(screen.getByText('Alice')).toBeInTheDocument()
  expect(screen.getByText('Bob')).toBeInTheDocument()

  await user.type(screen.getByPlaceholderText('Tìm kiếm thành viên...'), 'alice')
  expect(screen.getByText('Alice')).toBeInTheDocument()
  expect(screen.getByText('Không tìm thấy cầu thủ nào.')).toBeInTheDocument()
})

test('TeamList hides admin tools for regular members', () => {
  render(
    <TeamList
      isAdmin={false}
      currentUserId="2"
      members={[{ _id: '2', name: 'Bob', email: 'bob@example.com', role: 'member' }]}
    />
  )

  expect(screen.queryByText('Add member form')).not.toBeInTheDocument()
})
