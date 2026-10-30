'use client'

import type { CSSProperties } from 'react'
import { BlurIn } from '../../components/BlurIn'
import { Button, type ButtonVariant } from '../../components/Button'
import { PromptBox } from '../../components/PromptBox'
import { Reveal } from '../../components/Reveal'
import styles from './PricingCta.module.css'

/**
 * Pricing page "Final CTA" (571:11804): #f5f7ed, padding 100/80, column gap 32, centred: heading,
 * 20px subline in #1d3509 and the Medium primary "Start Free" button. The For You pages reuse it with
 * their own heading and subline (571:13008 and siblings); Build with Sol (575:15643) has no subline and a
 * Large "Start with a Prompt" (234 wide) that goes to the page's own prompt box. The product pages:
 * Design with a Drag (644:21766) and Email & Marketing (736:15451) as pricing; MCP and API (668:28278)
 * with the Secondary "Read the docs" and a "Get an API key" link (gap 40); E-commerce (736:14656) with
 * the one-line prompt box (792×89, no helper row) 64 below the heading instead of a button.
 */
export default function PricingCta({
  title = 'Your site is one prompt away.',
  sub = 'Start free today. Go live when you are ready',
  cta = { label: 'Start Free', href: '/#start' },
  link,
  prompt,
  titleBox = 596,
}: {
  title?: string
  /**
   * Most frames set the heading left-aligned in a fixed, centred box rather than centring it: 596 wide
   * (pricing, For You, MCP and API), 494 on Design with a Drag and Email & Marketing. null: centred
   * (Build with Sol, E-commerce).
   */
  titleBox?: number | null
  /** null: no subline. */
  sub?: string | null
  cta?: { label: string; href: string; large?: boolean; variant?: ButtonVariant }
  /** Underlined text link beside the button. */
  link?: { label: string; href: string }
  /** Placeholder of a one-line prompt box shown instead of the button. */
  prompt?: string
}) {
  return (
    <section
      id="start"
      data-section="start"
      className={`${styles.cta} ${prompt ? styles.withPrompt : ''}`}
      aria-labelledby="pricing-cta-title"
    >
      <div className={`container ${styles.inner}`}>
        <BlurIn trigger="view" blur={10} duration={1.2}>
          <h2
            id="pricing-cta-title"
            className={`h2 ${styles.title} ${titleBox ? styles.boxed : ''}`}
            style={titleBox ? ({ '--box': `${titleBox}px` } as CSSProperties) : undefined}
          >
            {title}
          </h2>
        </BlurIn>
        {sub !== null && !prompt && (
          <Reveal delay={0.1}>
            <p className={styles.sub}>{sub}</p>
          </Reveal>
        )}
        {prompt ? (
          <Reveal delay={0.18} className={styles.promptSlot}>
            <PromptBox placeholder={prompt} meta={false} />
          </Reveal>
        ) : (
          <Reveal delay={0.18} className={styles.actions}>
            <Button
              href={cta.href}
              variant={cta.variant}
              size={cta.large ? 'large' : 'default'}
              className={cta.large ? styles.large : undefined}
            >
              {cta.label}
            </Button>
            {link && (
              <a className={styles.link} href={link.href}>
                {link.label}
              </a>
            )}
          </Reveal>
        )}
      </div>
    </section>
  )
}
