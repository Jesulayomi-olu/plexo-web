import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'
import Providers from './providers'
import Analytics from './Analytics'
import { SITE_URL } from '../lib/site'
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
  metadataBase: new URL(SITE_URL),
  title: 'Plexo — What are we building today?',
  description: 'Plexo. Describe it or drag and drop it. Either way, you get a site that brings in customers.',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Plexo — What are we building today?',
    description: 'Describe it or drag and drop it. Either way, you get a site that brings in customers.',
    siteName: 'Plexo',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Plexo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plexo — What are we building today?',
    description: 'Describe it or drag and drop it. Either way, you get a site that brings in customers.',
    images: ['/opengraph-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Plexo',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Plexo',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
