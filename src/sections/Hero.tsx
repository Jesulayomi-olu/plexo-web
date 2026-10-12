import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BlurIn } from '../components/BlurIn'
import { PromptBox } from '../components/PromptBox'
import { Reveal } from '../components/Reveal'
import { ease, isPreviewMode, useStaticMotion } from '../lib/motion'
import styles from './Hero.module.css'

/**
 * Figma "Herosection" (234:674): 1440×1270, #f5f7ed, padding 100/80.
 * Hidden in Figma and therefore not rendered: tabs row "Frame 42", "Frame 9", the badge sparkle.
 */

/* Icon / bag (234:849), stroke #517a12 1.5. */
function BagIcon() {
  return (
    <svg className={styles.bag} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5.25001 6.66661H14.75C15.152 6.66207 15.542 6.80294 15.8483 7.06327C16.1545 7.3236 16.3564 7.68586 16.4167 8.08328L17.4167 15.5833C17.4521 15.8153 17.438 16.0522 17.3755 16.2784C17.313 16.5046 17.2035 16.715 17.054 16.896C16.9045 17.0769 16.7185 17.2243 16.5082 17.3283C16.2978 17.4324 16.0679 17.4909 15.8333 17.4999H4.16668C3.92509 17.5027 3.68579 17.4529 3.46537 17.3539C3.24495 17.255 3.04867 17.1093 2.89013 16.927C2.73159 16.7447 2.61459 16.5301 2.54723 16.2981C2.47987 16.066 2.46376 15.8221 2.50001 15.5833L3.58335 8.08328C3.64362 7.68586 3.84549 7.3236 4.15176 7.06327C4.45803 6.80294 4.84807 6.66207 5.25001 6.66661Z"
        stroke="#517A12"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9.16667V5C7.5 4.33696 7.76339 3.70107 8.23223 3.23223C8.70107 2.76339 9.33696 2.5 10 2.5C10.663 2.5 11.2989 2.76339 11.7678 3.23223C12.2366 3.70107 12.5 4.33696 12.5 5V9.16667"
        stroke="#517A12"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* Icon / bolt (234:855), stroke #74a418 1.35. */
function BoltIcon() {
  return (
    <svg className={styles.bolt} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9.75 2.25V7.5H14.25L8.25 15.75V10.5H3.75L9.75 2.25Z"
        stroke="#74A418"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/*
 * Lime blobs "Vector 2" (234:726) and "Vector 4" (234:727): 1886×543, #b8f34a fill + 3.57 stroke,
 * LAYER_BLUR 95 → Gaussian blur σ 47.5 (paths exported from Figma; Vector 4 is pre-rotated).
 * Static, exactly as designed.
 */
const BLOB_PATHS = {
  top: 'M985.931 184.377C700.627 78.3495 0 13.1698 0 13.1698L1883.04 0L1886 487.282L1555.88 543C1430.04 359.636 1271.23 290.404 985.931 184.377Z',
  bottom: 'M900.069 358.623C1185.37 464.65 1886 529.83 1886 529.83L2.96082 543L0 55.7183L330.124 0C455.956 183.364 614.765 252.596 900.069 358.623Z',
} as const

function Blob({ variant }: { variant: keyof typeof BLOB_PATHS }) {
  const filterId = `hero-blob-${variant}`
  return (
    <svg
      className={`${styles.blob} ${variant === 'top' ? styles.blobTop : styles.blobBottom}`}
      viewBox="0 0 1886 543"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          id={filterId}
          x="-150"
          y="-150"
          width="2186"
          height="843"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="47.5" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <path d={BLOB_PATHS[variant]} fill="#B8F34A" stroke="#B8F34A" strokeWidth="3.57427" />
      </g>
    </svg>
  )
}

/*
 * Hero entrance (seconds after page load), Linear-style: the eyebrow, heading and subtitle each
 * sharpen from a soft blur into focus in turn, then the prompt fades up. The mockup rises into place
 * once it is a quarter on screen: after the heading when that happens on load, almost immediately when
 * it is scrolled into view later. The badges pop in one after another as it lands. Plays once.
 */
const ENTRANCE = {
  eyebrow: 0.45,
  heading: 0.65,
  subtitle: 1.05,
  prompt: 1.3,
  mockupOnLoad: 1.45,
  mockupOnScroll: 0.15,
  rise: 100,
  riseDuration: 1.2,
  /** Badge pop-ins, relative to the start of the mockup rise. */
  cards: [0.75, 0.9, 1.05],
} as const

const RISE_EASE = [0.2, 0.65, 0.3, 1] as const

/** Typewriter prompts for the hero prompt box (preview). */
const HERO_PROMPTS = [
  'A store for my skincare brand...',
  'A sales funnel for my coaching program...',
  'A landing page for my product launch...',
] as const

type FloatCardProps = {
  className: string
  icon: ReactNode
  children: ReactNode
  /** When the badge pops in, in seconds after page load. */
  enter: number
  /** Extra offset for the float loop, in seconds, so the badges don't drift in unison. */
  delay: number
}

/* "Card / …": white, 1px #e8e8e4 inside stroke, r16, padding 12 16 12 14, gap 10, shadow 0 8 24 #000/8%. */
function FloatCard({ className, icon, children, enter, delay, entered }: FloatCardProps & { entered: boolean }) {
  const isStatic = useStaticMotion()
  return (
    <motion.div
      className={`${styles.cardSlot} ${className}`}
      initial={isStatic ? false : { opacity: 0, y: 12, scale: 0.96 }}
      animate={entered ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.5, ease, delay: enter }}
    >
      <motion.div
        className={styles.card}
        animate={isStatic || !entered ? undefined : { y: [0, -5, 0] }}
        transition={isStatic ? undefined : { duration: 6, ease: 'easeInOut', repeat: Infinity, delay: enter + 0.5 + delay }}
      >
        {icon}
        <span className={styles.cardText}>{children}</span>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const isStatic = useStaticMotion()
  // The mockup rise starts when it is a quarter on screen; on load it waits for the heading first.
  const mountedAt = useRef(0)
  const [riseDelay, setRiseDelay] = useState<number | null>(null)
  useEffect(() => {
    mountedAt.current = performance.now()
  }, [])
  const onMockupEnter = () => {
    if (riseDelay !== null) return
    const onLoad = performance.now() - mountedAt.current < 500
    setRiseDelay(onLoad ? ENTRANCE.mockupOnLoad : ENTRANCE.mockupOnScroll)
  }
  const entered = isStatic || riseDelay !== null
  const rise = riseDelay ?? 0

  return (
    <section id="top" data-section="top" className={styles.hero}>
      <div className={styles.inner}>
        {/* "Frame 15": column, gap 32, 888 wide, centred. */}
        <div className={styles.intro}>
          {/* "Frame 14": column, gap 8. */}
          <div className={styles.headingGroup}>
            <BlurIn className={styles.badgeWrap} delay={ENTRANCE.eyebrow} blur={10} duration={1.3}>
              <p className={styles.badge}>
                <span className={styles.badgeTag}>New</span>
                <span className={styles.badgeText}>Plexo now works inside Claude and ChatGPT</span>
              </p>
            </BlurIn>
            {/* "Frame 13": column, gap 24. */}
            <div className={styles.titleGroup}>
              <BlurIn as="h1" className={styles.title} delay={ENTRANCE.heading} blur={16} duration={1.9}>
                What are we building today?
              </BlurIn>
              <BlurIn as="p" className={styles.subtitle} delay={ENTRANCE.subtitle} blur={8} duration={1.4}>
                Describe it or drag and drop it. Either way, you get a site that brings in customers.
              </BlurIn>
            </div>
          </div>
          <Reveal delay={ENTRANCE.prompt} className={styles.promptWrap}>
            <PromptBox
              typingPrompts={isPreviewMode ? HERO_PROMPTS : undefined}
              typingDelay={(ENTRANCE.prompt + 0.9) * 1000}
            />
          </Reveal>
        </div>

        {/* "Frame 2147239049": 1280×627, r40, #f4f5f0, clipped. All inner geometry scales with the column. */}
        <motion.div
          className={styles.mockupWrap}
          viewport={{ once: true, amount: 0.25 }}
          onViewportEnter={isStatic ? undefined : onMockupEnter}
          initial={isStatic ? false : { opacity: 0, y: ENTRANCE.rise, scale: 0.97 }}
          animate={entered ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{
            delay: rise,
            y: { duration: ENTRANCE.riseDuration, ease: RISE_EASE, delay: rise },
            scale: { duration: ENTRANCE.riseDuration, ease: RISE_EASE, delay: rise },
            opacity: { duration: 0.3, ease: 'easeOut', delay: rise },
          }}
        >
          <div className={styles.mockup}>
            <Blob variant="top" />
            <Blob variant="bottom" />
            <div className={styles.browser}>
              <img
                src="/assets/hero-browser.webp"
                width={1042}
                height={775}
                alt="A finished Plexo store, “Glow by Amy”, with a skincare hero banner and a best sellers grid."
                className={styles.browserImg}
                fetchPriority="high"
              />
            </div>
            <div className={styles.overlay} aria-hidden="true" />
            <FloatCard
              className={styles.cardDomain}
              enter={rise + ENTRANCE.cards[0]}
              entered={entered}
              delay={0}
              icon={
                <span className={styles.iconTile}>
                  <BagIcon />
                </span>
              }
            >
              Your Domain, Your Customers
            </FloatCard>
            <FloatCard className={styles.cardLive} enter={rise + ENTRANCE.cards[2]} entered={entered} delay={1.4} icon={<BoltIcon />}>
              {'Live  in  minutes'}
            </FloatCard>
            <FloatCard
              className={styles.cardTools}
              enter={rise + ENTRANCE.cards[1]}
              entered={entered}
              delay={2.6}
              icon={
                <span className={styles.iconTile}>
                  <BagIcon />
                </span>
              }
            >
              One tool instead of five
            </FloatCard>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
