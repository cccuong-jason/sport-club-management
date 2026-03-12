import './globals.css'
import { Outfit, Work_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

const workSans = Work_Sans({
  subsets: ['latin'],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${workSans.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
        <ClerkProvider>
          <>
            {children}
            <Toaster />
          </>
        </ClerkProvider>
      </body>
    </html>
  )
}
