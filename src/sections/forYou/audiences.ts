import type { Plan } from '../Pricing'
import type { WorkIcon } from './MadeForWork'

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
    /** Desktop: the photo layer's box in the 1280×446 frame, as Figma places it (x, y, width, height). */
    crop: [number, number, number, number]
    /** Smaller screens: where the photo's focal point sits when it is cropped to cover the frame. */
    focus: string
    /** Founders only: a 24% #1d3509 wash over the photo. */
    tint?: boolean
  }
  problems: string[]
  fixes: string[]
  /** "Made for your work": five page types, each with its own icon. */
  work: { title: string; body: string; icon: WorkIcon }[]
  /** "Recommended plan": which cards show (Pro and Enterprise unless set) and this page's changes to them. */
  pricing: { tiers?: Tier[]; overrides: Partial<Record<Tier, PlanOverride>> }
  cta: { title: string; sub: string }
  /** Spacing that differs between the four frames: heading-to-rows in "Made for your work", social proof padding. */
  layout?: { workGap?: number; proofPadding?: number }
}

const proFeatures = ['15 pages', '5 funnels', '25 products', 'No badge', 'MCP', '1,500 credits/mo']
const defaultSub = 'Start free today. Go live when you are ready'

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
      crop: [-134, -360, 1549, 1033],
      focus: '50% 61%',
      tint: true,
    },
    problems: [
      'Engineers are busy shipping the product',
      'Ideas die waiting for a landing page',
      'The site looks like a side project',
      'Paying for five marketing tools',
    ],
    fixes: [
      'Anyone on the team can ship pages',
      'Test a new idea the same afternoon',
      'Polished, on brand pages from day one',
      'Site, waitlist, emails and blog in one',
    ],
    work: [
      { title: 'Launch Page', body: 'Tell the world what you are building.', icon: 'rocket' },
      { title: 'Waitlist', body: 'Prove demand before you build.', icon: 'list-clock' },
      { title: 'Pricing page', body: 'Test plans before you code billing.', icon: 'tag' },
      { title: 'Investor update page', body: 'Share progress with one clean link.', icon: 'file-chart-line' },
      { title: 'Changelog and blog', body: 'Show momentum and get found on Google.', icon: 'newspaper' },
    ],
    pricing: {
      overrides: {
        Pro: {
          badge: 'For most Founders',
          tagline: 'For most Founders',
          // Figma breaks this one after "from".
          features: ['15 pages', '5 funnels', '25 products', 'No badge', 'MCP so you can ship from\nClaude or Cursor', '1,500 credits/mo'],
        },
      },
    },
    cta: { title: 'Your next launch starts here.', sub: defaultSub },
    layout: { workGap: 80, proofPadding: 64 },
  },
  {
    id: 'coaches',
    name: 'Coaches',
    hero: {
      tag: 'For coaches and creators',
      title: 'Sell your expertise while you sleep',
      lead: 'Launch offers, grow your list and fill your programs from one page.',
      // Figma still shows the Founders prompt here.
      prompt: 'A sales funnel for my 8 week fitness coaching program...',
      photo: '/assets/for-you/hero-coaches.webp',
      crop: [-62, -208, 1455, 970],
      focus: '35% 40%',
    },
    problems: [
      'Clients find you on Instagram, then vanish',
      'Taking payment by bank transfer',
      'Gluing together five tools',
      'Launches take weeks to set up',
    ],
    fixes: [
      'A page that turns interest into bookings',
      'Checkout built into your offer page',
      'Page, funnel, emails and payments in one',
      'A full launch funnel in an afternoon',
    ],
    work: [
      { title: 'Offer page', body: 'Explain your program and take payment.', icon: 'tag' },
      { title: 'Lead magnet', body: 'Swap a free guide for an email address.', icon: 'magnet' },
      { title: 'Sales funnel', body: 'Walk people from free value to paid offer.', icon: 'funnel' },
      { title: 'Booking form', body: 'Let clients book a discovery call.', icon: 'calendar-check' },
      { title: 'Course or ebook checkout', body: 'Sell digital products on autopilot.', icon: 'credit-card' },
    ],
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
    layout: { workGap: 80 },
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
      crop: [-138, -167, 1555, 1037],
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
      { title: 'Online store', body: 'Sell your products day and night.', icon: 'store' },
      { title: 'Order form', body: 'Take custom orders the easy way.', icon: 'clipboard-list' },
      { title: 'Business website', body: 'Look credible from the first click.', icon: 'globe' },
      { title: 'Promo page', body: 'Run sales and holiday specials.', icon: 'megaphone' },
      { title: 'Blog', body: 'Get found when people search Google.', icon: 'newspaper' },
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
      crop: [-96, -490, 1472, 981],
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
      { title: 'Client websites', body: 'Pixel level control on a visual canvas.', icon: 'layout-panel-top' },
      { title: 'Reusable templates', body: 'Build once, reuse across clients.', icon: 'layout-template' },
      { title: 'Brand tokens', body: 'Lock fonts and colours per client.', icon: 'palette' },
      { title: 'Clean code export', body: 'HTML and React when a client needs it.', icon: 'code-xml' },
      { title: 'White label', body: 'Your brand on the editor, not ours. Enterprise.', icon: 'badge-check' },
    ],
    pricing: {
      overrides: {
        // Figma badge: "For most Founders" (copied from the Founders page).
        Pro: { badge: 'For most designers', tagline: 'For Freelancers', features: proFeatures },
        Enterprise: { tagline: 'For studios that need white label, seats and multiple client workspaces.' },
      },
    },
    cta: { title: 'Your next client site starts here.', sub: 'Free for 14 days. No card.' },
  },
]

export const audienceById = (id: string) => audiences.find((a) => a.id === id)

export const audienceHref = (id: AudienceId) => `/for-you/${id}`
