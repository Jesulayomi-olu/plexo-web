import Link from 'next/link'
import Nav from '../../sections/Nav'
import Footer from '../../sections/Footer'
import { BlurIn } from '../../components/BlurIn'
import { Reveal } from '../../components/Reveal'
import { listPublishedPosts } from '../../lib/blogQueries'
import type { BlogPostCard } from '../../lib/blogQueries'
import styles from './page.module.css'
import { pageMetadata } from '../../lib/metadata'

export const metadata = pageMetadata(
  'Blog — Plexo',
  'Product updates, guides, and stories from the team building Plexo — the simple, user-friendly website builder.',
  '/blog',
)

function formatDate(date: Date | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function PostCard({ post }: { post: BlogPostCard }) {
  return (
    <article className={styles.card}>
      {post.featuredImageUrl ? (
        <Link href={`/blog/${post.slug}`} className={styles.cardImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.featuredImageUrl} alt={post.featuredImageAlt ?? ''} />
        </Link>
      ) : null}
      <div className={styles.cardBody}>
        {post.categories.length > 0 ? (
          <div className={styles.chips}>
            {post.categories.map(({ category }) => (
              <Link key={category.slug} href={`/blog`} className={styles.chip}>
                {category.name}
              </Link>
            ))}
          </div>
        ) : null}
        <h2 className={styles.cardTitle}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt ? <p className={styles.excerpt}>{post.excerpt}</p> : null}
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
    </article>
  )
}

export default async function BlogPage() {
  let posts: import('../../lib/blogQueries').BlogPostCard[] = []
  try {
    posts = await listPublishedPosts({ page: 1, perPage: 60 })
  } catch {
    // Blog data unavailable at build time — render empty state.
  }

  return (
    <>
      <Nav />
      <main className="page-main">
        <section className={styles.hero}>
          <div className="container">
            <BlurIn as="p" className={styles.eyebrow}>
              The Plexo Blog
            </BlurIn>
            <BlurIn as="h1" delay={0.1} className={styles.heading}>
              Ideas, updates &amp; guides
            </BlurIn>
            <Reveal delay={0.2}>
              <p className={`lead ${styles.tagline}`}>
                Product updates, guides, and stories from the team building Plexo.
              </p>
            </Reveal>
          </div>
        </section>

        <section className={styles.posts}>
          <div className="container">
            {posts.length === 0 ? (
              <p className={styles.empty}>No posts published yet — check back soon.</p>
            ) : (
              <ul className={styles.grid}>
                {posts.map((post, i) => (
                  <Reveal key={post.id} as="li" delay={0.05 * (i % 3)}>
                    <PostCard post={post} />
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
