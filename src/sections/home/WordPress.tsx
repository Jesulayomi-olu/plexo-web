import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { SIGNUP_HREF } from '../navData'
import styles from './WordPress.module.css'

/**
 * Figma "Developers" (1166:15834), the WordPress move: 1440×648, #fcfcfa, padding 80. Centred column,
 * gap 64: the heading block (888: heading 40/46 on two lines, 16 · lead 776 wide), the row of three
 * #e8e8e4 cards (r4, padding 38/16, gap 20; the row is 164 tall, the cards 160) and "Get started"
 * (Secondary, 197×40). The cards' hidden check lists, the hidden "Frame" art and the hidden prompt
 * chips below (1166:15927) aren't rendered.
 */
const CARDS = [
  {
    title: 'Move your website without extra tools',
    // Figma breaks the lines by hand (the second line starts with a space).
    text: 'Bring your content to Plexo without dealing\n with plugins, passwords or export files.',
  },
  {
    title: 'Keep your old links working',
    text: 'Every old link redirects to its new home, \nso visitors can still find your website.',
  },
  {
    title: 'Leave website maintenance behind',
    text: 'No more plugin updates, crashes or\n slow hosting to worry about.',
  },
] as const

export default function WordPress() {
  return (
    <section id="wordpress" data-section="wordpress" className={styles.section} aria-labelledby="wordpress-title">
      <div className={`container ${styles.inner}`}>
        <Reveal as="header" className={styles.header}>
          <h2 id="wordpress-title" className={styles.title}>
            {/* Figma's first line ends in a space, which counts when the line is centred. */}
            {'Already on WordPress?\u00a0'}
            <br />
            Bring everything with you.
          </h2>
          <p className={styles.lead}>
            Paste your website address and Plexo moves your posts, images and categories in minutes. Your old links
            redirect to their new home, so your Google traffic doesn&apos;t have to start from scratch.
          </p>
        </Reveal>

        <ul className={styles.cards}>
          {CARDS.map((card, i) => (
            <Reveal as="li" key={card.title} delay={i * 0.08} className={styles.card}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardText}>{card.text}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal className={styles.ctaWrap}>
          <Button href={SIGNUP_HREF} variant="secondary" fullWidth>
            Get started
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
