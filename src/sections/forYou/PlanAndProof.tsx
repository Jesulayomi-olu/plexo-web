'use client'

import { useState } from 'react'
import { Reveal } from '../../components/Reveal'
import { BillingToggle, PlanGrid, plans, type Period } from '../Pricing'
import type { Audience } from './audiences'
import styles from './PlanAndProof.module.css'

/**
 * Solution page "Pricing" (571:12947): "Recommended plan", the Monthly / Yearly toggle (Component 7) and
 * the page's cards — Pro and Enterprise, or Starter · Pro · Enterprise (Small Business) — with this
 * page's changes to them. (The page's "Social proof" frame, the old Helimax story, is replaced by the home
 * page's stories, as the design team asked; see the page.)
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
          <h2 id="plans-title" className={styles.title}>
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
