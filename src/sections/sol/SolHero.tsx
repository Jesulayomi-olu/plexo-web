'use client'

import type { CSSProperties } from 'react'
import { BlurIn } from '../../components/BlurIn'
import { PromptBox } from '../../components/PromptBox'
import { Reveal } from '../../components/Reveal'
import { useFitScale } from '../../lib/useFitScale'
import { SolWindow } from './SolWindow'
import styles from './SolHero.module.css'

/**
 * Build with Sol "Hero" (576:15969): white, padding 80. A 1275×552 card (#f5f7ed, r40, clipped) with the
 * lime-line photo ("image 19", turned −90°) behind: the light panel on the left (722×496, 1px #74a418,
 * r40 — heading, lead, the prompt box) and the Sol workspace at (768.5, 43), cut by the card's edge.
 * At 1200 and wider the card keeps its design proportions and scales to the column (as the AI panel);
 * below that the panel and the window stack, the window scaled to fit.
 */
const PROMPT = 'A portfolio site for an architecture studio, minimal and bold...'

export default function SolHero() {
  const { ref: fitRef, scale } = useFitScale<HTMLDivElement>(1275)
  const { ref: windowRef, scale: windowScale } = useFitScale<HTMLDivElement>(727, 0)

  return (
    <section id="top" data-section="sol-hero" className={styles.hero} aria-labelledby="sol-hero-title">
      <div className="container">
        <div ref={fitRef} className={styles.fit} style={{ '--s': scale } as CSSProperties}>
          <div className={styles.card}>
            <img src="/assets/sol/hero-lines.webp" width={1600} height={1200} alt="" className={styles.lines} fetchPriority="high" />

            <div className={styles.panel}>
              <div className={styles.copy}>
                <BlurIn as="h1" blur={14} duration={1.4} className={styles.title}>
                  {/* Figma ends both lines (and the lead's first) with a space, which counts when centring. */}
                  <span id="sol-hero-title">
                    Type it.&nbsp;
                    <br />
                    Sol builds it.&nbsp;
                  </span>
                </BlurIn>
                <BlurIn as="p" delay={0.15} blur={8} duration={1.2} className={styles.lead}>
                  Describe your business in plain words.&nbsp;
                  <br />
                  Get a live site with copy, images and checkout.
                </BlurIn>
              </div>
              <Reveal delay={0.4} y={16} className={styles.promptSlot}>
                <PromptBox variant="panel" placeholder={PROMPT} typingPrompts={[PROMPT]} typingDelay={1100} />
              </Reveal>
            </div>

            <div ref={windowRef} className={styles.windowSlot} style={{ '--w': windowScale } as CSSProperties}>
              {/* The entrance moves the wrapper; the scale sits on its own element so the two don't share one transform. */}
              <Reveal delay={0.3} y={20}>
                <div className={styles.windowScale}>
                  <SolWindow />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
