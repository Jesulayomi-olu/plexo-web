'use client'

import { useState } from 'react'
import { Reveal } from '../../components/Reveal'
import { BillingToggle, PlanGrid, plans, type Period } from '../Pricing'
import { StoryCard, stories } from '../SocialProof'
import type { Audience } from './audiences'
import styles from './PlanAndProof.module.css'

/**
 * For You "Pricing" (571:12947) and "Social proof" (571:12972).
 * Pricing: "Recommended plan", the Monthly / Yearly toggle (Component 7) and the page's cards — Pro
 * and Enterprise, or Starter · Pro · Enterprise (Small Business) — with this page's changes to them.
 * Social proof: the home page's story card on its own.
 */
export function RecommendedPlan({ pricing }: { pricing: Audience['pricing'] }) {
  const [period, setPeriod] = useState<Period>('monthly')
  const tiers = pricing.tiers ?? ['Pro', 'Enterprise']
  const items = tiers.map((tier) => {
    const plan = plans.find((p) => p.name === tier)!
    return { ...plan, ...pricing.overrides[tier] }
  })

  return (
    <section id="plans" data-section="plans" className={styles.plans} aria-labelledby="plans-title">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <h2 id="plans-title" className="h2">
            Recommended plan
          </h2>
        </Reveal>
        <Reveal delay={0.08} className={styles.toggleWrap}>
          <BillingToggle period={period} onChange={setPeriod} />
        </Reveal>
        <div className={styles.cards}>
          <PlanGrid period={period} items={items} />
        </div>
      </div>
    </section>
  )
}

export function AudienceProof() {
  const [open, setOpen] = useState(false)

  return (
    <section id="showcase" data-section="showcase" className={styles.proof} aria-labelledby="proof-title">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <h2 id="proof-title" className="h2">
            Social proof
          </h2>
        </Reveal>
        <Reveal delay={0.08} className={styles.story}>
          <StoryCard story={stories[0]} open={open} onShowPrompt={() => setOpen(true)} onClosePrompt={() => setOpen(false)} />
        </Reveal>
      </div>
    </section>
  )
}
