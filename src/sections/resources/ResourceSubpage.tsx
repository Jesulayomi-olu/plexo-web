'use client'

import { useSearchParams } from 'next/navigation'
import BlogIndex from './BlogIndex'
import Newsletter from './Newsletter'
import StoryLibrary from './StoryLibrary'
import TemplateLibrary from './TemplateLibrary'
import { BackNav } from './parts'
import styles from './page.module.css'

type ResourceKind = 'blog' | 'templates' | 'stories'

const pageDetails = {
  blog: { label: 'Blog', titleId: 'blog-title' },
  templates: { label: 'Templates', titleId: 'templates-title' },
  stories: { label: 'Customer stories', titleId: 'stories-title' },
} satisfies Record<ResourceKind, { label: string; titleId: string }>

export default function ResourceSubpage({ kind }: { kind: ResourceKind }) {
  const searchParams = useSearchParams()
  const details = pageDetails[kind]

  return (
    <>
      {searchParams.get('from') === 'resources' && <BackNav href="/resources" label="Back to Resources" />}
      <section className={styles.section} aria-labelledby={details.titleId}>
        {kind === 'blog' ? <BlogIndex query={searchParams.get('q') ?? ''} /> : null}
        {kind === 'templates' ? <TemplateLibrary /> : null}
        {kind === 'stories' ? <StoryLibrary /> : null}
      </section>
      <Newsletter />
    </>
  )
}
