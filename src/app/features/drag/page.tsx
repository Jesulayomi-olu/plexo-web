import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import DragHero from '../../../sections/features/DragHero'
import FeatureCards, { type FeatureCard } from '../../../sections/features/FeatureCards'
import BlockShowcase from '../../../sections/features/BlockShowcase'
import SolSteps, { dragSteps } from '../../../sections/sol/SolSteps'
import PricingCta from '../../../sections/pricing/PricingCta'
import Footer from '../../../sections/Footer'

export const metadata: Metadata = {
  title: 'Design with a Drag — Plexo',
  description:
    'Build and customise your website visually. Move things around, change the details and make every part of your design your own.',
}

const icon = (name: string) => ({ src: `/assets/features/drag/${name}.svg` })

// "Every detail, just how you want it." (657:24799), in Figma's order.
const cards: FeatureCard[] = [
  {
    tone: 'lime',
    title: 'See what goes live',
    body: ['Design your page visually and preview it across desktop and mobile.'],
    bodyWidth: 331,
    icon: icon('live-preview'),
  },
  { tone: 'grey', title: 'Ready-made blocks', body: ['Hero, pricing, forms and checkout. Drop them in.'], bodyWidth: 331, icon: icon('blocks') },
  { tone: 'lime', title: 'Mobile editing', body: ['Tweak the phone view without breaking desktop.'], bodyWidth: 331, icon: icon('mobile') },
  { tone: 'dark', title: 'Brand kit', body: ['Set fonts and colours once. Every page follows.'], bodyWidth: 355, icon: icon('brand') },
  { tone: 'grey', title: 'Templates', body: ['Start from a proven layout, ', 'not a blank page.'], bodyWidth: 331, icon: icon('templates') },
  // Figma has no full stop after "Go back anytime"; added to match the other cards.
  { tone: 'dark', title: 'Undo and history', body: ['Try anything. ', 'Go back anytime.'], bodyWidth: 355, icon: icon('undo') },
]

// Section order follows Figma "Design with a Drag" (644:21396) → "Main"; its hidden frames are left out.
export default function DragPage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <DragHero />
        <FeatureCards
          variant="drag"
          id="details"
          title="Every detail, just how you want it."
          lead="From the overall layout to the smallest design choice, you're in control of how your website looks and feels."
          cards={cards}
        />
        <BlockShowcase />
        <SolSteps
          variant="drag"
          title={'Let Sol draft. You finish.\u00a0'}
          lead="Let Sol create your starting point. Then switch to the visual editor to refine the layout, adjust the details and make it yours."
          steps={dragSteps}
        />
        {/* Figma has no full stop after the heading; added like the other pages' closing headings. */}
        <PricingCta title="Your canvas is waiting." titleBox={494} sub={'Free for 14 days. No card.\u00a0'} />
      </main>
      <Footer />
    </>
  )
}
