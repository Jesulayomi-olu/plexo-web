import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { isCaptureMode, useStaticMotion } from '../lib/motion'
import { useMediaQuery } from '../lib/useMediaQuery'
import styles from './Steps.module.css'

/**
 * Figma "How it works" (532:24115): 1440×1049, #f5f7ed, r32 top corners overlapping the lime strip
 * by 24px. Header (heading, lead, "Start building"), then three step cards stacked 86 and 155px apart
 * (step 3 on top), exactly as in "Frame 2147239165".
 *
 * Motion (scroll stack, every width): the stack pins in the viewport, scaled down if the window is too
 * short to show it whole. Each card holds fully readable before the next one rises from below to stack
 * on it; the last state is the Figma layout. On phones the cards are a column (step number on top, so
 * it shows in the stack). Reduced motion lists the three cards in full; capture mode shows the Figma stack.
 */
type Step = { label: string; title: string; body: string; screen: ReactNode }

const steps: Step[] = [
  {
    label: '01/3',
    title: 'Start with your idea',
    body: 'Describe what you want to build, choose a template or start with a blank canvas.',
    screen: <img className={styles.screenImg} src="/assets/v2/step-1-screen.webp" width={433} height={457} alt="" />,
  },
  {
    label: '2/3',
    title: 'Make it Yours',
    body: 'Use AI or the visual editor to customise your content, layout and design.',
    screen: (
      <img className={styles.dialogs} src="/assets/v2/step-2-dialogs.webp" width={315.63} height={281.53} alt="" />
    ),
  },
  {
    label: '3/3',
    title: 'Publish and sell',
    body: 'Launch your website and give your customers a place to discover your business, explore your offers and buy from you.',
    screen: <img className={styles.screenImg} src="/assets/v2/step-3-screen.webp" width={433} height={457} alt="" />,
  },
]

/*
 * Scroll choreography, as fractions of the pinned scroll distance: hold on step 1, step 2 rises, hold
 * on step 2, step 3 rises, hold on the finished stack. 3 holds + 2 rises = 1.
 */
const HOLD = 0.14
const RISE = 0.29
/** Pinned scroll distance (px). */
const DISTANCE = { desktop: 1500, mobile: 1300 }
/** Space kept clear under the nav and below the stack while pinned. */
const PIN_MARGIN = 24

function StepCard({ step, index, y }: { step: Step; index: number; y?: MotionValue<number> }) {
  return (
    <motion.article className={`${styles.card} ${styles[`card${index + 1}`]}`} style={y ? { y } : undefined}>
      <div className={styles.screen}>{step.screen}</div>
      <div className={styles.text}>
        <p className={styles.label}>{step.label}</p>
        <div className={styles.copy}>
          <h3 className={styles.title}>{step.title}</h3>
          <p className={styles.body}>{step.body}</p>
        </div>
      </div>
    </motion.article>
  )
}

/** Pinned scroll stack: steps 2 and 3 rise into place in turn, each card readable before the next arrives. */
function ScrollStack({ desktop }: { desktop: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const distance = desktop ? DISTANCE.desktop : DISTANCE.mobile
  const [fit, setFit] = useState({ height: 642, scale: 1, top: 96, start: 0 })

  // Natural stack height → scale to fit the window under the nav → sticky top (centred) → scroll start.
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const inner = innerRef.current
      if (!track || !inner) return
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72
      const height = inner.offsetHeight
      const room = window.innerHeight - nav - PIN_MARGIN * 2
      const scale = Math.min(1, room / height)
      const top = nav + PIN_MARGIN + Math.max(0, (room - height * scale) / 2)
      const start = track.getBoundingClientRect().top + window.scrollY - top
      setFit({ height, scale, top, start })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    if (innerRef.current) observer.observe(innerRef.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollY } = useScroll()
  const raw = useTransform(scrollY, [fit.start, fit.start + distance], [0, 1], { clamp: true })
  const progress = useSpring(raw, { stiffness: 220, damping: 36, mass: 0.6 })
  // Waiting cards sit just below the stack, out of the way of the card being read.
  const enter = fit.height + 40
  const y2 = useTransform(progress, [HOLD, HOLD + RISE], [enter, 0])
  const y3 = useTransform(progress, [HOLD * 2 + RISE, HOLD * 2 + RISE * 2], [enter, 0])

  const pinHeight = fit.height * fit.scale
  return (
    <div ref={trackRef} className={styles.track} style={{ height: pinHeight + distance }}>
      <div className={styles.pin} style={{ top: fit.top, height: pinHeight }}>
        <div ref={innerRef} className={styles.stack} style={{ '--fit': fit.scale } as CSSProperties}>
          <StepCard step={steps[0]} index={0} />
          <StepCard step={steps[1]} index={1} y={y2} />
          <StepCard step={steps[2]} index={2} y={y3} />
        </div>
      </div>
    </div>
  )
}

export default function Steps() {
  const isStatic = useStaticMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')

  let cards: ReactNode
  if (!isStatic) {
    cards = <ScrollStack desktop={desktop} />
  } else if (isCaptureMode && desktop) {
    // Capture mode: the Figma stack, for screenshot comparison.
    cards = (
      <div className={styles.stack}>
        {steps.map((step, i) => (
          <StepCard key={step.label} step={step} index={i} />
        ))}
      </div>
    )
  } else {
    // Reduced motion: every card in full, one after another.
    cards = (
      <div className={styles.list}>
        {steps.map((step, i) => (
          <StepCard key={step.label} step={step} index={i} />
        ))}
      </div>
    )
  }

  return (
    <section id="how" data-section="how" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <Reveal className={styles.headText}>
            <h2 className={`h2 baseline-fix ${styles.heading}`}>Idea to income in three steps.</h2>
            <p className={`baseline-fix ${styles.lead}`}>
              From your first idea to a published website, Plexo gives you everything you need to build, customise and
              launch in one place.
            </p>
          </Reveal>
          <Reveal delay={0.08} className={styles.cta}>
            <Button href="#start">Start building</Button>
          </Reveal>
        </div>
        {cards}
      </div>
    </section>
  )
}
