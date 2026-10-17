import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Divider } from '../components/Divider'
import { Reveal } from '../components/Reveal'
import { focusEase, isPreviewMode, useStaticMotion } from '../lib/motion'
import styles from './Footer.module.css'

/**
 * Figma "Footer" (532:25055): 1440×584, white, bottom corners r32, clipped — logo + tagline, four link
 * columns, and the giant Plexo logo cut by the bottom edge. Below it the page's #0d1a03 band (248px)
 * with the dashed star divider (532:25133) and a soft green glow ("Ellipse 3", 532:25172).
 * Link labels are verbatim from Figma.
 */
const columns = [
  {
    title: 'Home',
    links: [
      { label: 'Pricing', href: '#pricing' },
      { label: 'Features', href: '#features' },
      { label: 'For you', href: '#for-you' },
      { label: 'Resources', href: '#developers' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Small Business', href: '#for-you' },
      { label: 'Product teams', href: '#for-you' },
      { label: 'Founders', href: '#for-you' },
      { label: 'Coaches', href: '#for-you' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Developers Hub', href: '#developers' },
      { label: 'SDK Reference', href: '#developers' },
      { label: 'MCP Setup Guide', href: '#mcp' },
      { label: 'API &Webhooks', href: '#developers' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#developers' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Blog', href: '#top' },
    ],
  },
] as const

export default function Footer() {
  const isStatic = useStaticMotion()
  const logoRef = useRef<HTMLDivElement>(null)
  const logoInView = useInView(logoRef, { once: true, amount: 0.6 })
  // Preview: the giant logo rises out of the footer's bottom edge while coming into focus.
  const rise = isPreviewMode && !isStatic

  return (
    <footer id="footer" data-section="footer" className={styles.footer}>
      <div className={styles.card}>
        <div className={styles.content}>
          <Reveal className={styles.brand}>
            <img src="/assets/v2/icons/logo-footer.svg" width={116} height={30} alt="Plexo" />
            <p className={styles.tagline}>Plexo. Say it. Ship it</p>
          </Reveal>
          <nav className={styles.columns} aria-label="Footer">
            {columns.map((col, i) => (
              <Reveal key={col.title} delay={0.06 * (i + 1)} className={styles.column}>
                <p className={styles.heading}>{col.title}</p>
                <ul className={styles.list}>
                  {col.links.map((link) => (
                    <li key={link.label}>
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
        <div ref={logoRef} className={styles.giant} aria-hidden="true">
          {rise ? (
            <motion.img
              src="/assets/v2/icons/logo-giant.svg"
              width={843}
              height={219}
              alt=""
              initial={{ y: '40%', filter: 'blur(10px)', opacity: 0 }}
              animate={logoInView ? { y: '0%', filter: 'blur(0px)', opacity: 1, transitionEnd: { filter: 'none' } } : undefined}
              transition={{ duration: 1.4, ease: focusEase, delay: 0.1 }}
            />
          ) : (
            <img src="/assets/v2/icons/logo-giant.svg" width={843} height={219} alt="" />
          )}
        </div>
      </div>
      <div className={styles.band} aria-hidden="true">
        <Divider className={styles.divider} />
        {/* Page-level in Figma and drawn last: its wide blur also hazes the card's bottom edge. */}
        <div className={styles.glow} />
      </div>
    </footer>
  )
}
