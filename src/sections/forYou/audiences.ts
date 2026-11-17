import type { Plan } from '../Pricing'
import type { WorkIcon } from './MadeForWork'

/**
 * Content for the solution pages, /solutions/… (Figma "For Founders" 571:12846, "FOr coaches" 571:13665,
 * "For Small businesses" 571:14526, "For Designers" 571:8810; they were the "For you" pages). The four
 * frames share one layout: hero · solutions · made for your work · recommended plan · stories · final
 * CTA. Copy is verbatim from Figma (as updated in November 2026) except where a comment says otherwise;
 * as the design team asked, every sentence ends in a full stop, so the lines Figma leaves without one
 * have it added.
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
    /** A "\n" in the lead is Figma's line break (kept from tablet width up). */
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
  /** "Made for your work": five page types, each with its own icon. A "\n" in a body is Figma's line break. */
  work: { title: string; body: string; icon: WorkIcon }[]
  /** "Recommended plan": which cards show (Pro and Enterprise unless set) and this page's changes to them. */
  pricing: { tiers?: Tier[]; overrides: Partial<Record<Tier, PlanOverride>> }
  cta: { title: string; sub: string }
  /** Spacing that differs between the four frames: heading-to-rows in "Made for your work". */
  layout?: { workGap?: number }
}

const proFeatures = ['15 pages', '5 funnels', '25 products', 'No badge', 'MCP', '1,500 credits/mo']
const defaultSub = 'Start free today. Go live when you are ready.'

export const audiences: Audience[] = [
  {
    id: 'founders',
    name: 'Founders',
    hero: {
      tag: 'For Founders',
      title: 'Launch before the meeting ends.',
      lead: 'Test ideas, grow your waitlist and get your business in front of\npeople before the product is even finished.',
      prompt: 'A launch page for my fintech app with a waitlist...',
      photo: '/assets/for-you/hero-founders.webp',
      crop: [-134, -360, 1549, 1033],
      focus: '50% 61%',
      tint: true,
    },
    problems: [
      'Engineers are busy shipping the product.',
      'Ideas die waiting for a landing page.',
      'Your website looks like a side project.',
      "You're paying for five different marketing tools.",
    ],
    fixes: [
      'Anyone on your team can create and publish pages.',
      'Test a new idea and launch a page the same afternoon.',
      'Create polished, on-brand pages from day one.',
      'Bring your website, waitlists, emails and blog together in one place.',
    ],
    work: [
      {
        title: 'Launch Page',
        body: "Tell the world what you're building.\nGive your idea a home and a reason for people to pay attention.",
        icon: 'rocket',
      },
      {
        title: 'Waitlist',
        body: "Start collecting signups and find out if people want what you're building before launch.",
        icon: 'list-clock',
      },
      {
        title: 'Pricing page',
        body: 'Test your pricing, explore different plans and see what customers are willing to pay before building your billing system.',
        icon: 'tag',
      },
      {
        title: 'Investor update page',
        body: 'Share milestones, traction and company progress through one clear, professional link.',
        icon: 'file-chart-line',
      },
      {
        title: 'Changelog and blog',
        body: 'Share product updates, tell your story and publish content that helps people discover your business.',
        icon: 'newspaper',
      },
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
    layout: { workGap: 80 },
  },
  {
    id: 'coaches',
    name: 'Coaches',
    hero: {
      tag: 'For coaches and creators',
      title: 'Sell your expertise while you sleep.',
      lead: 'Launch offers, grow your email list and fill your programs with pages,\nfunnels and payments in one place.',
      prompt:
        'A launch page for my coaching program with program details, a waitlist and a way for people to book a discovery call.',
      photo: '/assets/for-you/hero-coaches.webp',
      crop: [-62, -208, 1455, 970],
      focus: '35% 40%',
    },
    problems: [
      'Clients find you on Instagram, then vanish.',
      'Collecting payments means chasing bank transfers.',
      "You're juggling five different tools.",
      'Launches take weeks to set up.',
    ],
    fixes: [
      'Give interested followers a page where they can take the next step.',
      'Accept payments directly through your offer page.',
      'Bring your pages, funnels, emails and payments together.',
      'Build and launch your funnel in an afternoon.',
    ],
    work: [
      {
        title: 'Offer page',
        body: 'Showcase your coaching program, explain what clients get and give them a way to sign up and pay.',
        icon: 'tag',
      },
      {
        title: 'Lead magnet',
        body: 'Offer a free guide, resource or download in exchange for an email address. Grow your list while sharing your expertise.',
        icon: 'magnet',
      },
      {
        title: 'Sales funnel',
        body: 'Guide potential customers from discovering your content to becoming paying clients.',
        icon: 'funnel',
      },
      {
        title: 'Booking form',
        body: 'Make it easy for potential clients to book a discovery call or consultation with you.',
        icon: 'calendar-check',
      },
      {
        title: 'Course or ebook checkout',
        body: 'Sell your digital products and let customers pay directly through your website.',
        icon: 'credit-card',
      },
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
    cta: { title: 'Your next cohort is waiting.', sub: "Start building for free. Publish when you're ready." },
    layout: { workGap: 80 },
  },
  {
    id: 'small-business',
    name: 'Small Business',
    hero: {
      tag: 'For small businesses',
      title: 'Turn followers into paying customers.',
      lead: 'Stop taking orders in DMs. Give your customers a proper place to\nbrowse your products, place orders and pay.',
      prompt: 'A store for my bakery in Lekki with cake options, custom orders and online checkout.',
      photo: '/assets/for-you/hero-small-business.webp',
      crop: [-138, -167, 1555, 1037],
      focus: '50% 28%',
    },
    problems: [
      'Orders lost in DMs.',
      '"Price please" on every post.',
      "Your link-in-bio page doesn't feel like a real store.",
      "You don't have time to figure out technology.",
    ],
    fixes: [
      'Every order is saved and organised in one place.',
      'Display prices on every product page.',
      'Give your business its own website and domain.',
      'Describe what you need. Let Plexo build it.',
    ],
    work: [
      {
        title: 'Online store',
        body: 'Showcase your products, display prices and let customers place orders and pay online.',
        icon: 'store',
      },
      {
        title: 'Order form',
        body: 'Collect custom orders and the details you need without going back and forth in messages.',
        icon: 'clipboard-list',
      },
      {
        title: 'Business website',
        body: 'Give your business a professional online presence that customers can find and trust.',
        icon: 'globe',
      },
      {
        title: 'Promo page',
        body: 'Create dedicated pages for sales, seasonal offers and special promotions.',
        icon: 'megaphone',
      },
      {
        title: 'Blog',
        body: 'Share useful content about your business and products, and help customers discover you through search engines.',
        icon: 'newspaper',
      },
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
      tag: 'For Designers & Agencies',
      title: 'Design it. Ship it. Hand it over.',
      lead: 'Build client websites in days, then hand over a login they can actually use. Create, publish and\nmanage client projects without the usual back-and-forth.',
      prompt:
        'A portfolio website for an architecture studio. Minimal, bold typography, clean layouts and a gallery of completed projects.',
      photo: '/assets/for-you/hero-designers.webp',
      crop: [-96, -490, 1472, 981],
      focus: '50% 92%',
    },
    problems: [
      'Clients depend on you for every small change.',
      'Rebuilding the same sections each project.',
      'Dev handoff slows every launch.',
      'Juggling client logins everywhere.',
    ],
    fixes: [
      'Give clients their own login to manage their websites.',
      'Reuse templates and blocks across client projects.',
      'What you design is what goes live.',
      'Manage all your client websites from one dashboard.',
    ],
    work: [
      {
        title: 'Client websites',
        body: 'Design and customise client websites with control over every detail on a visual canvas.',
        icon: 'layout-panel-top',
      },
      {
        title: 'Reusable templates',
        body: 'Build your favourite layouts once and reuse them across multiple client projects.',
        icon: 'layout-template',
      },
      {
        title: 'Brand tokens',
        body: 'Set fonts, colours and design styles for each client to keep their websites consistent.',
        icon: 'palette',
      },
      {
        title: 'Clean code export',
        body: 'Export clean HTML and React code when clients need to host or continue development elsewhere.',
        icon: 'code-xml',
      },
      {
        title: 'White label',
        body: 'Put your own brand on the editor and give clients a branded experience. Available on Enterprise.',
        icon: 'badge-check',
      },
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

export const audienceHref = (id: AudienceId) => `/solutions/${id}`
