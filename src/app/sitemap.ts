import type { MetadataRoute } from 'next'
import { audiences } from '../sections/forYou/audiences'
import { SITE_URL } from '../lib/site'
import { listAllPublishedSlugs } from '../lib/blogQueries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogSlugs: string[] = []
  try {
    blogSlugs = await listAllPublishedSlugs()
  } catch {
    // Blog data unavailable at build time (e.g. missing env vars locally) — skip gracefully.
  }

  return [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/pricing`, priority: 0.8 },
    ...audiences.map((a) => ({ url: `${SITE_URL}/for-you/${a.id}`, priority: 0.7 })),
    { url: `${SITE_URL}/blog`, priority: 0.8 },
    ...blogSlugs.map((slug) => ({ url: `${SITE_URL}/blog/${slug}`, priority: 0.6 })),
  ]
}
