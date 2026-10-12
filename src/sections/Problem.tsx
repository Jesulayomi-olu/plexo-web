import { Reveal } from '../components/Reveal'
import { isPreviewMode, useStaticMotion } from '../lib/motion'
import { ProblemScene } from '../motion/ProblemScene'
import { TypingIndicator } from '../motion/TypingIndicator'
import styles from './Problem.module.css'

/** Figma "Problem" (234:865). Illustrations are the exported "Frame 25" nodes (217×293, clipped by the 189px cards). */
const cards = [
  {
    title: 'Orders lost in DMs.',
    body: 'No proper checkout means buyers give up.',
    img: '/assets/problem-dms.webp',
    scene: 'dms',
    typing: false,
    alt: 'A message inbox with a red “23 unread” badge.',
    wide: false,
  },
  {
    title: 'Looking Small',
    body: "A link in bio doesn't win big clients.",
    img: '/assets/problem-small.webp',
    scene: null,
    typing: true,
    alt: 'A client asks “Do you have a website?” and the owner replies with a sweating emoji.',
    wide: false,
  },
  {
    title: 'Paying for five apps',
    body: 'Site, funnel, email, store, blog. That adds up fast',
    img: '/assets/problem-apps.webp',
    scene: 'apps',
    typing: false,
    alt: 'Five app tiles adding up to $148/mo.',
    wide: true,
  },
  {
    title: 'Broken links lose buyers',
    body: "Your campaign is ready. Your page isn't.",
    img: '/assets/problem-links.webp',
    scene: null,
    typing: false,
    alt: 'A browser window showing a 404 “Page not found” error.',
    wide: true,
  },
] as const

export default function Problem() {
  const isStatic = useStaticMotion()
  // Preview: the DMs and five-apps illustrations are live scenes whose numbers count up, and the
  // "Looking Small" reply bubble shows a running typing indicator.
  const liveScenes = isPreviewMode && !isStatic

  return (
    <section id="problem" data-section="problem" className={styles.problem}>
      <div className="container">
        <div className={styles.header}>
          <Reveal>
            <h2 className={`h2 ${styles.title}`}>Your tools are costing you customers.</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className={styles.lead}>
              Every missing page, slow launch and broken link is a sale going somewhere else.
            </p>
          </Reveal>
        </div>

        <ul className={styles.grid}>
          {cards.map((card, index) => (
            <Reveal as="li" key={card.title} delay={0.12 + index * 0.06} className={styles.cell}>
              <article className={styles.card}>
                {liveScenes && card.scene ? (
                  <ProblemScene kind={card.scene} label={card.alt} className={styles.illustration} />
                ) : (
                  <img
                    src={card.img}
                    width={217}
                    height={293}
                    alt={card.alt}
                    loading="lazy"
                    className={styles.illustration}
                  />
                )}
                {liveScenes && card.typing && <TypingIndicator />}
                <div className={`${styles.text} ${card.wide ? styles.textWide : ''}`}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardBody}>{card.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
