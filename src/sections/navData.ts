/**
 * Nav menu content, shared by the desktop dropdowns (Figma 565:2852, 565:2838 and its three siblings)
 * and the mobile menu (555:2757, 555:2816). "Solution" items open their solution page (/solutions/…);
 * feature items open their product page.
 */
export type NavItem = { label: string; href: string }

/** "Developers" in the bar: the For Developers solution page (Figma 1042:19374). */
export const DEVELOPERS_HREF = '/solutions/developers'

/** "Log in" (nav bar, footer): the Welcome Back screen (Figma 1048:21566). */
export const LOGIN_HREF = '/login'

/** "Start free" and the site's other sign-up buttons: the Create Account screen (Figma 1296:8209). */
export const SIGNUP_HREF = '/signup'
export type AudienceItem = NavItem & { photo: string }

export const featureItems: NavItem[] = [
  { label: 'Build with Sol', href: '/features/sol' },
  { label: 'Design with a Drag', href: '/features/drag' },
  { label: 'MCP and API', href: '/features/mcp' },
  { label: 'Email & Marketing', href: '/features/email' },
  { label: 'E-commerce', href: '/features/ecommerce' },
]

/** "Solution" (formerly "For you"): each item has its own photo, shown while the item is hovered or focused. */
export const audienceItems: AudienceItem[] = [
  { label: 'Founders', href: '/solutions/founders', photo: '/assets/v2/nav/for-you-founders.webp' },
  { label: 'Coaches', href: '/solutions/coaches', photo: '/assets/v2/nav/for-you-coaches.webp' },
  { label: 'Designers', href: '/solutions/designers', photo: '/assets/v2/nav/for-you-designers.webp' },
  { label: 'Small Business', href: '/solutions/small-business', photo: '/assets/v2/nav/for-you-small-business.webp' },
]
