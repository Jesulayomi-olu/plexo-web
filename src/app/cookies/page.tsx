import LegalPage, { legalMetadata } from '../../sections/legal/LegalPage'

export const metadata = legalMetadata('cookies')

export default function CookiesPage() {
  return <LegalPage slug="cookies" />
}
