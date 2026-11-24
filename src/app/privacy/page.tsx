import LegalPage, { legalMetadata } from '../../sections/legal/LegalPage'

export const metadata = legalMetadata('privacy')

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />
}
