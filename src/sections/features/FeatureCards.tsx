'use client'

import { Fragment, type CSSProperties } from 'react'
import { Reveal } from '../../components/Reveal'
import styles from './FeatureCards.module.css'

/**
 * The feature-card grids on the product pages ("Made for you" frames):
 * - "drag": Design with a Drag, "Every detail, just how you want it." (657:24799): 40px heading and a
 *   lead, 3 × 2 cards of 400×240, gap 40.
 * - "email": Email & Marketing, "What You get" (736:14851): 48px heading, 3 × 2 cards of 376×240;
 *   padding 80 above, 120 below.
 * - "ecommerce": E-commerce, "What You get" (736:13521): 48px heading; a tall first card (290×512)
 *   beside two rows of three 290×240 cards (column gap 40, row gap 33).
 * Cards: lime (#d5f490 at 80%), grey (#e8e8e4) or dark (#1d3509); padding 24/24/32, a 32px icon tile,
 * 64 below it the title (600 20/26) and 12 below that the body (16/24).
 */
export type FeatureCard = {
  tone: 'lime' | 'grey' | 'dark'
  title: string
  /** Lines of the body; Figma's own line breaks are kept. */
  body: string[]
  /** Figma's text box width: the copy wraps (or runs past the padding) exactly as in Figma at 1440. */
  bodyWidth: number
  /** The icon artwork and where it sits in its 19.2px frame. */
  icon: { src: string; w?: number; h?: number; x?: number; y?: number }
}

export default function FeatureCards({
  variant,
  id,
  title,
  lead,
  cards,
}: {
  variant: 'drag' | 'email' | 'ecommerce'
  id: string
  title: string
  lead?: string
  cards: FeatureCard[]
}) {
  const titleId = `${id}-title`
  return (
    <section id={id} data-section={id} className={`${styles.section} ${styles[variant]}`} aria-labelledby={titleId}>
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </Reveal>
        <ul className={styles.grid}>
          {cards.map((card, i) => {
            const { src, w = 19.2, h = 19.2, x = 0, y = 0 } = card.icon
            return (
              <Reveal key={card.title} as="li" delay={0.05 * i} className={`${styles.card} ${styles[card.tone]}`}>
                <span className={styles.iconTile} aria-hidden="true">
                  <span className={styles.iconFrame}>
                    <img src={src} width={w} height={h} alt="" style={{ left: x, top: y }} />
                  </span>
                </span>
                <span className={styles.copy}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.body} style={{ '--body-w': `${card.bodyWidth}px` } as CSSProperties}>
                    {card.body.map((line, j) => (
                      <Fragment key={j}>
                        {j > 0 && <br className={styles.break} />}
                        {line}
                      </Fragment>
                    ))}
                  </p>
                </span>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
