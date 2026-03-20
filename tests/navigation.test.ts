import { getPrimaryNavigationItems } from '@/lib/navigation'

test('primary navigation keeps events and seasons but removes top-level voting and calendar', () => {
  const items = getPrimaryNavigationItems()

  expect(items.map((item) => item.url)).toEqual([
    '/dashboard',
    '/team',
    '/events',
    '/seasons',
    '/funds',
  ])
})
