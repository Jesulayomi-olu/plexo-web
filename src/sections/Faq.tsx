'use client'

import { motion } from 'framer-motion'
import { useId, useRef, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { durations, ease, usePreviewMode, useStaticMotion } from '../lib/motion'
import styles from './Faq.module.css'

type FaqItem = { q: string; a: string }

/**
 * Home: Figma "FAQ" (Home page V2 1166:16071; earlier 532:25034) using the component set "Plexo / FAQ
 * Accordion" (238:2338, the instance "FAQ / Main" 1166:16075). The page instance is "Open item=3"; the
 * design team asked for the first question to start open instead. One item open at a time; clicking the open item closes it. The open style
 * comes from the "Open item=N" variants. The heading is desktop/heading/h3, centred (see `.home`).
 * The 14 questions and answers are the copy the design team supplied on 11 Nov 2026 (it replaces the 9 in
 * Figma). The first 7 show at a glance; "See more" (not in Figma) reveals the rest under them.
 */
const homeFaqs: FaqItem[] = [
  // Getting started
  {
    q: 'What can I build with Plexo?',
    a: 'Build websites, landing pages, online stores and email campaigns. Everything you need to create and manage your online presence in one place.',
  },
  {
    q: 'Do I need coding or design experience?',
    a: 'No. Start with Plexo AI, choose a template or build visually with the drag-and-drop editor. You decide how hands-on you want to be.',
  },
  {
    q: 'Can I edit my website after AI builds it?',
    a: 'Absolutely. Open it in the visual editor to change layouts, text, images, colours and more. You stay in control of your design.',
  },
  { q: 'Can I start with a template instead?', a: 'Yes. Choose a ready-made design, customise it to your brand and make it yours.' },
  // AI and integrations
  {
    q: 'Can I use AI tools like Claude and ChatGPT with Plexo?',
    a: 'Yes. Connect compatible AI tools and agents to Plexo through MCP or the SDK to create, edit and publish your pages.',
  },
  {
    q: 'What is MCP?',
    a: 'MCP lets compatible AI tools work directly with Plexo. You can ask your AI assistant to create, update and publish your work without switching your entire workflow.',
  },
  {
    q: 'What are AI credits?',
    a: 'AI credits power website generation and editing with Plexo AI. Each plan comes with a monthly allocation.',
  },
  // Hosting and publishing
  {
    q: 'Does Plexo host my website?',
    a: 'Yes. Build your website, publish it and host it on Plexo. Your site gets a Plexo web address, and you can connect your own domain too.',
  },
  { q: 'Can I use my own domain?', a: 'Yes. Connect a custom domain on any paid plan. SSL is included, so your website stays secure.' },
  {
    q: 'Can I sell products on Plexo?',
    a: 'Yes. Set up your online store, showcase your products and receive orders. Starter supports up to 5 products, while Pro supports up to 25.',
  },
  // Moving and managing your website
  {
    q: "I'm using WordPress. Can I move to Plexo?",
    a: 'Yes. Import your posts, images and categories, then redirect your old links to their new home on Plexo so visitors can still find your content.',
  },
  { q: 'Am I locked into Plexo?', a: 'No. You can export your code anytime and take your website with you.' },
  // Plans and billing
  {
    q: 'What happens when my free trial ends?',
    a: 'Your published pages go offline, but your work stays saved. Upgrade anytime to get your website live again.',
  },
  { q: 'Can I cancel my subscription?', a: "Yes. You can cancel anytime. Plus, you're covered by a 7-day money-back guarantee." },
]

/**
 * Pricing page: Figma "FAQ" (571:11799) using the component set "FAQ Pricing" (613:19248). The page
 * instance is "Open item=7", so the last question starts open. Answers are verbatim from the variants.
 */
const pricingFaqs: FaqItem[] = [
  { q: 'What happens after the trial?', a: 'Your pages go offline. Your work stays saved. Upgrade anytime to go live again.' },
  { q: 'Can I switch plans later?', a: 'Yes. Upgrade or downgrade anytime. We prorate the difference.' },
  { q: 'Do you charge transaction fees?', a: 'Yes, on every paid plan. SSL is on us.' },
  { q: 'Can I pay in Naira?', a: 'Yes.' },
  { q: 'Is yearly billing worth it?', a: 'Yes. You get 2 months free on Starter and Pro.' },
  { q: 'Do you offer discounts?', a: 'Yes' },
  { q: 'How does Enterprise billing work?', a: 'Custom contract, invoice billing and a dedicated contact. Talk to us.' },
]

/**
 * Build with Sol: Figma "FAQ" (616:21365) using "FAQ / Build with Sol" (614:20522). The page instance is
 * "Open item=1", so the first question starts open. Answers are verbatim from the variants (updated 17 Nov
 * 2026), except "SOL" in the last one, written "Sol" as everywhere else on the page.
 */
const solFaqs: FaqItem[] = [
  { q: 'Do I need to be good at writing prompts?', a: 'No. Write like you would text a friend. Sol asks if it needs more.' },
  {
    q: 'Can I edit what Sol makes?',
    a: 'Absolutely. Open it in the visual editor to change layouts, text, images, colours and more. You stay in control of your design.',
  },
  { q: 'Who owns what Sol creates?', a: 'You do. Every page, image and line of copy.' },
  {
    q: 'Does Sol use my content to train AI?',
    a: 'No. Your content is not used to train AI models without your permission. The information you share with Sol, including your prompts, files and project content, is used to provide responses and help you work on your projects.',
  },
]

/**
 * E-commerce: Figma "FAQ" (736:14742) using "Ecommerce FAQ" (923:6372), laid out as Build with Sol's.
 * All three start closed. Answers are the component's (hidden) answer layers, verbatim; the first gets
 * the full stop Figma leaves off.
 */
const ecommerceFaqs: FaqItem[] = [
  { q: 'Do you take a cut of my sales?', a: 'No. You only pay your payment provider.' },
  { q: 'How do I get paid?', a: 'Straight to your account through your payment provider.' },
  { q: 'Can I sell on Instagram too?', a: 'Yes. Share product links anywhere.' },
]

type FaqVariant = 'home' | 'pricing' | 'sol' | 'ecommerce'

type VariantConfig = {
  items: FaqItem[]
  defaultOpen: number | null
  style?: 'pricing' | 'sol'
  /** Questions shown before "See more"; the rest stay folded away under them until it is pressed. */
  visible?: number
}

const variants: Record<FaqVariant, VariantConfig> = {
  home: { items: homeFaqs, defaultOpen: 0, visible: 7 },
  pricing: { items: pricingFaqs, defaultOpen: pricingFaqs.length - 1, style: 'pricing' },
  sol: { items: solFaqs, defaultOpen: 0, style: 'sol' },
  ecommerce: { items: ecommerceFaqs, defaultOpen: null, style: 'sol' },
}

// Plus (closed) / minus (open). Same geometry as the Figma "Plus" icon: 12px bars, 1px thick,
// rounded ends, #333332. Opening collapses the vertical bar so the plus morphs into a minus.
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg className={`${styles.icon} ${open ? styles.iconOpen : ''}`} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="7.5" width="12" height="1" rx="0.5" />
      <rect className={styles.iconBar} x="7.5" y="2" width="1" height="12" rx="0.5" />
    </svg>
  )
}

/* "chevron-up" (191:3635) turned to point down: 16×16, 1px stroke. It turns up once the list is expanded. */
function MoreChevron({ up }: { up: boolean }) {
  return (
    <svg className={`${styles.moreChevron} ${up ? styles.moreChevronUp : ''}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Faq({ variant = 'home' }: { variant?: FaqVariant }) {
  const { items, defaultOpen, style, visible = items.length } = variants[variant]
  const isPreviewMode = usePreviewMode()
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)
  const [expanded, setExpanded] = useState(false)
  const isStatic = useStaticMotion()
  const baseId = useId()
  const moreId = `${baseId}-more`
  const listRef = useRef<HTMLDivElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const folded = items.length > visible

  // "See more" moves focus to the first revealed question; "See less" closes an answer that is folding
  // away and keeps the button in view, since the list shrinks above it.
  const toggleMore = () => {
    if (expanded) {
      if (openIndex !== null && openIndex >= visible) setOpenIndex(null)
      setExpanded(false)
      requestAnimationFrame(() => moreButtonRef.current?.scrollIntoView({ block: 'nearest', behavior: isStatic ? 'auto' : 'smooth' }))
    } else {
      setExpanded(true)
      requestAnimationFrame(() => listRef.current?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-q${visible}`)}`)?.focus())
    }
  }

  const renderItem = (item: FaqItem, i: number) => {
    const open = openIndex === i
    const buttonId = `${baseId}-q${i}`
    const panelId = `${baseId}-a${i}`
    return (
      <Reveal key={item.q} delay={Math.min(i % visible, 8) * 0.04} className={styles.item}>
        <h3 className={styles.heading}>
          <button
            type="button"
            id={buttonId}
            className={styles.trigger}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpenIndex(open ? null : i)}
          >
            <span className={styles.question}>{item.q}</span>
            <ToggleIcon open={open} />
          </button>
        </h3>
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          aria-hidden={!open}
          inert={!open}
          className={styles.panel}
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={
            isStatic ? { duration: 0 } : { height: { duration: durations.base, ease }, opacity: { duration: 0.2, ease } }
          }
        >
          {isPreviewMode && !isStatic ? (
            <motion.p className={styles.answer} initial={false} animate={{ y: open ? 0 : 6 }} transition={{ duration: 0.4, ease }}>
              {item.a}
            </motion.p>
          ) : (
            <p className={styles.answer}>{item.a}</p>
          )}
        </motion.div>
      </Reveal>
    )
  }
  const sectionClass = [
    styles.section,
    style && styles[style],
    variant === 'home' && styles.home,
    variant === 'ecommerce' && styles.ecommerce,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section id="faq" data-section="faq" className={sectionClass} aria-labelledby="faq-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.headCol}>
          <h2 id="faq-title" className={`h2 ${styles.title}`}>
            Frequently Asked Questions
          </h2>
        </Reveal>

        <div ref={listRef} className={styles.list}>
          {items.slice(0, visible).map((item, i) => renderItem(item, i))}
          {folded && (
            // The rest stay in the page (for search and find-in-page) but folded and out of reach until
            // "See more"; they then unfold under the first questions.
            <motion.div
              id={moreId}
              className={styles.more}
              aria-hidden={!expanded}
              inert={!expanded}
              initial={false}
              // Clipped while it folds; once open, focus rings at the rows' edges show in full.
              animate={
                expanded
                  ? { height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }
                  : { height: 0, opacity: 0, overflow: 'hidden' }
              }
              transition={
                isStatic ? { duration: 0 } : { height: { duration: 0.45, ease }, opacity: { duration: expanded ? 0.35 : 0.2, ease } }
              }
            >
              <div className={styles.moreInner}>{items.slice(visible).map((item, i) => renderItem(item, visible + i))}</div>
            </motion.div>
          )}
        </div>

        {folded && (
          <button
            ref={moreButtonRef}
            type="button"
            className={styles.moreButton}
            aria-expanded={expanded}
            aria-controls={moreId}
            onClick={toggleMore}
          >
            {expanded ? 'See less' : 'See more'}
            <MoreChevron up={expanded} />
          </button>
        )}
      </div>
    </section>
  )
}
