import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Reveal } from '../components/Reveal'
import { focusEase, isPreviewMode, useStaticMotion } from '../lib/motion'
import styles from './Footer.module.css'

/**
 * Figma "Footer" (234:2094): 1440×482 clipped frame; the page ends at its bottom edge.
 * The three link columns repeat the same placeholder links, exactly as in the design.
 */
const columnLinks = [
  { label: 'Products', href: '#products' },
  { label: 'Developers', href: '#developers' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Pricing', href: '#pricing' },
] as const

const COLUMN_COUNT = 3

export default function Footer() {
  const isStatic = useStaticMotion()
  const wordmarkRef = useRef<HTMLDivElement>(null)
  const wordmarkInView = useInView(wordmarkRef, { once: true, amount: 0.6 })
  return (
    <footer id="footer" data-section="footer" className={styles.footer}>
      <div className={styles.frame}>
        <div className={styles.row}>
          <Reveal className={styles.brand}>
            <p className={styles.logo}>Plexo</p>
            <p className={styles.tagline}>Plexo. Say it. Ship it</p>
          </Reveal>
          <nav className={styles.columns} aria-label="Footer">
            {Array.from({ length: COLUMN_COUNT }, (_, index) => (
              <Reveal key={index} delay={0.06 * (index + 1)} className={styles.column}>
                <a href="#top" className={styles.heading}>
                  Home
                </a>
                <ul className={styles.list}>
                  {columnLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={styles.link}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </nav>
        </div>
        <div ref={wordmarkRef} className={styles.wordmark} aria-hidden="true">
          {isPreviewMode && !isStatic ? (
            <motion.span
              className={styles.wordmarkText}
              initial={{ y: '55%', filter: 'blur(10px)', opacity: 0 }}
              animate={
                wordmarkInView ? { y: '0%', filter: 'blur(0px)', opacity: 0.5, transitionEnd: { filter: 'none' } } : undefined
              }
              transition={{ duration: 1.4, ease: focusEase, delay: 0.1 }}
            >
              Plexo
            </motion.span>
          ) : (
            <span className={styles.wordmarkText}>Plexo</span>
          )}
        </div>
      </div>
    </footer>
  )
}
