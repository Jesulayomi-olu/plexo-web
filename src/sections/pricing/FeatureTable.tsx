'use client'

import { motion, type Variants } from 'framer-motion'
import { Reveal } from '../../components/Reveal'
import { ease, useStaticMotion } from '../../lib/motion'
import styles from './FeatureTable.module.css'

/**
 * Figma "Pricing Comparison Table" (571:11524): "Key Features" heading and a five-column table
 * (feature 280 · four equal plan columns). Cell values: text ("\n" breaks the line where Figma
 * does), true = check, false = minus. Copy is verbatim from Figma, without its stray spaces.
 */
type Cell = string | boolean

const plansHeader = ['Free Trial', 'Starter', 'Pro', 'Enterprise']

const rows: { feature: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { feature: 'Price', cells: ['$0', '$9/mo', '$19/mo', 'From $99/mo'] },
  { feature: 'Website Pages', cells: ['1 Page', '1 Website (Multi-pages)', '4 Website (Multi-pages)', 'Custom (Multi-pages)'] },
  { feature: 'Funnels', cells: ['0', '1', '3', 'Custom'] },
  { feature: 'Access to Blog', cells: [false, true, true, true] },
  { feature: 'Email templates', cells: ['1', '5', '20', 'Custom'] },
  { feature: 'Products/Commerce', cells: ['0', 'Yes, 1000 products', 'Yes, 5000 Products', 'Yes, 10000 products'] },
  {
    feature: 'Plexo AI credits',
    cells: ['$0.2 Value\n200 Credits', '$1 Value\n1000 Credits', '$2 Value\n2000 Credits', '$3 Value\n3000'],
  },
  { feature: 'Domains', cells: ['1 Subdomain only', '1 custom domain', '3 custom domains\n1 free domain', '1 Free .com domain'] },
  { feature: 'Plexo badge', cells: ['Yes', 'Can be Removed', 'Can be Removed', 'White-label'] },
  { feature: 'White label', cells: ['No', 'No', 'No', 'Yes'] },
  { feature: 'Team features', cells: ['No', 'Yes (2 users)', 'Yes (5 users)', 'Yes'] },
  { feature: 'Website Import', cells: ['Yes', 'Yes', 'Yes', 'Yes'] },
  { feature: 'HTML export', cells: ['No', 'Yes', 'Yes', 'Yes'] },
  { feature: 'Analytics', cells: ['No', 'Yes', 'Yes', 'Yes'] },
  { feature: 'MCP', cells: ['Yes', 'Yes', 'Yes', 'Yes'] },
  { feature: 'SDK', cells: ['Yes', 'Yes', 'Yes', 'Yes'] },
  { feature: 'Support', cells: ['AI Chat', 'Email', 'Email + Call', 'Account manager'] },
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
                      {/* A zero-width space lets "Products/Commerce" wrap after the slash in the phone column. */}
                      {r.feature.replace('/', '/​')}
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
