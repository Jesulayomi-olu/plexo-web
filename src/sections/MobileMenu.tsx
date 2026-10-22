'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../components/Button'
import { durations, ease, useStaticMotion } from '../lib/motion'
import { audienceItems, featureItems, type NavItem } from './navData'
import styles from './MobileMenu.module.css'

/*
 * Figma "Mobile menu · open (Features)" (555:2757) and "(For You)" (555:2816): the menu fills the screen
 * under the 64px bar, #0d1a03. Rows (500 14/21, white, 57 tall) are split by 12% white lines; Features and
 * For You open in place to show their links (400 12/18, white at 80%). "Start free" (Small, full width)
 * sits at the bottom. One submenu is open at a time; both start closed.
 */
type SectionId = 'features' | 'for-you'

/* Lucide "chevron-down" at 20px (stroke 1.67), as in Figma; it turns to point up while open. */
function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Props = { id: string; onNavigate: () => void }

function Submenu({ id, items, open, onNavigate }: { id: string; items: NavItem[]; open: boolean; onNavigate: () => void }) {
  const isStatic = useStaticMotion()
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          className={styles.subWrap}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={isStatic ? { duration: 0 } : { duration: durations.base, ease }}
        >
          <ul className={styles.sub}>
            {items.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={styles.subLink} onClick={onNavigate}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** The menu's contents. It mounts when the menu opens, so the submenus start closed every time. */
export function MobileMenu({ id, onNavigate }: Props) {
  const [section, setSection] = useState<SectionId | null>(null)
  const isStatic = useStaticMotion()
  const toggle = (next: SectionId) => setSection((current) => (current === next ? null : next))

  const groups = [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Features', section: 'features' as const, items: featureItems },
    { label: 'For You', section: 'for-you' as const, items: audienceItems },
    { label: 'Resources', href: '/#developers' },
  ]

  return (
    <motion.div
      id={id}
      className={styles.sheet}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={isStatic ? { duration: 0 } : { duration: durations.fast, ease }}
    >
      <nav aria-label="Mobile">
        <ul className={styles.items}>
          {groups.map((group, index) => (
            <motion.li
              key={group.label}
              className={styles.group}
              initial={isStatic ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={isStatic ? { duration: 0 } : { duration: durations.base, ease, delay: 0.04 + index * 0.04 }}
            >
              {'section' in group && group.section ? (
                <>
                  <button
                    type="button"
                    className={styles.row}
                    aria-expanded={section === group.section}
                    aria-controls={`${id}-${group.section}`}
                    onClick={() => toggle(group.section)}
                  >
                    {group.label}
                    <Chevron />
                  </button>
                  <Submenu
                    id={`${id}-${group.section}`}
                    items={group.items}
                    open={section === group.section}
                    onNavigate={onNavigate}
                  />
                </>
              ) : (
                <a href={group.href} className={styles.row} onClick={onNavigate}>
                  {group.label}
                </a>
              )}
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className={styles.footer}>
        <Button href="/#start" size="small" fullWidth onClick={onNavigate}>
          Start free
        </Button>
      </div>
    </motion.div>
  )
}
