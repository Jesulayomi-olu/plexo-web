/**
 * Resources content: the nav menu (Figma 942:6996), the hub's destinations (718:7942), and the sample
 * articles, templates and customer stories from the Figma frames (718:8690, 718:9219, 718:10560,
 * 894:5341). Copy is verbatim from Figma; it is placeholder content until a CMS feeds these pages.
 * Items without an `href` have no page yet and render as plain text.
 */

export type ResourceLink = {
  label: string
  description: string
  href?: string
  /** Opens another site (docs, changelog): Figma marks it with the external-link icon. */
  external?: boolean
}

/** "Dropdown / Resources": two columns, in Figma's order. */
export const resourceMenu: { columns: ResourceLink[][]; all: { label: string; href: string } } = {
  columns: [
    [
      { label: 'Blog', description: 'Ideas to grow your business online.', href: '/resources/blog' },
      { label: 'Templates', description: 'Start from a proven page.', href: '/resources/templates' },
      { label: 'Help center', description: 'Answers in under a minute.' },
    ],
    [
      { label: 'Customer stories', description: 'Real prompts. Real sites.', href: '/resources/customer-stories' },
      { label: 'Changelog', description: 'What is new in Plexo.', external: true },
      { label: 'Developer Docs', description: 'Build with the API and SDK', external: true },
    ],
  ],
  all: { label: 'All resources', href: '/resources' },
}

/** The hub's six destination cards (718:7942). */
export const destinations: (ResourceLink & { icon: { src: string; w: number; h: number; x: number; y: number }; detail: string })[] = [
  {
    label: 'Blog',
    description: 'Ideas to grow your business online.',
    detail: 'SEO articles, how-to guides and launch tips.',
    href: '/resources/blog',
    icon: { src: 'newspaper', w: 22, h: 22, x: 1, y: 1 },
  },
  {
    label: 'Templates',
    description: 'Start from a proven page.',
    detail: 'View templates to start from',
    href: '/resources/templates',
    icon: { src: 'layout-grid', w: 20, h: 20, x: 2, y: 2 },
  },
  {
    label: 'Help center',
    description: 'Answers in under a minute.',
    detail: 'Setup, domains, billing and payments.',
    icon: { src: 'life-buoy', w: 22, h: 22, x: 1, y: 1 },
  },
  {
    label: 'Developer docs',
    description: 'Build with the API and SDK.',
    detail: 'MCP setup, API reference and SDK guides.',
    icon: { src: 'code', w: 24, h: 24, x: 0, y: 0 },
  },
  {
    label: 'Customer stories',
    description: 'Real prompts. Real sites.',
    detail: 'How businesses launched with Plexo.',
    href: '/resources/customer-stories',
    icon: { src: 'message-circle', w: 24, h: 24, x: 0, y: 0 },
  },
  {
    label: 'Changelog',
    description: 'What is new in Plexo.',
    detail: 'Releases and feature updates.',
    icon: { src: 'sparkles', w: 22.0048, h: 22.0048, x: 0.997, y: 0.997 },
  },
]

export type Category = 'small-business' | 'coaches' | 'founders' | 'designers' | 'developers'

export type Article = {
  slug: string
  /** Lines as Figma breaks them (one entry when it wraps on its own). */
  title: string[]
  category: Category
  tag: string
  date: string
  readTime: string
}

/** The Blog's articles (718:9105), in Figma's order. */
export const articles: Article[] = [
  {
    slug: 'how-to-stop-losing-sales-in-your-instagram-dms',
    title: ['How to stop losing sales in your Instagram DMs'],
    category: 'small-business',
    tag: 'Small Businesses',
    date: 'Oct 15, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'website-or-link-in-bio',
    title: ['Website or link in bio: what your business actually needs'],
    category: 'small-business',
    tag: 'Small Businesses',
    date: 'Oct 15, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-take-payments-online-in-nigeria',
    title: ['How to take payments online ', 'in Nigeria'],
    category: 'small-business',
    tag: 'Small Businesses',
    date: 'Oct 15, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-build-a-sales-funnel-for-your-coaching-program',
    title: ['How to build a sales funnel for your coaching program'],
    category: 'coaches',
    tag: 'Coaches',
    date: 'Oct 15, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'lead-magnets-that-work-10-ideas-for-coaches',
    title: ['Lead magnets that work: 10 ideas for coaches'],
    category: 'coaches',
    tag: 'Coaches',
    date: 'Oct 15, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'how-to-validate-a-startup-idea-with-one-landing-page',
    title: ['How to validate a startup idea with one landing page'],
    category: 'founders',
    tag: 'Founders',
    date: 'Oct 15, 2026',
    readTime: '5 min read',
  },
]

/** The Blog's featured article (718:9072): the first article, with Figma's own date, length and excerpt. */
export const featuredArticle = {
  slug: articles[0].slug,
  title: ['How to stop losing sales in ', 'your Instagram DMs'],
  tag: 'Small businesses',
  excerpt:
    'Every unanswered DM is a customer who gave up. Here is how to move orders, payments and questions to a page that sells while you sleep.',
  date: 'Oct 22, 2026',
  readTime: '3 min read',
}

export const blogCategories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'small-business', label: 'Small businesses' },
  { id: 'coaches', label: 'Coaches' },
  { id: 'founders', label: 'Founders' },
  { id: 'designers', label: 'Designers' },
  { id: 'developers', label: 'Developers' },
]

/** The article page (894:5341): byline, and Figma's placeholder body in five paragraphs. */
export const articleByline = { name: 'Maxwell,', role: 'Sales Lead' }

export const articleBody = [
  'Forem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.',
  'Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac posuere leo.',
  'Nam pulvinar blandit velit, id condimentum diam faucibus at. Aliquam lacus nisi, sollicitudin at nisi nec, fermentum congue felis. Quisque mauris dolor, fringilla sed tincidunt ac, finibus non odio. Sed vitae mauris nec ante pretium finibus. Donec nisl neque, pharetra ac elit eu, faucibus aliquam ligula. Nullam dictum, tellus tincidunt tempor laoreet, nibh elit sollicitudin felis, eget feugiat sapien diam nec nisl. Aenean gravida turpis nisi, consequat dictum risus dapibus a. Duis felis ante, varius in neque eu, tempor suscipit sem. Maecenas ullamcorper gravida sem sit amet cursus. Etiam pulvinar purus vitae justo pharetra consequat. Mauris id mi ut arcu feugiat maximus. Mauris consequat tellus id tempus aliquet.',
  'Vestibulum dictum ultrices elit a luctus. Sed in ante ut leo congue posuere at sit amet ligula. Pellentesque eget augue nec nisl sodales blandit sed et sem. Aenean quis finibus arcu, in hendrerit purus. Praesent ac aliquet lorem. Morbi feugiat aliquam ligula, et vestibulum ligula hendrerit vitae. Sed ex lorem, pulvinar sed auctor sit amet, molestie a nibh. Ut euismod nisl arcu, sed placerat nulla volutpat aliquet. Ut id convallis nisl. Ut mauris leo, lacinia sed elit id, sagittis rhoncus odio. Pellentesque sapien libero, lobortis a placerat et, malesuada sit amet dui. Nam sem sapien, congue eu rutrum nec, pellentesque eget ligula.',
  'Nunc tempor interdum ex, sed cursus nunc egestas aliquet. Pellentesque interdum vulputate elementum. Donec erat diam, pharetra nec enim ut, bibendum pretium tellus. Vestibulum et turpis nibh. Cras vel ornare velit, ac pretium arcu. Cras justo augue, finibus id sollicitudin et, rutrum eget metus. Suspendisse ut mauris eu massa pulvinar sollicitudin vel sed enim. Pellentesque viverra arcu et dignissim vehicula. Donec a velit ac dolor dapibus pellentesque sit amet at erat. Phasellus porttitor, justo eu ultrices vulputate, nisi mi placerat lectus, sed rutrum tellus est id urna. Aliquam pellentesque odio metus, sit amet imperdiet nisl sodales eu. Quisque viverra nunc nec vestibulum dapibus. Integer nec diam a libero tincidunt varius sed vel odio. Donec rutrum dapibus massa, vel tempor nulla porta id. Suspendisse vulputate fermentum sem sollicitudin facilisis. Aliquam vehicula sapien nec ante auctor, quis mollis leo tincidunt.',
]

/** "Discover More Stories" (942:7530) lists these, in this order; the article being read is left out. */
export const relatedOrder = [
  'how-to-stop-losing-sales-in-your-instagram-dms',
  'how-to-build-a-sales-funnel-for-your-coaching-program',
  'lead-magnets-that-work-10-ideas-for-coaches',
]

export type Audience = 'small-business' | 'coaches' | 'agencies' | 'growing-brands' | 'product-teams'

export const audiences: { id: Audience; label: string; chip: string }[] = [
  { id: 'small-business', label: 'Small businesses', chip: 'Small businesses' },
  { id: 'coaches', label: 'Coaches and creators', chip: 'Coaches and creators' },
  { id: 'agencies', label: 'Agencies and freelancers', chip: 'Agencies' },
  { id: 'growing-brands', label: 'Growing brands', chip: 'Growing brands' },
  { id: 'product-teams', label: 'Product teams', chip: 'Product teams' },
]

/** A site screenshot: its file, intrinsic size and Figma's crop (shown from the top, at the slot's width). */
export type Shot = { src: string; w: number; h: number }

const shots = {
  glow: { src: '/assets/resources/site-glow-by-amy.webp', w: 603, h: 801 },
  iron: { src: '/assets/resources/site-iron-and-grain.webp', w: 607, h: 801 },
  atelier: { src: '/assets/resources/site-atelier.webp', w: 592, h: 799 },
  // The home page's Northfold template is the same picture as Figma's "Agency" at a higher resolution.
  agency: { src: '/assets/v2/template-northfold.webp', w: 1110, h: 936 },
} satisfies Record<string, Shot>

export type TemplateKind = 'email' | 'landing'

export type Template = { id: string; name: string; tag: string; kind: TemplateKind; audience: Audience; shot: Shot }

/** The Templates gallery (892:4965), in Figma's order (it repeats "Agency" three times). */
export const templates: Template[] = [
  { id: 'glow-by-amy', name: 'Glow by Amy', tag: 'Store', kind: 'landing', audience: 'small-business', shot: shots.glow },
  { id: 'iron-and-grain', name: 'Iron & Grain', tag: 'Coach', kind: 'landing', audience: 'coaches', shot: shots.iron },
  { id: 'atelier', name: 'Atelier', tag: 'Studio', kind: 'landing', audience: 'agencies', shot: shots.atelier },
  { id: 'agency-1', name: 'Agency', tag: 'Agency', kind: 'landing', audience: 'agencies', shot: shots.agency },
  { id: 'agency-2', name: 'Agency', tag: 'Agency', kind: 'landing', audience: 'agencies', shot: shots.agency },
  { id: 'agency-3', name: 'Agency', tag: 'Agency', kind: 'landing', audience: 'agencies', shot: shots.agency },
]

export const templateKinds: { id: TemplateKind; label: string }[] = [
  { id: 'email', label: 'Email Design' },
  { id: 'landing', label: 'Landing Page' },
]

export type Story = {
  id: string
  quote: string
  name: string
  role: string
  audience: Audience
  shot: Shot
}

/** Customer stories (718:11100). The avatars are one placeholder photo in Figma. */
export const featuredStory = {
  tag: 'Small Businesses',
  quote: '“I stopped taking orders in my DMs. Customers now shop and pay on my own site.”',
  prompt: 'Online store for my skincare brand. Warm, natural, simple.',
  name: 'Amy Okafor',
  role: 'Founder, Glow by Amy',
  shot: shots.glow,
}

export const stories: Story[] = [
  {
    id: 'daniel-reyes',
    quote: '“I typed what I needed and had a booking page live before my next class.”',
    name: 'Daniel Reyes',
    role: 'Coach, Iron & Grain',
    audience: 'coaches',
    shot: shots.iron,
  },
  {
    id: 'tolu-bello',
    quote: '“We hand clients a site they can actually update themselves.”',
    name: 'Tolu Bello',
    role: 'Founder, Northfold Studio',
    audience: 'agencies',
    shot: shots.agency,
  },
  {
    id: 'noa-lind',
    quote: '“Our portfolio finally looks like our buildings. Enquiries doubled.”',
    name: 'Noa Lind',
    role: 'Partner, Atelier',
    audience: 'growing-brands',
    shot: shots.atelier,
  },
]

export const AVATAR = '/assets/resources/avatar-placeholder.webp'
