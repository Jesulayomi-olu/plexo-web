import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { useStaticMotion } from '../lib/motion'
import { useMediaQuery } from '../lib/useMediaQuery'
import styles from './Steps.module.css'

/**
 * Figma "How it works" (532:24115): 1440×1049, #f5f7ed, r32 top corners overlapping the lime strip
 * by 24px. Header (heading, lead, "Start building"), then three step cards stacked 86 and 155px apart
 * (step 3 on top), exactly as in "Frame 2147239165".
 *
 * Motion (desktop): the stack pins in the viewport and steps 2 and 3 rise from below into their
 * places as you scroll, ending on the Figma layout; then the page moves on. Phones and tablets get
 * the three cards one after another. Reduced motion and capture mode show the Figma stack.
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
      <img
        className={styles.dialogs}
        src="/assets/v2/step-2-dialogs.webp"
        width={315.63}
        height={281.53}
        alt=""
        loading="lazy"
      />
    ),
  },
  {
    label: '3/3',
    title: 'Publish and sell',
    body: 'Launch your website and give your customers a place to discover your business, explore your offers and buy from you.',
    screen: (
      <img
        className={styles.screenImg}
        src="/assets/v2/step-3-screen.webp"
        width={433}
        height={457}
        alt=""
        loading="lazy"
      />
    ),
  },
]

/** Scroll distance (px) over which each of steps 2 and 3 rises into place. */
const TRAVEL = 520
/** How far below its final place a rising card starts (just under the stack, peeking into view). */
const ENTER = 580

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

/** Desktop: pinned stack; steps 2 and 3 rise into place with scroll. */
function ScrollStack() {
  const trackRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const [range, setRange] = useState({ start: 0, end: 1 })

  // Scroll positions where the stack pins and where step 3 lands.
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const pin = pinRef.current
      if (!track || !pin) return
      const start = track.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(pin).top)
      setRange({ start, end: start + TRAVEL * 2 })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollY } = useScroll()
  const raw = useTransform(scrollY, [range.start, range.end], [0, 1], { clamp: true })
  const progress = useSpring(raw, { stiffness: 220, damping: 36, mass: 0.6 })
  const y2 = useTransform(progress, [0, 0.5], [ENTER, 0])
  const y3 = useTransform(progress, [0.5, 1], [ENTER, 0])

  return (
    <div ref={trackRef} className={styles.track} style={{ height: `calc(642px + ${TRAVEL * 2}px)` }}>
      <div ref={pinRef} className={styles.pin}>
        <StepCard step={steps[0]} index={0} />
        <StepCard step={steps[1]} index={1} y={y2} />
        <StepCard step={steps[2]} index={2} y={y3} />
      </div>
    </div>
  )
}

export default function Steps() {
  const isStatic = useStaticMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')

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

        {desktop && !isStatic ? (
          <ScrollStack />
        ) : (
          <div className={styles.stack}>
            {steps.map((step, i) => (
              <StepCard key={step.label} step={step} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
