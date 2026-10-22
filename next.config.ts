import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // `import icon from './icon.svg?raw'` gives the SVG markup as a string (inlined so it can be restyled).
      '*.svg': [{ condition: { query: '?raw' }, type: 'raw' }],
    },
  },
}

export default nextConfig
