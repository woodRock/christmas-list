import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['SOFT', 'opsz'] })

export const metadata: Metadata = {
  title: 'Giftd',
  description: "Manage your family's Christmas and birthday lists",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf6f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1612' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh">
        <ToastProvider>
          <Navbar />
          <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 sm:pt-10 md:pb-16">{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}
