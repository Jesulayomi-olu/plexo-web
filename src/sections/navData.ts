/**
 * Nav menu content, shared by the desktop dropdowns (Figma 565:2852, 565:2838 and its three siblings)
 * and the mobile menu (555:2757, 555:2816). Each item links to the section of this page that covers it
 * until the product pages exist.
 */
export type NavItem = { label: string; href: string }
export type AudienceItem = NavItem & { photo: string }

export const featureItems: NavItem[] = [
  { label: 'Build with Sol', href: '#ai' },
  { label: 'Design with a Drag', href: '#canvas' },
  { label: 'MCP and API', href: '#mcp' },
  { label: 'Email & Marketing', href: '#templates' },
  { label: 'E-commerce', href: '#for-you' },
]

/** "For you": each item has its own photo, shown while the item is hovered or focused. */
export const audienceItems: AudienceItem[] = [
  { label: 'Founders', href: '#for-you', photo: '/assets/v2/nav/for-you-founders.webp' },
  { label: 'Coaches', href: '#for-you', photo: '/assets/v2/nav/for-you-coaches.webp' },
  { label: 'Designers', href: '#for-you', photo: '/assets/v2/nav/for-you-designers.webp' },
  { label: 'Small Business', href: '#for-you', photo: '/assets/v2/nav/for-you-small-business.webp' },
]
