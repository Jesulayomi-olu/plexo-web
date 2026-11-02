import type { Metadata } from 'next'

const OG_IMAGE = { url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Plexo' }

export function pageMetadata(title: string, description: string, path = '/'): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      title,
      description,
      siteName: 'Plexo',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image.png'],
    },
  }
}
