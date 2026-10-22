'use client'

import { motion, type Variants } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { ease, useStaticMotion } from '../../lib/motion'
import styles from './FeatureTable.module.css'

/**
 * Figma "Pricing Comparison Table" (571:11524): "Key Features" heading and a five-column table
 * (feature 280 · four equal plan columns). Cell values: text, true = check, false = minus, null = blank
 * (cells Figma leaves empty).
 */
type Cell = string | boolean | null

const plansHeader = ['Free Trial', 'Starter', 'Pro', 'Enterprise']

const rows: { feature: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { feature: 'Pages', cells: ['1', '5', '15', 'Unlimited'] },
  { feature: 'Funnels', cells: ['1', null, '5', 'Unlimited'] },
  { feature: 'Products', cells: [null, '5', '25', 'Unlimited'] },
  { feature: 'Plexo AI credits', cells: ['50 total', '300/mo', '1,500/mo', 'Custom'] },
  { feature: 'Drag and drop canvas', cells: [true, true, true, true] },
  { feature: 'Your own domain + SSL', cells: [false, true, true, true] },
  { feature: 'Remove Plexo badge', cells: [false, false, true, true] },
  { feature: 'Email designs', cells: [null, null, true, true] },
  { feature: 'Blog + SEO tools', cells: [true, true, true, true] },
  { feature: 'WordPress import', cells: [false, true, true, true] },
  { feature: 'Plexo MCP (Claude, ChatGPT, Cursor)', cells: [false, false, true, true] },
  { feature: 'API + SDK', cells: [false, false, null, true] },
  { feature: 'Code export', cells: [null, true, true, true] },
  { feature: 'Team seats', cells: ['1', '1', null, null] },
  { feature: 'White label', cells: [false, false, false, true] },
  { feature: 'SSO + SLA', cells: [false, false, false, true] },
  { feature: 'Support', cells: [null, 'Email', 'Priority email', 'Dedicated manager'] },
]

const body: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
}

const row: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
}

/** Checks pop in just after their row lands. */
const mark: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  shown: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 520, damping: 24, delay: 0.12 } },
}

function Value({ cell, isStatic }: { cell: Cell; isStatic: boolean }) {
  if (cell === null) return null
  if (typeof cell === 'string') return <span className={styles.value}>{cell}</span>

  const src = cell ? '/assets/pricing/table-check.svg' : '/assets/pricing/table-minus.svg'
  const image = <img src={src} width={20} height={20} alt={cell ? 'Included' : 'Not included'} />
  if (isStatic) return <span className={styles.mark}>{image}</span>
  return (
    <motion.span className={styles.mark} variants={mark}>
      {image}
    </motion.span>
  )
}

export default function FeatureTable() {
  const isStatic = useStaticMotion()
  const Body = isStatic ? 'tbody' : motion.tbody
  const Row = isStatic ? 'tr' : motion.tr
  const bodyMotion = isStatic
    ? {}
    : { variants: body, initial: 'hidden', whileInView: 'shown', viewport: { once: true, amount: 0.15 } }
  const rowMotion = isStatic ? {} : { variants: row }

  return (
    <section id="compare" data-section="compare" className={styles.section} aria-labelledby="compare-title">
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <h2 id="compare-title" className={styles.title}>
            Key Features
          </h2>
        </Reveal>
        <Reveal delay={0.06} className={styles.frame}>
          <div className={styles.scroller} tabIndex={0} role="region" aria-label="Plan comparison (scrolls sideways)">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.featureCell}>
                    Feature
                  </th>
                  {plansHeader.map((plan) => (
                    <th key={plan} scope="col">
                      {plan}
                    </th>
                  ))}
                </tr>
              </thead>
              <Body {...bodyMotion}>
                {rows.map((r) => (
                  <Row key={r.feature} {...rowMotion}>
                    <th scope="row" className={styles.featureCell}>
                      {r.feature}
                    </th>
                    {r.cells.map((cell, i) => (
                      <td key={plansHeader[i]}>
                        <Value cell={cell} isStatic={isStatic} />
                      </td>
                    ))}
                  </Row>
                ))}
              </Body>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
