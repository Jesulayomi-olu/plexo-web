import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import Providers from './providers'
import '../index.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-jakarta',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Plexo — What are we building today?',
  description: 'Plexo. Describe it or drag and drop it. Either way, you get a site that brings in customers.',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior: Next pauses index.css's smooth scrolling during client-side route changes (the
    // auth screens link to each other with next/link), so a new page starts at the top at once.
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
