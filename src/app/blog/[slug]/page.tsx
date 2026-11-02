import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '../../../sections/Nav'
import Footer from '../../../sections/Footer'
import { BlurIn } from '../../../components/BlurIn'
import { getPublishedPostBySlug, listAllPublishedSlugs } from '../../../lib/blogQueries'
import styles from './page.module.css'

type Params = { slug: string }

export const dynamicParams = false

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await listAllPublishedSlugs()
    // output: 'export' requires at least one path — use a placeholder when no posts exist yet.
    if (slugs.length === 0) return [{ slug: '_empty' }]
    return slugs.map((slug) => ({ slug }))
  } catch {
    return [{ slug: '_empty' }]
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  if (slug === '_empty') return {}
  const post = await getPublishedPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.metaTitle ?? `${post.title} — Plexo Blog`,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: post.ogImageUrl ? { images: [{ url: post.ogImageUrl }] } : undefined,
    robots: post.noindex ? { index: false } : undefined,
  }
}

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  if (slug === '_empty') notFound()
  const post = await getPublishedPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <Nav />
      <main className="page-main">
        <header className={styles.header}>
          <div className="container">
            <div className={styles.headerInner}>
              <Link href="/blog" className={styles.back}>
                <span className={styles.backArrow}>←</span> All posts
              </Link>

              {post.categories.length > 0 ? (
                <div className={styles.chips}>
                  {post.categories.map(({ category }) => (
                    <span key={category.slug} className={styles.chip}>
                      {category.name}
                    </span>
                  ))}
                </div>
              ) : null}

              <BlurIn as="h1" className={styles.title}>
                {post.title}
              </BlurIn>

              <div className={styles.meta}>
                {post.author ? (
                  <>
                    {post.author.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.author.avatarUrl} alt="" className={styles.metaAvatar} />
                    ) : null}
                    <span className={styles.metaAuthor}>{post.author.name}</span>
                    <span className={styles.metaDot}>&middot;</span>
                  </>
                ) : null}
                {post.publishedAt ? (
                  <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
                ) : null}
                {post.readingTimeMinutes ? (
                  <>
                    <span className={styles.metaDot}>&middot;</span>
                    <span>{post.readingTimeMinutes} min read</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <div className={styles.articleWrap}>
          <div className="container">
            <article className={styles.articleInner}>
              {post.featuredImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.featuredImageUrl}
                  alt={post.featuredImageAlt ?? ''}
                  className={styles.featuredImage}
                />
              ) : null}
              {/* contentHtml is sanitized at write time in plexo-web — lib/blog/sanitize.ts */}
              {/* eslint-disable-next-line react/no-danger */}
              <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
