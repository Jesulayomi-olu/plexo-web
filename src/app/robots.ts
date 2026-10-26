import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    // motion-lab.html is an internal animation playground, not a page.
    rules: { userAgent: '*', allow: '/', disallow: '/motion-lab.html' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
