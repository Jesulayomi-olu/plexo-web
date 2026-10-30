import { Fragment, type ReactNode } from 'react'
import { AVATAR, type Article, type Shot } from './data'
import styles from './parts.module.css'

/** "Icon / image" (24) in a #f4f5f0 slot, r12: Figma's stand-in until articles have pictures. */
export function ImageSlot({ className }: { className?: string }) {
  return (
    <div className={`${styles.slot} ${className ?? ''}`}>
      <span className={styles.slotIcon} aria-hidden="true">
        <img src="/assets/resources/image.svg" width={20} height={20} alt="" />
      </span>
    </div>
  )
}

/** A site screenshot in a clipped slot, shown from the top at the slot's width. */
export function ShotSlot({ shot, className, alt = '' }: { shot: Shot; className?: string; alt?: string }) {
  return (
    <div className={`${styles.shot} ${className ?? ''}`}>
      <img src={shot.src} width={shot.w} height={shot.h} alt={alt} loading="lazy" />
    </div>
  )
}

/** "Tag": #f4f5f0 pill (or the lime "Featured" one), padding 4/10, 600 12/15.6. */
export function Tag({ children, tone = 'grey' }: { children: ReactNode; tone?: 'grey' | 'lime' }) {
  return <span className={`${styles.tag} ${tone === 'lime' ? styles.tagLime : ''}`}>{children}</span>
}

/** Figma's own line breaks in a title. */
export function Lines({ lines }: { lines: string[] }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ))
}

/**
 * "Article" card (779:16726 and its copies): white, 1px #d7d8d3, r16, padding 16, column gap 16: the tag,
 * the 220-tall picture slot, the title (600 20/26) and the date · read time (12/15.6).
 */
export function ArticleCard({ article, className }: { article: Article; className?: string }) {
  return (
    <a href={`/resources/blog/${article.slug}`} className={`${styles.card} ${className ?? ''}`}>
      <Tag>{article.tag}</Tag>
      <ImageSlot className={styles.cardSlot} />
      <h3 className={styles.cardTitle}>
        <Lines lines={article.title} />
      </h3>
      <p className={styles.meta}>
        <span>{article.date}</span>
        <span aria-hidden="true">·</span>
        <span>{article.readTime}</span>
      </p>
    </a>
  )
}

/** "Avatar": 40, r8 (the round 24 one on the article byline), over #e8e8e4. */
export function Avatar({ size = 40, round = false }: { size?: number; round?: boolean }) {
  return (
    <img
      src={AVATAR}
      width={size}
      height={size}
      alt=""
      className={`${styles.avatar} ${round ? styles.avatarRound : ''}`}
      loading="lazy"
    />
  )
}

/**
 * "Back navigation": #fcfcfa, 1px #d7d8d3 below, padding 16/80; the Ghost Small button (32, padding 12,
 * gap 6, 600 12/13.2) with the 16px arrow.
 */
export function BackNav({ href, label }: { href: string; label: string }) {
  return (
    <div className={styles.back}>
      <div className="container">
        <a href={href} className={styles.backLink}>
          <img src="/assets/resources/arrow-left.svg" width={16} height={16} alt="" />
          {label}
        </a>
      </div>
    </div>
  )
}

/** Page title (40/46) and lead (16/24 #5b5b58), 16 apart; centred or left-aligned. */
export function PageHeader({ title, lead, align = 'center', id }: { title: string; lead: string; align?: 'center' | 'start'; id: string }) {
  return (
    <header className={`${styles.header} ${align === 'start' ? styles.headerStart : ''}`}>
      <h1 id={id} className={styles.title}>
        {title}
      </h1>
      <p className={styles.lead}>{lead}</p>
    </header>
  )
}

/** "Chip" filters: the chosen one #1d3509 with white text, the rest white with a 1px #d7d8d3 line. */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[]
  value: T | null
  onChange: (id: T) => void
  label: string
}) {
  return (
    <div className={styles.chips} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={styles.chip}
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** "Load more…": Outline, Size=Medium, centred. */
export function LoadMore({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className={styles.more}>
      <button type="button" className={styles.moreButton} onClick={onClick}>
        {label}
      </button>
    </div>
  )
}

/** Shown when a filter leaves nothing to list. */
export function Empty({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>
}
