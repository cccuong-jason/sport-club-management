import '../globals.css'
import { Anton, Work_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

const anton = Anton({
  weight: '400',
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-anton',
})

const workSans = Work_Sans({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-work-sans',
})
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs"

import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from "@/components/theme-provider"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode,
  params: Promise<{ locale: string }>
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${anton.variable} ${workSans.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ClerkProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
