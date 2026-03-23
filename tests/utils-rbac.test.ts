import { isAdmin } from '@/lib/rbac'
import { cn } from '@/lib/utils'

test('cn merges class names and resolves Tailwind conflicts', () => {
  expect(cn('px-2', false && 'hidden', 'px-4', 'text-sm')).toBe('px-4 text-sm')
})

test('isAdmin only returns true for admin roles', () => {
  expect(isAdmin('admin')).toBe(true)
  expect(isAdmin('member')).toBe(false)
  expect(isAdmin(null)).toBe(false)
  expect(isAdmin(undefined)).toBe(false)
})
