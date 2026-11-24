import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The audience pages moved from "For you" to "Solutions"; old links keep working.
  // The audience pages moved from /for-you/* to /solutions/*. A static export ignores this; on Cloudflare
  // public/_redirects does the same.
  async redirects() {
    return [{ source: '/for-you/:audience', destination: '/solutions/:audience', permanent: true }]
  },
  turbopack: {
    rules: {
      // `import icon from './icon.svg?raw'` gives the SVG markup as a string (inlined so it can be restyled).
      '*.svg': [{ condition: { query: '?raw' }, type: 'raw' }],
    },
  },
}

export default nextConfig
