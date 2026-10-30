import { BlurIn } from '../../components/BlurIn'
import { Reveal } from '../../components/Reveal'
import styles from './ResourcesHero.module.css'

/**
 * Resources hub "Pricing Hero" (718:7928): 1440×476 under the nav, r40 top corners (the nav's colour
 * shows behind them), #1d3509 with the fine line pattern under a 20% black wash. Centred 136 from the
 * top: "Learn. Build. Grow." (600 40/46, white) and its line (16/24, #fcfcfa) in a 136-tall block,
 * then 40 below the 640-wide search field. Searching opens the Blog filtered by the words.
 */
export default function ResourcesHero() {
  return (
    <section id="top" data-section="resources-hero" className={styles.section} aria-labelledby="resources-title">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <BlurIn as="h1" blur={14} duration={1.4} className={styles.title}>
            <span id="resources-title">Learn. Build. Grow.</span>
          </BlurIn>
          <BlurIn as="p" delay={0.15} blur={8} duration={1.2} className={styles.lead}>
            Guides, templates and stories to help you sell more online.
          </BlurIn>
        </div>
        <Reveal delay={0.3} className={styles.searchSlot}>
          {/* The label is the visible box, so a click anywhere on it (icon or padding) focuses the field. */}
          <form action="/resources/blog" method="get" role="search">
            <label className={styles.search}>
              <span className={styles.searchIcon} aria-hidden="true">
                <img src="/assets/resources/search-20.svg" width={16.6667} height={16.6667} alt="" />
              </span>
              <span className="visually-hidden">Search guides, help articles and docs</span>
              <input
                id="resources-search"
                type="search"
                name="q"
                placeholder="Search guides, help articles and docs"
                autoComplete="off"
                className={styles.input}
              />
            </label>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
