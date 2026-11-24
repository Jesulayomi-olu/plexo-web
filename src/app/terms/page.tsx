import LegalPage, { legalMetadata } from '../../sections/legal/LegalPage'

export const metadata = legalMetadata('terms')

export default function TermsPage() {
  return <LegalPage slug="terms" />
}
