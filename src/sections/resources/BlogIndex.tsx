'use client'

import { useState } from 'react'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { articles, blogCategories, featuredArticle, type Category } from './data'
import { ArticleCard, Chips, Empty, ImageSlot, LoadMore, Lines, PageHeader, Tag } from './parts'
import styles from './BlogIndex.module.css'

/**
 * Blog (718:9067): white, padding 80/80/100, column gap 48. The centred "Blog" header; the featured
 * article (r24, padding 24, gap 40: a 360-tall picture slot beside a 480 text column); the category
 * chips; the articles, three to a row (410 wide, gap 40/24); "Load more articles" while there are more
 * than a page. A search from the Resources hub arrives as `query` and narrows the list by title.
 */
const PAGE = 6

export default function BlogIndex({ query = '' }: { query?: string }) {
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [shown, setShown] = useState(PAGE)
  const words = query.trim().toLowerCase()

  const list = articles.filter(
    (a) => (category === 'all' || a.category === category) && (!words || a.title.join('').toLowerCase().includes(words)),
  )

  return (
    <div className={`container ${styles.content}`}>
      <PageHeader id="blog-title" title="Blog" lead="Ideas to grow your business online." />

      {!words && (
        <Reveal className={styles.featured}>
          <ImageSlot className={styles.featuredSlot} />
          <div className={styles.featuredText}>
            <div className={styles.tags}>
              <Tag tone="lime">Featured</Tag>
              <Tag>{featuredArticle.tag}</Tag>
            </div>
            <h2 className={styles.featuredTitle}>
              <Lines lines={featuredArticle.title} />
            </h2>
            <p className={styles.excerpt}>{featuredArticle.excerpt}</p>
            <p className={styles.meta}>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon} aria-hidden="true">
                  <img src="/assets/resources/calendar.svg" width={13.3333} height={14} alt="" style={{ left: 1.333, top: 0.667 }} />
                </span>
                {featuredArticle.date}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon} aria-hidden="true">
                  <img src="/assets/resources/clock.svg" width={14.6667} height={14.6667} alt="" style={{ left: 0.667, top: 0.667 }} />
                </span>
                {featuredArticle.readTime}
              </span>
            </p>
            <Button
              href={`/resources/blog/${featuredArticle.slug}`}
              variant="secondary"
              className={styles.cta}
              trailingIcon={<img src="/assets/resources/arrow-right-white.svg" width={16} height={16} alt="" />}
            >
              Read article
            </Button>
          </div>
        </Reveal>
      )}

      {words ? (
        <p className={styles.results}>
          Results for “{query.trim()}” · <a href="/resources/blog">Clear search</a>
        </p>
      ) : (
        <Chips
          label="Filter articles"
          options={blogCategories}
          value={category}
          onChange={(id) => {
            setCategory(id)
            setShown(PAGE)
          }}
        />
      )}

      {list.length ? (
        <div className={styles.grid}>
          {list.slice(0, shown).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <Empty>No articles here yet.</Empty>
      )}

      {list.length > shown && <LoadMore label="Load more articles" onClick={() => setShown((n) => n + PAGE)} />}
    </div>
  )
}
