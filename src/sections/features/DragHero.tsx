'use client'

import { BlurIn } from '../../components/BlurIn'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import styles from './DragHero.module.css'

/**
 * Design with a Drag "Hero" (644:21398): white, padding 80. A 1280 row (space-between, centred): the
 * 408 column ("Drag it / Drop it / Done", 48 with 16 between the lines; the 286-wide lead; the Large
 * "Open the canvas", 196 wide) and the 872×751 panel: the diagonal-line background (#1b3d22, #24512e
 * hairlines) with the dark editor (824×515, exported from Figma at 2×) in its centre.
 */
export default function DragHero() {
  return (
    <section id="top" data-section="drag-hero" className={styles.hero} aria-labelledby="drag-hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <div className={styles.text}>
            <BlurIn as="h1" blur={14} duration={1.4} className={styles.title}>
              {/* Figma's middle line is "Drop  it", with two spaces. */}
              <span id="drag-hero-title" className={styles.lines}>
                <span>Drag it</span>
                <span>{'Drop  it'}</span>
                <span>Done</span>
              </span>
            </BlurIn>
            <BlurIn as="p" delay={0.15} blur={8} duration={1.2} className={styles.lead}>
              A visual canvas where every block lands exactly where you want it&nbsp;
            </BlurIn>
          </div>
          <Reveal delay={0.3}>
            <Button href="#start" size="large" className={styles.cta}>
              Open the canvas
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={20} className={styles.panel}>
          <img
            src="/assets/features/drag/editor-canvas.webp"
            width={824}
            height={515}
            alt="The Plexo editor: the layers panel, a dark SaaS landing page on the canvas and the design settings beside it."
            className={styles.editor}
            fetchPriority="high"
          />
        </Reveal>
      </div>
    </section>
  )
}
