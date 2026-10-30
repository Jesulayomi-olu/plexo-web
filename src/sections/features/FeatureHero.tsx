'use client'

import type { CSSProperties, ReactNode } from 'react'
import { BlurIn } from '../../components/BlurIn'
import { Button, type ButtonVariant } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { useFitScale } from '../../lib/useFitScale'
import styles from './FeatureHero.module.css'

/**
 * Product page heroes on the lime-line photo (the Build with Sol "image 19", turned −90°), 1440×618:
 * - MCP and API (668:27188): one white card (722×496, 1px #74a418, r40) in the centre.
 * - E-commerce (731:12628) and Email & Marketing (736:14781): the card at (77.5, 61) and a 518×496
 *   panel at (826, 59) with the product picture.
 * Card: column gap 40, centred: the 48px heading (526 box) and lead (372, 24 below), the actions, and
 * the trial note. At 1200 and wider the composition keeps Figma's positions and scales below 1440; on
 * smaller screens the card and the panel stack.
 */
type Action = { label: string; href: string; variant?: ButtonVariant }

export default function FeatureHero({
  id,
  title,
  lead,
  action,
  link,
  note,
  visual,
}: {
  id: string
  title: string
  lead: string
  action: Action
  link?: { label: string; href: string }
  /** The trial note under the actions. */
  note?: string
  /** The right-hand panel: its tone and its 518×496 contents. */
  visual?: { tone: 'tint' | 'white'; label: string; content: ReactNode }
}) {
  const { ref: fitRef, scale, fitted } = useFitScale<HTMLDivElement>(1440)
  const { ref: visualRef, scale: visualScale } = useFitScale<HTMLDivElement>(518, 0)
  const titleId = `${id}-title`

  return (
    <section id="top" data-section={id} className={styles.hero} aria-labelledby={titleId}>
      <img src="/assets/sol/hero-lines.webp" width={1600} height={1200} alt="" className={styles.lines} fetchPriority="high" />
      <div ref={fitRef} className={styles.fit} style={{ '--s': fitted ? scale : 1 } as CSSProperties}>
        <div className={`${styles.stage} ${visual ? styles.split : styles.single}`}>
          <div className={styles.card}>
            <div className={styles.text}>
              <BlurIn as="h1" blur={14} duration={1.4} className={styles.title}>
                <span id={titleId}>{title}</span>
              </BlurIn>
              <BlurIn as="p" delay={0.15} blur={8} duration={1.2} className={styles.lead}>
                {lead}
              </BlurIn>
            </div>
            <Reveal delay={0.3} className={styles.actions}>
              <Button href={action.href} variant={action.variant}>
                {action.label}
              </Button>
              {link && (
                <a className={styles.link} href={link.href}>
                  {link.label}
                </a>
              )}
            </Reveal>
            {note && (
              <Reveal delay={0.36}>
                <p className={styles.note}>{note}</p>
              </Reveal>
            )}
          </div>

          {visual && (
            <Reveal delay={0.25} y={20} className={styles.visualSlot}>
              <div
                ref={visualRef}
                className={`${styles.visual} ${visual.tone === 'tint' ? styles.tint : ''}`}
                style={{ '--v': visualScale } as CSSProperties}
                role="img"
                aria-label={visual.label}
              >
                <div className={styles.visualScale}>{visual.content}</div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
