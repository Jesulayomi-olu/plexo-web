import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const alt = 'Plexo — What are we building today?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0b0f19',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            color: '#f0f2ff',
            letterSpacing: '-4px',
            lineHeight: 1,
          }}
        >
          Plexo
        </div>
        <div
          style={{
            fontSize: 30,
            color: 'rgba(240,242,255,0.5)',
            marginTop: 28,
            textAlign: 'center',
            maxWidth: 680,
            lineHeight: 1.45,
          }}
        >
          Describe it or drag and drop it. Either way, you get a site that brings in customers.
        </div>
        <div
          style={{
            marginTop: 52,
            background: 'rgba(129,140,248,0.1)',
            border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: 100,
            padding: '12px 36px',
            fontSize: 20,
            color: '#a5b4fc',
            letterSpacing: '0.04em',
          }}
        >
          plexopages.com
        </div>
      </div>
    ),
    { ...size },
  )
}
