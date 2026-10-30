import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import FeatureHero from '../../../sections/features/FeatureHero'
import { StoreMock } from '../../../sections/features/StoreMock'
import Solutions from '../../../sections/forYou/Solutions'
import FeatureCards, { type FeatureCard } from '../../../sections/features/FeatureCards'
import Faq from '../../../sections/Faq'
import PricingCta from '../../../sections/pricing/PricingCta'
import Footer from '../../../sections/Footer'

export const metadata: Metadata = {
  title: 'E-commerce — Plexo',
  description: 'Sell online from your own store: add your products, take payments and manage orders in one place.',
}

const icon = (name: string, w = 19.2, h = 19.2, x = 0, y = 0) => ({ src: `/assets/features/ecommerce/${name}.svg`, w, h, x, y })

// "What You get" (736:13521): the tall card first, then the two rows of three. Icon artwork sits in its
// 19.2 frame where Figma's insets put it.
const cards: FeatureCard[] = [
  { tone: 'lime', title: 'Product pages', body: ['Photos, prices and variants that sell.'], bodyWidth: 240, icon: icon('layout', 16, 16, 1.6, 1.6) },
  { tone: 'grey', title: 'Checkout', body: ['A clean, mobile first way to pay.'], bodyWidth: 331, icon: icon('cart', 17.56, 17.5827, 0.8401, 0.8158) },
  { tone: 'lime', title: 'Local payments', body: ['Paystack, Flutterwave and cards'], bodyWidth: 331, icon: icon('wallet-cards', 16, 16, 1.6, 1.6) },
  { tone: 'dark', title: 'Order capture', body: ['Every order, customer and note ', 'in one place.'], bodyWidth: 355, icon: icon('clipboard', 14.4, 17.6, 2.4, 0.8) },
  { tone: 'dark', title: 'WhatsApp button', body: ['Let buyers ask before they buy.'], bodyWidth: 355, icon: icon('message') },
  { tone: 'lime', title: 'Digital products', body: ['Sell ebooks, courses and downloads'], bodyWidth: 240, icon: icon('download', 16, 16, 1.6, 1.6) },
  { tone: 'grey', title: 'Discount codes', body: ['Run promos without the maths.'], bodyWidth: 331, icon: icon('wallet', 16.8, 16, 1.6, 1.6) },
]

// Section order follows Figma "E commerce" (731:12626) → "Main"; its hidden pricing frame is left out.
export default function EcommercePage() {
  return (
    <>
      <Nav />
      <main className="page-main">
        <FeatureHero
          id="ecommerce-hero"
          title="Sell online from your own store"
          lead="Add your products, take payments and manage orders in one place. Customers buy without messaging you."
          action={{ label: 'Open your store', href: '#start' }}
          note=" Free for 14 days. No card."
          visual={{
            tone: 'tint',
            label: 'A product card with sizes and “Add to cart”, and the cart beside it: two items, ₦30,500 in total, and “Checkout”.',
            content: <StoreMock />,
          }}
        />
        <Solutions
          title="DMs are not for checkout."
          problems={['"Price please" on every post', 'Bank transfer screenshots', 'Orders lost in chat', 'Selling only when you are online']}
          fixes={[
            'Prices on every product page',
            'Payment at checkout, confirmed instantly',
            'Every order saved in one dashboard',
            'Your store sells while you sleep',
          ]}
        />
        <FeatureCards variant="ecommerce" id="what-you-get" title="What You get" cards={cards} />
        <Faq variant="ecommerce" />
        <PricingCta
          title={'Open your store today.\u00a0'}
          titleBox={null}
          prompt="A store for my thrift fashion brand. Lagos delivery. Bold and youthful"
        />
      </main>
      <Footer />
    </>
  )
}
