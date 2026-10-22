import type { Plan } from '../Pricing'

/**
 * Content for the For You page (Figma "For Founders" 571:12846, "FOr coaches" 571:13665,
 * "For Small businesses" 571:14526, "For Designers" 571:8810). The four frames share one layout:
 * hero · solutions · made for your work · recommended plan · social proof · final CTA. Copy is
 * verbatim from Figma except where a comment says otherwise.
 */
export type Tier = 'Starter' | 'Pro' | 'Enterprise'
type PlanOverride = Partial<Pick<Plan, 'badge' | 'tagline' | 'features'>>

export type AudienceId = 'founders' | 'coaches' | 'small-business' | 'designers'

export type Audience = {
  id: AudienceId
  /** Page title and nav label. */
  name: string
  hero: {
    tag: string
    title: string
    lead: string
    /** Prompt-box placeholder (it types itself out on load). */
    prompt: string
    photo: string
    /** Where the photo's focal point sits, as Figma crops it into the 1280×446 frame. */
    focus: string
    /** Founders only: a 24% #1d3509 wash over the photo. */
    tint?: boolean
  }
  problems: string[]
  fixes: string[]
  /** "Made for your work": five page types, each with the matching icon (work-1 … work-5). */
  work: { title: string; body: string }[]
  /** "Recommended plan": which cards show (Pro and Enterprise unless set) and this page's changes to them. */
  pricing: { tiers?: Tier[]; overrides: Partial<Record<Tier, PlanOverride>> }
  cta: { title: string; sub: string }
}

const proFeatures = ['15 pages', '5 funnels', '25 products', 'No badge', 'MCP', '1,500 credits/mo']
/** The Pro card's tagline on the pricing page (Designers keeps it). */
const proTagline = 'Grow without limits.'
const defaultSub = 'Start free today. Go live when you are ready'

// Founders and Coaches still carry placeholder problem / fix lines in Figma.
const placeholderProblems = Array(3).fill('Engineers are busy shipping the product')
const placeholderFixes = Array(3).fill('Anyone on the team can ship pages')

const founderWork = [
  { title: 'Launch Page', body: 'Tell the world what you are building.' },
  { title: 'Waitlist', body: 'Prove demand before you build.' },
  { title: 'Pricing page', body: 'Test plans before you code billing.' },
  { title: 'Investor update page', body: 'Share progress with one clean link.' },
  { title: 'Changelog and blog', body: 'Show momentum and get found on Google.' },
]

export const audiences: Audience[] = [
  {
    id: 'founders',
    name: 'Founders',
    hero: {
      tag: 'For Founders',
      title: 'Launch before the meeting ends',
      lead: 'Test ideas, grow a waitlist and look funded from day one.',
      prompt: 'A launch page for my fintech app with a waitlist...',
      photo: '/assets/for-you/hero-founders.webp',
      focus: '50% 61%',
      tint: true,
    },
    problems: placeholderProblems,
    fixes: placeholderFixes,
    work: founderWork,
    pricing: {
      overrides: {
        Pro: {
          badge: 'For most Founders',
          tagline: 'For most Founders',
          features: ['15 pages', '5 funnels', '25 products', 'No badge', 'MCP so you can ship from Claude or Cursor', '1,500 credits/mo'],
        },
      },
    },
    cta: { title: 'Your next launch starts here.', sub: defaultSub },
  },
  {
    id: 'coaches',
    name: 'Coaches',
    hero: {
      tag: 'For coaches and creators',
      title: 'Launch offers, grow your list and fill your programs from one page',
      lead: 'A sales funnel for my 8 week fitness coaching program...',
      // Figma reuses the Founders prompt here; the coaching line under the title reads as the prompt.
      prompt: 'A sales funnel for my 8 week fitness coaching program...',
      photo: '/assets/for-you/hero-coaches.webp',
      focus: '35% 40%',
    },
    problems: placeholderProblems,
    fixes: placeholderFixes,
    // Figma repeats the Founders list on this page.
    work: founderWork,
    pricing: {
      overrides: {
        Pro: {
          // Figma: "For most Founders" (copied from the Founders page).
          badge: 'For most coaches',
          tagline: 'cover a full launch, plus emails to match',
          features: proFeatures,
        },
      },
    },
    cta: { title: 'Your next cohort is waiting.', sub: defaultSub },
  },
  {
    id: 'small-business',
    name: 'Small Business',
    hero: {
      tag: 'For small businesses',
      title: 'Turn followers into paying customers.',
      lead: 'Stop taking orders in DMs. Give buyers a proper place to shop and pay.',
      prompt: 'A store for my bakery in Lekki with cake orders..',
      photo: '/assets/for-you/hero-small-business.webp',
      focus: '50% 28%',
    },
    problems: ['Orders lost in DMs', '"Price please" on every post', 'A link in bio looks small', 'No time to learn tech'],
    fixes: [
      'Every order saved in one place',
      'Prices on every product page',
      'Your own domain looks established',
      'If you can type it, Plexo builds it',
    ],
    work: [
      { title: 'Online store', body: 'Sell your products day and night.' },
      { title: 'Order form', body: 'Take custom orders the easy way.' },
      { title: 'Business website', body: 'Look credible from the first click.' },
      { title: 'Promo page', body: 'Run sales and holiday specials.' },
      { title: 'Blog', body: 'Get found when people search Google.' },
    ],
    // Three cards here; the Pro card has no badge.
    pricing: {
      tiers: ['Starter', 'Pro', 'Enterprise'],
      overrides: {
        Starter: { tagline: 'To get online fast.\nMove to Pro when you pass 5 products.' },
        Pro: { badge: null },
      },
    },
    cta: { title: 'Your store could be live today.', sub: defaultSub },
  },
  {
    id: 'designers',
    name: 'Designers',
    hero: {
      // Figma: "For small businesses" (copied from the Small Business page).
      tag: 'For designers',
      title: 'Design it. Ship it. Hand it over.',
      lead: 'Build client sites in days, then hand over a login they can actually use.',
      prompt: 'A portfolio site for an architecture studio, minimal and bold...',
      photo: '/assets/for-you/hero-designers.webp',
      focus: '50% 92%',
    },
    // Figma's first line, "Orders lost in DMs", is left over from the Small Business page.
    problems: ['Orders lost in DMs', 'Rebuilding the same sections each project', 'Dev handoff slows every launch', 'Juggling client logins everywhere'],
    fixes: [
      'A login clients can actually use',
      'Reusable templates and blocks',
      'What you design is what goes live',
      'Every client site in one dashboard',
    ],
    work: [
      { title: 'Client websites', body: 'Pixel level control on a visual canvas.' },
      { title: 'Reusable templates', body: 'Build once, reuse across clients.' },
      { title: 'Brand tokens', body: 'Lock fonts and colours per client.' },
      { title: 'Clean code export', body: 'HTML and React when a client needs it.' },
      { title: 'White label', body: 'Your brand on the editor, not ours. Enterprise.' },
    ],
    // Same layout as Founders and Coaches; badge wording not checked against Figma.
    pricing: { overrides: { Pro: { badge: 'For most designers', tagline: proTagline, features: proFeatures } } },
    cta: { title: 'Your next client site starts here.', sub: 'Free for 14 days. No card.' },
  },
]

export const audienceById = (id: string) => audiences.find((a) => a.id === id)

export const audienceHref = (id: AudienceId) => `/for-you/${id}`
