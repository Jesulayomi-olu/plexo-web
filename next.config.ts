import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The audience pages moved from "For you" to "Solutions"; old links keep working.
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
