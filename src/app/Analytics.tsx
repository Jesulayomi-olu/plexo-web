import Script from 'next/script'
import { GA_MEASUREMENT_ID } from '../lib/site'

// Google Analytics 4. Production builds only, so `next dev` traffic isn't counted.
// Client-side navigations are tracked by GA's enhanced measurement ("page changes based on browser history events").
export default function Analytics() {
  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  )
}
