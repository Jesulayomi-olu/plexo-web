import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import styles from './Audiences.module.css'

/**
 * Figma "Who it's for" (1166:15365): 1440×2886, white, padding 80. The heading block "Frame 32"
 * (1166:15366, 888 wide, centred), then four 1280-wide audience cards 80 apart:
 * - Small businesses (1166:15372): #0d1a03, padding 40/24, 555 tall, photo right.
 * - Coaches and creators (1166:15490): #dff5ad, padding 48/29, 565 tall, photo left, 67 gap.
 * - Designers and Agencies (1166:15603): #0d1a03, padding 48/29, photo right; copy fills the rest
 *   (42 side padding).
 * - Developers (1166:15721): #dff5ad, padding 20/29, photo left.
 * Each card (r24): a 565 copy column, centred vertically (title and subtitle, 48, then "With Plexo, you
 * can:", the check list and a CTA), and the 483×507 white photo frame (r16, 1px #d7d8d3, padding 24)
 * holding the 433×457 "Screen" with the photo. Per-card spacing is in the CSS.
 * The frames' hidden dialog and label layers aren't rendered.
 * Photos are Figma's crops of each picture inside the Screen, exported at 2×.
 */
type Audience = {
  id: string
  tone: 'dark' | 'light'
  /** Figma puts the photo on the left of the light cards. */
  photoLeft: boolean
  title: string
  subtitle: string
  listLabel: string
  items: string[]
  cta: string
  href: string
  /** Fixed button width when Figma's button doesn't hug its label. */
  ctaWidth?: number
  photo: string
}

const AUDIENCES: Audience[] = [
  {
    id: 'small-business',
    tone: 'dark',
    photoLeft: false,
    title: 'Small businesses',
    subtitle: 'Get found, win customers and keep them coming back.',
    listLabel: 'With Plexo, you can:',
    items: [
      'Build a professional business website.',
      'Create landing pages for products and promotions.',
      'Send email campaigns to reach existing and potential customers.',
      'Accept payments through online checkout.',
    ],
    cta: 'Get your business online',
    href: '/solutions/small-business',
    photo: '/assets/v3/audiences/small-business.webp',
  },
  {
    id: 'coaches',
    tone: 'light',
    photoLeft: true,
    title: 'Coaches and creators',
    subtitle: 'Turn what you know into something people can buy.',
    listLabel: 'With Plexo, you can:',
    items: [
      'Create pages for your services and digital products.',
      'Collect email subscribers and enquiries.',
      'Send newsletters, promotions and updates.',
      'Set up checkout so customers can buy from you.',
    ],
    cta: 'Bring your ideas to life',
    href: '/solutions/coaches',
    photo: '/assets/v3/audiences/coaches.webp',
  },
  {
    id: 'designers',
    tone: 'dark',
    photoLeft: false,
    title: 'Designers and Agencies',
    subtitle: 'Build great websites. Get them live without the extra work.',
    listLabel: 'With Plexo, you can:',
    items: [
      'Build with a visual editor or your own code.',
      'Start projects from templates.',
      'Publish websites and connect custom domains.',
      'Give clients a simpler way to manage their online presence.',
    ],
    cta: 'Start creating',
    href: '/solutions/designers',
    ctaWidth: 162,
    photo: '/assets/v3/audiences/designers.webp',
  },
  {
    id: 'developers',
    tone: 'light',
    photoLeft: true,
    title: 'Developers',
    subtitle: 'Connect Claude Code, Codex or your own AI agent to Plexo.',
    listLabel: 'Everything you need to build with Plexo:',
    items: [
      'SDK: Embed a full page and email builder directly into your React app.',
      'API: Create, manage and publish pages and emails programmatically.',
      'MCP Server: Connect Claude Code, Codex and other AI agents to Plexo.',
      'Code Export: Export generated code and host it on your own infrastructure.',
    ],
    cta: 'Bring your ideas to life',
    href: '/solutions/developers',
    photo: '/assets/v3/audiences/developers.webp',
  },
]

/* "SealCheck" (14×14): #d7d8d3 on the dark cards, #454543 on the light ones. */
const CHECK = {
  dark: '/assets/v3/audiences/seal-check-light.svg',
  light: '/assets/v3/audiences/seal-check-dark.svg',
} as const

const TITLE = 'Built for people who have something to sell, share or grow.\u00a0'
const LEAD =
  'Whether you’re building a business, growing an audience, launching a product or creating websites for clients, Plexo gives you a place to bring your online work together.\u00a0'

export default function Audiences() {
  return (
    <section id="who-its-for" data-section="who-its-for" className={styles.section} aria-labelledby="who-its-for-title">
      <div className="container">
        <Reveal as="header" className={styles.header}>
          <h2 id="who-its-for-title" className={styles.title}>
            {/* Figma's texts end in a space, which counts when the last line is centred (a no-break space keeps it). */}
            {TITLE}
          </h2>
          <p className={styles.lead}>{LEAD}</p>
        </Reveal>

        <ul className={styles.cards}>
          {AUDIENCES.map((audience) => (
            <Reveal
              as="li"
              key={audience.id}
              className={[styles.card, styles[audience.tone], styles[audience.id], audience.photoLeft && styles.photoLeft]
                .filter(Boolean)
                .join(' ')}
            >
              <div className={styles.copy}>
                <div className={styles.intro}>
                  <h3 className={styles.cardTitle}>{audience.title}</h3>
                  <p className={styles.subtitle}>{audience.subtitle}</p>
                </div>
                <div className={styles.details}>
                  <p className={styles.listLabel}>{audience.listLabel}</p>
                  <ul className={styles.list}>
                    {audience.items.map((item) => (
                      <li key={item} className={styles.item}>
                        <img src={CHECK[audience.tone]} width={14} height={14} alt="" className={styles.check} />
                        <span className={styles.itemText}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <span className={styles.ctaWrap} style={audience.ctaWidth ? { width: audience.ctaWidth } : undefined}>
                    <Button
                      href={audience.href}
                      variant={audience.tone === 'dark' ? 'primary' : 'secondary'}
                      fullWidth={Boolean(audience.ctaWidth)}
                    >
                      {audience.cta}
                    </Button>
                  </span>
                </div>
              </div>
              <div className={styles.frame}>
                <div className={styles.screen}>
                  <img src={audience.photo} width={866} height={914} alt="" loading="lazy" className={styles.photo} />
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
