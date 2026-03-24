import '../globals.css'
import type { ReactNode } from 'react'
import {
  ClerkProvider,
} from "@clerk/nextjs"

import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from "@/components/theme-provider"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { isClerkConfigured } from '@/lib/clerk-env'

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
  const clerkConfigured = isClerkConfigured()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {clerkConfigured ? (
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
        ) : (
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
        )}
      </body>
    </html>
  )
}
