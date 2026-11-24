'use client'

import type { CSSProperties, ReactNode } from 'react'
import { BlurIn } from '../../components/BlurIn'
import { Button, type ButtonVariant } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { useFitScale } from '../../lib/useFitScale'
import styles from './FeatureHero.module.css'

/**
 * Product page heroes on the lime-line photo (the Build with Sol "image 19", turned −90°), 1440×618:
 * - MCP and API (668:27188) and Email & Marketing (736:14781): one white card (722×496, 1px #74a418,
 *   r40), centred across the width; its top is 75 on MCP (centred in a 646 frame clipped to 618) and 61
 *   on Email (centred in the 618).
 * - E-commerce (731:12628): the card at (77.5, 61) and a 518×496 panel at (826, 59) with the product
 *   picture.
 * Card: column gap 40, centred: the 48px heading (526 box) and lead (372, 24 below; E-commerce's is
 * 435), the actions, and the trial note. At 1200 and wider the composition keeps Figma's positions and scales below 1440; on
 * smaller screens the card and the panel stack (on phones the panel can be cropped to its contents).
 */
type Action = {
  label: string
  href: string
  variant?: ButtonVariant
  /** Figma's fixed button width, where it is wider than the label needs (Email's "View Templates": 158). */
  width?: number
}

export default function FeatureHero({
  id,
  title,
  lead,
  action,
  link,
  note,
  visual,
  textWidth,
  cardTop,
}: {
  id: string
  title: string
  lead: string
  action: Action
  /** Underlined text link beside the button; without an href it is shown but goes nowhere yet. */
  link?: { label: string; href?: string }
  /** The trial note under the actions. */
  note?: string
  /**
   * The right-hand panel: its tone and its 518×496 contents. `phoneCrop` (in those coordinates): on phones
   * only that part of the panel shows, scaled to the width, so the contents read larger.
   */
  visual?: {
    tone: 'tint' | 'white'
    label: string
    content: ReactNode
    phoneCrop?: { x: number; y: number; width: number; height: number }
  }
  /** Width of the heading-and-lead column where a frame's lead box differs from the 372 default. */
  textWidth?: number
  /** The single card's top in the 1440 composition where it differs from MCP's 75 (Email: 61). */
  cardTop?: number
}) {
  const { ref: fitRef, scale, fitted } = useFitScale<HTMLDivElement>(1440)
  // The panel's contents are in Figma's 518 coordinates, stroke included; the hook measures inside the
  // 1px border, so 516 there is the full 518 (scale 1 at full size).
  const { ref: visualRef, scale: visualScale } = useFitScale<HTMLDivElement>(516, 0)
  const titleId = `${id}-title`
  const cardVars: Record<string, string> = {}
  if (cardTop !== undefined) cardVars['--card-top'] = `${cardTop}px`
  if (action.width) cardVars['--action-w'] = `${action.width}px`

  return (
    <section id="top" data-section={id} className={styles.hero} aria-labelledby={titleId}>
      <img src="/assets/sol/hero-lines.webp" width={1600} height={1200} alt="" className={styles.lines} fetchPriority="high" />
      <div ref={fitRef} className={styles.fit} style={{ '--s': fitted ? scale : 1 } as CSSProperties}>
        <div className={`${styles.stage} ${visual ? styles.split : styles.single}`}>
          <div className={styles.card} style={Object.keys(cardVars).length ? (cardVars as CSSProperties) : undefined}>
            <div className={styles.text} style={textWidth ? ({ '--text-w': `${textWidth}px` } as CSSProperties) : undefined}>
              <BlurIn as="h1" blur={14} duration={1.4} className={styles.title}>
                <span id={titleId}>{title}</span>
              </BlurIn>
              <BlurIn as="p" delay={0.15} blur={8} duration={1.2} className={styles.lead}>
                {lead}
              </BlurIn>
            </div>
            <Reveal delay={0.3} className={styles.actions}>
              <Button href={action.href} variant={action.variant} className={action.width ? styles.fixedAction : undefined}>
                {action.label}
              </Button>
              {link &&
                (link.href ? (
                  <a className={styles.link} href={link.href}>
                    {link.label}
                  </a>
                ) : (
                  <span className={styles.link}>{link.label}</span>
                ))}
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
                className={`${styles.visual} ${visual.tone === 'tint' ? styles.tint : ''} ${visual.phoneCrop ? styles.cropped : ''}`}
                style={
                  {
                    '--v': visualScale,
                    ...(visual.phoneCrop && {
                      '--crop-x': visual.phoneCrop.x,
                      '--crop-y': visual.phoneCrop.y,
                      '--crop-w': visual.phoneCrop.width,
                      '--crop-h': visual.phoneCrop.height,
                    }),
                  } as CSSProperties
                }
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
