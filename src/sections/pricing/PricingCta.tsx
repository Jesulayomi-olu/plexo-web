'use client'

import { BlurIn } from '../../components/BlurIn'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import styles from './PricingCta.module.css'

/**
 * Pricing page "Final CTA" (571:11804): #f5f7ed, padding 100/80, column gap 32, centred: heading,
 * 20px subline in #1d3509 and the Medium primary "Start Free" button. The For You pages reuse it with
 * their own heading and subline (571:13008 and siblings).
 */
export default function PricingCta({
  title = 'Your site is one prompt away.',
  sub = 'Start free today. Go live when you are ready',
}: {
  title?: string
  sub?: string
}) {
  return (
    <section id="start" data-section="start" className={styles.cta} aria-labelledby="pricing-cta-title">
      <div className={`container ${styles.inner}`}>
        <BlurIn trigger="view" blur={10} duration={1.2}>
          <h2 id="pricing-cta-title" className={`h2 ${styles.title}`}>
            {title}
          </h2>
        </BlurIn>
        <Reveal delay={0.1}>
          <p className={styles.sub}>{sub}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <Button href="/#start">Start Free</Button>
        </Reveal>
      </div>
    </section>
  )
}
