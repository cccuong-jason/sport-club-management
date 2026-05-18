import { isClerkConfigured } from '@/lib/clerk-env'

test('isClerkConfigured returns false when Clerk keys are missing', () => {
  const previousPublishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const previousSecret = process.env.CLERK_SECRET_KEY

  delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  delete process.env.CLERK_SECRET_KEY

  expect(isClerkConfigured()).toBe(false)

  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = previousPublishable
  process.env.CLERK_SECRET_KEY = previousSecret
})

test('isClerkConfigured returns true when both Clerk keys are present', () => {
  const previousPublishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const previousSecret = process.env.CLERK_SECRET_KEY

  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_example'
  process.env.CLERK_SECRET_KEY = 'sk_test_example'

  expect(isClerkConfigured()).toBe(true)

  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = previousPublishable
  process.env.CLERK_SECRET_KEY = previousSecret
})
