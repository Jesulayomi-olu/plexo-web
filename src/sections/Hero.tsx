import { BlurIn } from '../components/BlurIn'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { SIGNUP_HREF } from './navData'
import { HeroTitle } from './HeroParts'
import { HeroPicture } from './HeroStory'
import styles from './Hero.module.css'

/**
 * Figma "Hero" (1166:14999, Home page V2 1166:14994): 1440×863, white, padding 80 top / 80 sides.
 * "Frame 2147239540" (1193:9967, 1280 wide): column, gap 64, centred.
 * - Copy "Frame 16" (888 wide): the heading (48px, the boxed word typing itself out), 24 · the lead
 *   (572 wide), 32 · "Start free" and "Explore templates" (174×48 each, gap 24).
 * - Picture "Frame 2147239372" (1193:9939, 1280×339, r16): a soft green photo composition with the
 *   "Hero storyboard" (1133:16152) playing on it: prompt → click → thinking → live → the site (HeroStory).
 *   Below 1280 the picture keeps the 1280×339 proportions (at least 254 tall on tablets, 169.5 on phones)
 *   so the story scales with it.
 * Hidden in Figma and not rendered: the tab row "Frame 42" and the older picture "Frame 2147239235".
 */

/*
 * Entrance (seconds after page load), as on the previous hero: the heading and the lead sharpen from a
 * soft blur into focus in turn, then the buttons and the picture fade up. Plays once. A picture below the
 * fold fades up as soon as it is scrolled to, without waiting out its delay.
 */
const ENTRANCE = {
  heading: 0.45,
  lead: 0.85,
  actions: 1.1,
  picture: 1.3,
} as const

/** The words start changing right away: "Business" holds 1.5s from load, then Products, then Services. */
const TYPING_START = 0

export default function Hero() {
  return (
    <section id="top" data-section="top" className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.copy}>
          <BlurIn className={styles.titleWrap} delay={ENTRANCE.heading} blur={16} duration={1.9}>
            <HeroTitle startDelay={TYPING_START} />
          </BlurIn>
          {/* Figma ends the lead with "online sales,"; it reads as a full sentence here. */}
          <BlurIn as="p" className={styles.lead} delay={ENTRANCE.lead} blur={8} duration={1.4}>
            An all-in-one platform to help you build, publish and manage your online presence, from websites and
            landing pages to email campaigns and online sales.
          </BlurIn>
          <Reveal delay={ENTRANCE.actions} className={styles.actions}>
            <Button href={SIGNUP_HREF} className={styles.action}>
              Start free
            </Button>
            <Button href="/resources/templates" variant="outline" className={`${styles.action} ${styles.secondary}`}>
              Explore templates
            </Button>
          </Reveal>
        </div>

        {/* The story waits until the visitor reaches the picture, then starts at once (HeroStory). */}
        <HeroPicture delay={ENTRANCE.picture} className={styles.picture}>
          <img className={styles.backdrop} src="/assets/v3/hero/hero-backdrop.webp" width={1280} height={339} alt="" />
          <p className="visually-hidden">
            Animation: someone asks Plexo to build an online store for a skincare brand, Plexo builds and publishes it, and
            the finished site appears live on a laptop and a phone.
          </p>
        </HeroPicture>
      </div>
    </section>
  )
}
