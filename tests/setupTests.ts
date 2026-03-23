import '@testing-library/jest-dom'
import React from 'react'

declare global {
  // eslint-disable-next-line no-var
  var __TEST_INTL__: {
    locale: string
    translate: (key: string) => string
  }
  // eslint-disable-next-line no-var
  var __TEST_ROUTER__: {
    pathname: string
    replace: jest.Mock
  }
  // eslint-disable-next-line no-var
  var __TEST_THEME__: {
    theme: string
    setTheme: jest.Mock
  }
}

const intlState = {
  locale: 'en',
  translate: (key: string) => key,
}

const routerState = {
  pathname: '/current-path',
  replace: jest.fn(),
}

const themeState = {
  theme: 'light',
  setTheme: jest.fn(),
}

Object.assign(globalThis, {
  __TEST_INTL__: intlState,
  __TEST_ROUTER__: routerState,
  __TEST_THEME__: themeState,
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

let rafTick = 0
window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
  rafTick += 1000
  callback(rafTick)
  return rafTick
}) as typeof window.requestAnimationFrame
window.cancelAnimationFrame = jest.fn()
Element.prototype.scrollIntoView = jest.fn()

class MockObserver {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

Object.assign(globalThis, {
  ResizeObserver: MockObserver,
  IntersectionObserver: MockObserver,
})

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    fill: _fill,
    priority: _priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    priority?: boolean
  }) => React.createElement('img', props),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement('a', { href, ...props }, children),
}))

jest.mock('next-intl', () => ({
  useTranslations:
    (namespace?: string) =>
    (key: string) =>
      globalThis.__TEST_INTL__.translate(namespace ? `${namespace}.${key}` : key),
  useLocale: () => globalThis.__TEST_INTL__.locale,
}))

jest.mock('next-themes', () => ({
  useTheme: () => globalThis.__TEST_THEME__,
}))

jest.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'sign-in-button' }, children),
}))

jest.mock('@/i18n/routing', () => ({
  useRouter: () => globalThis.__TEST_ROUTER__,
  usePathname: () => globalThis.__TEST_ROUTER__.pathname,
  Link: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement('a', { href, ...props }, children),
  routing: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
  },
}))

jest.mock('framer-motion', () => {
  const ReactModule = require('react') as typeof React

  const motion = new Proxy(
    {},
    {
      get: (_, tag: string) =>
        ReactModule.forwardRef(
          (
            {
              children,
              animate,
              exit,
              initial,
              transition,
              variants,
              viewport,
              whileInView,
              ...props
            }: React.HTMLAttributes<HTMLElement> & {
              children?: React.ReactNode
              animate?: unknown
              exit?: unknown
              initial?: unknown
              transition?: unknown
              variants?: unknown
              viewport?: unknown
              whileInView?: unknown
            },
            ref
          ) =>
            ReactModule.createElement(
              tag,
              {
                ref,
                ...props,
              },
              children
            )
        ),
    }
  )

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      ReactModule.createElement(ReactModule.Fragment, null, children),
    useScroll: () => ({ scrollYProgress: 0 }),
    useTransform: (_value: unknown, _input: unknown, output: unknown[]) => output[0],
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: jest.fn(),
    }),
    useSpring: (value: unknown) => value,
  }
})

beforeEach(() => {
  globalThis.__TEST_INTL__.locale = 'en'
  globalThis.__TEST_INTL__.translate = (key: string) => key
  globalThis.__TEST_ROUTER__.pathname = '/current-path'
  globalThis.__TEST_ROUTER__.replace.mockReset()
  globalThis.__TEST_THEME__.theme = 'light'
  globalThis.__TEST_THEME__.setTheme.mockReset()
  rafTick = 0
})
