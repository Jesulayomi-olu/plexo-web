'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '../../components/Reveal'
import { articleBody, articleByline, type Article } from './data'
import { ArticleCard, Avatar, ImageSlot, Lines } from './parts'
import styles from './ArticleView.module.css'

/**
 * Blog article (894:5348): white, padding 80/80/100, column gap 48, centred. The title (600 40/46, a 666
 * column) over the byline (round avatar, "Maxwell, Sales Lead" · date · read time), "Copy Link" 16
 * below; the 1060×360 picture slot; the body (500 16/25.6, #333332, first lines indented); then
 * "Discover More Stories" with three article cards.
 */
function CopyLink() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split('?')[0])
      setCopied(true)
    } catch {
      // Clipboard blocked: nothing to confirm.
    }
  }

  return (
    <button type="button" className={styles.copy} onClick={copy}>
      <span className={styles.copyIcon} aria-hidden="true">
        <img src="/assets/resources/link.svg" width={14.2581} height={14.2447} alt="" />
      </span>
      <span aria-live="polite">{copied ? 'Link copied' : 'Copy Link'}</span>
    </button>
  )
}

export default function ArticleView({ article, related }: { article: Article; related: Article[] }) {
  return (
    <div className={`container ${styles.content}`}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            <Lines lines={article.title} />
          </h1>
          <p className={styles.byline}>
            <Avatar size={24} round />
            <span className={styles.bylineText}>
              <span>
                <span className={styles.author}>{articleByline.name}</span>
                {articleByline.role}
              </span>
              <i className={styles.dot} aria-hidden="true" />
              <span>{article.date}</span>
              <i className={styles.dot} aria-hidden="true" />
              <span>{article.readTime}</span>
            </span>
          </p>
        </div>
        <CopyLink />
      </header>

      <Reveal className={styles.picture}>
        <ImageSlot className={styles.pictureSlot} />
      </Reveal>

      <div className={styles.body}>
        {articleBody.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* Figma: "DIscover More Stories". */}
      <section className={styles.more} aria-labelledby="more-title">
        <h2 id="more-title" className={styles.moreTitle}>
          Discover More Stories
        </h2>
        <div className={styles.grid}>
          {related.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </div>
  )
}
