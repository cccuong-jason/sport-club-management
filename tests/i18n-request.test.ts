jest.mock('next-intl/routing', () => ({
  defineRouting: (config: unknown) => config,
}))

jest.mock('next-intl/navigation', () => ({
  createNavigation: (routing: unknown) => ({
    Link: 'a',
    redirect: jest.fn(),
    usePathname: jest.fn(),
    useRouter: jest.fn(),
    routing,
  }),
}))

jest.mock('next-intl/server', () => ({
  getRequestConfig: (factory: unknown) => factory,
}))

test('routing exposes the supported locales and default locale', async () => {
  const { routing } = await import('@/i18n/routing')

  expect(routing.locales).toEqual(['vi', 'en'])
  expect(routing.defaultLocale).toBe('vi')
})

test('request config keeps valid locales', async () => {
  const getRequestConfig = (await import('@/i18n/request')).default
  const config = await getRequestConfig({
    requestLocale: Promise.resolve('en'),
  })

  expect(config.locale).toBe('en')
  expect(config.messages).toHaveProperty('Landing.Header.features')
})

test('request config falls back to the default locale for invalid values', async () => {
  const getRequestConfig = (await import('@/i18n/request')).default
  const config = await getRequestConfig({
    requestLocale: Promise.resolve('fr'),
  })

  expect(config.locale).toBe('vi')
  expect(config.messages).toHaveProperty('Landing.Header.features')
})
