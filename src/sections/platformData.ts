/** Figma "Platform" (241:4025) feature cards: copy, icon, accent and position on the 1440 canvas. */
export type Feature = {
  title: string
  body: string
  icon: string
  /** "Icon accent" tile colour. */
  accent: string
  /** Card position and hug width at 1440. */
  x: number
  y: number
  w: number
  /** Blog's frame doesn't include its stroke in layout (content at 16,8 instead of 17,9). */
  flush?: boolean
}

// Listed in reading order; positions place them around the heading.
export const features: Feature[] = [
  { title: 'Websites', body: 'Look credible from the first click.', icon: 'platform-globe-code', accent: '#f0eaf9', x: 42, y: 165, w: 219 },
  { title: 'Store', body: 'Sell your products without the back and forth', icon: 'platform-store', accent: '#f9eaf3', x: 383, y: 27, w: 288 },
  { title: 'Emails', body: 'Keep customers coming back, on brand.', icon: 'platform-mail', accent: '#f9eaf3', x: 812, y: 27, w: 263 },
  { title: 'Blog', body: 'Get found on Google. SEO built in.', icon: 'platform-blocks', accent: '#eaf4e7', x: 1193, y: 165, w: 226, flush: true },
  { title: 'Funnels', body: 'Turn visitors into leads and buyers.', icon: 'platform-funnel', accent: '#f0eaf9', x: 42, y: 471, w: 225 },
  { title: 'Export', body: 'Your work, yours forever. Take it anywhere.', icon: 'platform-download', accent: '#f6f1dc', x: 1149, y: 471, w: 270 },
  { title: 'WordPress import', body: 'Switch in minutes. Keep your rankings.', icon: 'platform-import', accent: '#eaf4e7', x: 276, y: 654, w: 248 },
  { title: 'Hosting', body: 'Fast for every customer. 99.9% uptime.', icon: 'platform-server', accent: '#e7f1f8', x: 976, y: 654, w: 254 },
  { title: 'Your domain', body: 'Your brand, your address. SSL included.', icon: 'platform-globe', accent: '#e7f1f8', x: 591, y: 767, w: 257 },
]
