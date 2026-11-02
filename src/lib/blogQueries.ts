import type { EntityItem } from 'electrodb'
import {
  BlogPost,
  BlogAuthor,
  BlogCategory,
  BlogTag,
  BlogPostCategory,
  BlogPostTag,
} from './blogEntities'

// The marketing blog claims a single reserved templateId so it can reuse the
// per-tenant data model without introducing a separate platform entity.
const TEMPLATE_ID =
  process.env.MARKETING_BLOG_TEMPLATE_ID?.trim() ?? 'plexo-marketing-blog'

type PostItem = EntityItem<typeof BlogPost>

export type BlogPostCard = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  featuredImageUrl: string | null
  featuredImageAlt: string | null
  publishedAt: Date | null
  readingTimeMinutes: number | null
  author: { name: string; slug: string; avatarUrl: string | null } | null
  categories: { category: { name: string; slug: string } }[]
  tags: { tag: { name: string; slug: string } }[]
}

export type BlogPostDetail = BlogPostCard & {
  contentHtml: string
  metaTitle: string | null
  metaDescription: string | null
  ogImageUrl: string | null
  noindex: boolean
}

function isPubliclyVisible(post: PostItem): boolean {
  if (!post.publishedAt) return false
  if (post.publishedAt > new Date().toISOString()) return false
  return post.status === 'PUBLISHED' || post.status === 'SCHEDULED'
}

async function loadPosts(): Promise<PostItem[]> {
  const { data } = await BlogPost.query.byStatus({ templateId: TEMPLATE_ID }).go()
  return data
}

async function hydrateCards(posts: PostItem[]): Promise<BlogPostCard[]> {
  if (posts.length === 0) return []

  const [
    { data: authors },
    { data: categories },
    { data: tags },
    postCategoryBatches,
    postTagBatches,
  ] = await Promise.all([
    BlogAuthor.query.primary({ templateId: TEMPLATE_ID }).go(),
    BlogCategory.query.primary({ templateId: TEMPLATE_ID }).go(),
    BlogTag.query.primary({ templateId: TEMPLATE_ID }).go(),
    Promise.all(posts.map((p) => BlogPostCategory.query.primary({ templateId: TEMPLATE_ID, postId: p.id }).go())),
    Promise.all(posts.map((p) => BlogPostTag.query.primary({ templateId: TEMPLATE_ID, postId: p.id }).go())),
  ])

  const authorById = new Map(authors.map((a) => [a.id, a]))
  const categoryById = new Map(categories.map((c) => [c.id, c]))
  const tagById = new Map(tags.map((t) => [t.id, t]))

  return posts.map((post, i) => {
    const author = post.authorId ? authorById.get(post.authorId) : undefined
    const postCategories = postCategoryBatches[i].data
      .map((pc) => categoryById.get(pc.categoryId))
      .filter((c): c is NonNullable<typeof c> => !!c)
      .map((c) => ({ category: { name: c.name, slug: c.slug } }))
    const postTags = postTagBatches[i].data
      .map((pt) => tagById.get(pt.tagId))
      .filter((t): t is NonNullable<typeof t> => !!t)
      .map((t) => ({ tag: { name: t.name, slug: t.slug } }))

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? null,
      featuredImageUrl: post.featuredImageUrl ?? null,
      featuredImageAlt: post.featuredImageAlt ?? null,
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
      readingTimeMinutes: post.readingTimeMinutes ?? null,
      author: author ? { name: author.name, slug: author.slug, avatarUrl: author.avatarUrl ?? null } : null,
      categories: postCategories,
      tags: postTags,
    }
  })
}

export async function listPublishedPosts(opts: { page?: number; perPage?: number } = {}): Promise<BlogPostCard[]> {
  const perPage = opts.perPage ?? 60
  const page = Math.max(1, opts.page ?? 1)
  const all = await loadPosts()
  const filtered = all
    .filter(isPubliclyVisible)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage)
  return hydrateCards(pageItems)
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const { data: post } = await BlogPost.get({ templateId: TEMPLATE_ID, slug }).go()
  if (!post || !isPubliclyVisible(post)) return null
  const [card] = await hydrateCards([post])
  return {
    ...card,
    contentHtml: post.contentHtml,
    metaTitle: post.metaTitle ?? null,
    metaDescription: post.metaDescription ?? null,
    ogImageUrl: post.ogImageUrl ?? null,
    noindex: post.noindex ?? false,
  }
}

export async function listAllPublishedSlugs(): Promise<string[]> {
  const all = await loadPosts()
  return all
    .filter(isPubliclyVisible)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
    .map((p) => p.slug)
}
