import type { Metadata } from 'next'
import Nav from '../../../sections/Nav'
import { SIGNUP_HREF } from '../../../sections/navData'
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

// "What You get" (736:13521): the tall card first, then the two rows of three. The copy (November 2026)
// fills each card's 240 padding box and wraps there. Icon artwork sits in its 19.2 frame where Figma's
// insets put it.
const cards: FeatureCard[] = [
  { tone: 'lime', title: 'Product pages', body: ['Showcase your products with photos, prices and variants.'], icon: icon('layout', 16, 16, 1.6, 1.6) },
  { tone: 'grey', title: 'Checkout', body: ['Give customers a simple, mobile-friendly way to pay.'], icon: icon('cart', 17.56, 17.5827, 0.8401, 0.8158) },
  { tone: 'lime', title: 'Local payments', body: ['Accept payments through Paystack, Flutterwave and cards.'], icon: icon('wallet-cards', 16, 16, 1.6, 1.6) },
  { tone: 'dark', title: 'Order capture', body: ['Keep track of orders, customers and notes in one place.'], icon: icon('clipboard', 14.4, 17.6, 2.4, 0.8) },
  { tone: 'dark', title: 'WhatsApp button', body: ['Let customers ask questions before they buy.'], icon: icon('message') },
  { tone: 'lime', title: 'Digital products', body: ['Sell ebooks, courses and downloadable products.'], icon: icon('download', 16, 16, 1.6, 1.6) },
  { tone: 'grey', title: 'Discount codes', body: ['Create offers and give customers a reason to buy.'], icon: icon('wallet', 16.8, 16, 1.6, 1.6) },
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
          lead="Add your products, accept payments and manage orders in one place. Give customers an easier way to buy without having to message you first."
          textWidth={435}
          action={{ label: 'Open your store', href: SIGNUP_HREF }}
          note=" Free for 14 days. No card."
          visual={{
            tone: 'tint',
            label: 'A product card with sizes and “Add to cart”, and the cart beside it: two items, ₦30,500 in total, and “Checkout”.',
            content: <StoreMock />,
            // Phones: the two cards and 20px around them, so they read larger (about 0.74 on a 390 phone, not 0.67).
            phoneCrop: { x: 24, y: 40, width: 471, height: 420 },
          }}
        />
        <Solutions
          title="DMs are not for checkout."
          column={324}
          problems={['"Price please" on every post.', 'Bank transfer screenshots.', 'Orders lost in chat.', 'Orders buried in chats.']}
          fixes={[
            'Prices are displayed on every product page.',
            'Customers pay securely at checkout.',
            'Every order is organised in one dashboard.',
            "Your store stays open even when you're away.",
          ]}
        />
        <FeatureCards variant="ecommerce" id="what-you-get" title="What You get" cards={cards} />
        <Faq variant="ecommerce" />
        <PricingCta
          title={'Open your store today.\u00a0'}
          titleBox={null}
          prompt="A store for my thrift fashion brand. Lagos delivery. Bold and youthful."
        />
      </main>
      <Footer />
    </>
  )
}
