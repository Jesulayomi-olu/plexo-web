import { BlurIn } from '../components/BlurIn'
import { Divider } from '../components/Divider'
import { PromptBox } from '../components/PromptBox'
import { Reveal } from '../components/Reveal'
import { isPreviewMode } from '../lib/motion'
import styles from './Hero.module.css'

/**
 * Figma "Hero section" (532:23982): 1440×807, #0d1a03, clipped.
 * "Hero content" (1280 wide at x 80) carries dashed left/right guide lines; a blurred #194211 ellipse
 * glows up from below; dashed dividers with star ornaments run along the top and at y 745.
 * Hidden in Figma and not rendered: the tabs row "Frame 42" and the badge sparkle.
 */

/*
 * Entrance (seconds after page load), Linear-style: the eyebrow, heading and subtitle each sharpen
 * from a soft blur into focus in turn, then the prompt box fades up. Plays once.
 */
const ENTRANCE = {
  eyebrow: 0.45,
  heading: 0.65,
  subtitle: 1.05,
  prompt: 1.3,
} as const

/** Typewriter prompts for the hero prompt box (preview). */
const HERO_PROMPTS = [
  'A store for my skincare brand...',
  'A sales funnel for my coaching program...',
  'A landing page for my product launch...',
] as const

export default function Hero() {
  return (
    <section id="top" data-section="top" className={styles.hero}>
      <Divider className={styles.dividerTop} />
      <div className={styles.frame}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.content}>
          <div className={styles.copy}>
            <BlurIn className={styles.badgeWrap} delay={ENTRANCE.eyebrow} blur={10} duration={1.3}>
              <span className={styles.badge}>
                <span className={styles.newTag}>New</span>
                <span className={styles.badgeText}>Plexo now works inside Claude and ChatGPT</span>
              </span>
            </BlurIn>
            <BlurIn as="h1" className={styles.title} delay={ENTRANCE.heading} blur={16} duration={1.9}>
              {/* Figma's first line ends in a space, which counts when the line is centred. */}
              {'From idea to website \nin minutes.'}
            </BlurIn>
            <BlurIn as="p" className={styles.subtitle} delay={ENTRANCE.subtitle} blur={8} duration={1.4}>
              {'Everything you need to build your website, launch your store and attract customers.\n All in one place. No code. No experience needed.'}
            </BlurIn>
          </div>
          <Reveal delay={ENTRANCE.prompt} className={styles.promptWrap}>
            <PromptBox
              variant="hero"
              typingPrompts={isPreviewMode ? HERO_PROMPTS : undefined}
              typingDelay={(ENTRANCE.prompt + 0.9) * 1000}
            />
          </Reveal>
        </div>
      </div>
      <Divider className={styles.dividerBottom} />
    </section>
  )
}
