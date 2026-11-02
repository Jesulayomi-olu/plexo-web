import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static HTML in out/, served by Cloudflare Workers static assets (see wrangler.toml).
  output: 'export',
  turbopack: {
    rules: {
      // `import icon from './icon.svg?raw'` gives the SVG markup as a string (inlined so it can be restyled).
      '*.svg': [{ condition: { query: '?raw' }, type: 'raw' }],
    },
  },
}

export default nextConfig
