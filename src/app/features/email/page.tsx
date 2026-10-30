import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import FeatureHero from '../../../sections/features/FeatureHero'
import { EmailMock } from '../../../sections/features/EmailMock'
import Statement from '../../../sections/features/Statement'
import FeatureCards, { type FeatureCard } from '../../../sections/features/FeatureCards'
import Campaign from '../../../sections/features/Campaign'
import PricingCta from '../../../sections/pricing/PricingCta'
import Footer from '../../../sections/Footer'

export const metadata: Metadata = {
  title: 'Email & Marketing — Plexo',
  description: 'On brand emails, funnels and signup forms, built where your site lives.',
}

const icon = (name: string) => ({ src: `/assets/features/email/${name}.svg` })

// "What You get" (736:14851), in Figma's order.
const cards: FeatureCard[] = [
  { tone: 'lime', title: 'Email designer', body: ['Prompt it or drag it. Looks right in every inbox.'], bodyWidth: 331, icon: icon('mail') },
  { tone: 'grey', title: 'Matching templates', body: ['Your emails match your site,', '\u00a0automatically.'], bodyWidth: 331, icon: icon('layout') },
  { tone: 'lime', title: 'Signup forms', body: ['Grow your list from any page.'], bodyWidth: 331, icon: icon('form') },
  { tone: 'dark', title: 'Waitlists', body: ['Build hype before you launch.'], bodyWidth: 355, icon: icon('checklist') },
  { tone: 'grey', title: 'Sales funnels', body: ['Guide visitors from first click to checkout.'], bodyWidth: 331, icon: icon('funnel') },
  { tone: 'dark', title: 'Countdown pages', body: ['Push limited offers with real urgency.'], bodyWidth: 355, icon: icon('timer') },
]

// Section order follows Figma 736:14779 (named "E commerce" in the file) → "Main"; its hidden pricing frame is left out.
export default function EmailPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <FeatureHero
          id="email-hero"
          title={'Bring them back for more.\u00a0'}
          lead="On brand emails, funnels and signup forms, built where your site lives"
          action={{ label: 'Design an Email', href: '#start', variant: 'secondary' }}
          link={{ label: 'View Templates', href: '/#templates' }}
          note=" Free for 14 days. No card."
          visual={{
            tone: 'white',
            label: 'A summer sale email for the SOLA brand: “Your Summer starts here!”, a discount button and limited-stock picks.',
            content: <EmailMock />,
          }}
        />
        <Statement />
        <FeatureCards variant="email" id="what-you-get" title="What You get" cards={cards} />
        <Campaign />
        <PricingCta title={'Turn one sale into many.\u00a0'} titleBox={494} sub={'Free for 14 days. No card.\u00a0'} />
      </main>
      <Footer />
    </>
  )
}
