'use client'

import { motion, useInView } from 'framer-motion'
import { useId, useRef, type FormEvent } from 'react'
import { Divider } from '../components/Divider'
import { EmailField } from '../components/EmailField'
import { Reveal } from '../components/Reveal'
import { focusEase, usePreviewMode, useStaticMotion } from '../lib/motion'
import styles from './Footer.module.css'

/**
 * Figma "Footer" (814:5666): white, bottom corners r32, clipped. A 1280 column 60 from the top: the
 * brand (logo, tagline, "Get product updates" email field) and five link columns, then the legal bar
 * (copyright, policies, social links). The giant Plexo logo is cut by the bottom edge. Below it the
 * page's #0d1a03 band (248px) with the dashed star divider (532:25133) and a soft green glow
 * ("Ellipse 3", 532:25172).
 * Labels are verbatim from Figma. Items without an `href` have no page yet and render as plain text.
 */
type FooterLink = { label: string; href?: string; /** "Log in": semibold, green. */ accent?: boolean }

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Features', href: '/#features' },
      { label: 'Templates', href: '/resources/templates' },
      { label: 'What’s new' },
      { label: 'Log in', accent: true },
    ],
  },
  {
    // The same five audiences as the home page's "Plexo is for everyone" tabs.
    title: 'Solutions',
    links: [
      { label: 'Small businesses', href: '/for-you/small-business' },
      { label: 'Coaches and creators', href: '/for-you/coaches' },
      { label: 'Agencies and freelancers', href: '/for-you/designers' },
      { label: 'Growing brands', href: '/#for-you' },
      { label: 'Product teams', href: '/#for-you' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Developer docs', href: '/#developers' },
      { label: 'MCP setup', href: '/#mcp' },
      { label: 'API reference', href: '/#developers' },
      { label: 'SDK guides', href: '/#developers' },
      { label: 'API status' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/resources/blog' },
      { label: 'Help center' },
      { label: 'Customer stories', href: '/resources/customer-stories' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Contact support' },
    ],
  },
  {
    title: 'Company',
    links: [{ label: 'About' }, { label: 'Careers' }, { label: 'Partners' }, { label: 'Contact us' }],
  },
]

const legal: FooterLink[] = [{ label: 'Privacy policy' }, { label: 'Terms of service' }, { label: 'Cookie policy' }]

const socials: (FooterLink & { icon: string })[] = [
  { label: 'LinkedIn', icon: '/assets/footer/linkedin.svg' },
  { label: 'Instagram', icon: '/assets/footer/instagram.svg' },
  { label: 'X', icon: '/assets/footer/x.svg' },
]

function TextLink({ link, className }: { link: FooterLink; className: string }) {
  return link.href ? (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  ) : (
    <span className={className}>{link.label}</span>
  )
}

/** "Newsletter": label, then the 320×50 field (mail icon, email input, Secondary "Subscribe"). */
function Newsletter() {
  const inputId = useId()
  // No mailing list is connected yet: the browser checks the address and the form stops there.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault()

  return (
    <form className={styles.newsletter} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className={styles.newsletterLabel}>
        Get product updates
      </label>
      <EmailField id={inputId} />
    </form>
  )
}

export default function Footer() {
  const isPreviewMode = usePreviewMode()
  const isStatic = useStaticMotion()
  const logoRef = useRef<HTMLDivElement>(null)
  const logoInView = useInView(logoRef, { once: true, amount: 0.6 })
  // Preview: the giant logo rises out of the footer's bottom edge while coming into focus.
  const rise = isPreviewMode && !isStatic

  return (
    <footer id="footer" data-section="footer" className={styles.footer}>
      <div className={styles.card}>
        <div className={`container ${styles.content}`}>
          <div className={styles.top}>
            <Reveal className={styles.brand}>
              <div className={styles.identity}>
                <img src="/assets/v2/icons/logo-footer.svg" width={116} height={30} alt="Plexo" className={styles.logo} />
                <p className={styles.tagline}>Plexo. Say it. Ship it.</p>
              </div>
              <Newsletter />
            </Reveal>
            <nav className={styles.columns} aria-label="Footer">
              {columns.map((col, i) => (
                <Reveal key={col.title} delay={0.06 * (i + 1)} className={styles.column}>
                  <p className={styles.heading}>{col.title}</p>
                  <ul className={styles.list}>
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <TextLink link={link} className={link.accent ? `${styles.link} ${styles.accent}` : styles.link} />
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </nav>
          </div>

          <Reveal delay={0.1} className={styles.legalBar}>
            <div className={styles.legal}>
              <p>© 2026 Plexo by Charisol. All rights reserved.</p>
              {legal.map((link) => (
                <TextLink key={link.label} link={link} className={styles.legalLink} />
              ))}
            </div>
            <ul className={styles.socials} aria-label="Plexo on social media">
              {socials.map((social) => (
                <li key={social.label}>
                  {social.href ? (
                    <a href={social.href} className={styles.social} aria-label={social.label}>
                      <img src={social.icon} width={18} height={18} alt="" />
                    </a>
                  ) : (
                    <span className={styles.social}>
                      <img src={social.icon} width={18} height={18} alt={social.label} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
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
