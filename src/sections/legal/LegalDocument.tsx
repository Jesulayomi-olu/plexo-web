'use client'

import { useEffect, useState } from 'react'
import { Reveal } from '../../components/Reveal'
import { LEGAL_EMAIL, legalDocs, type LegalBlock, type LegalDoc } from './content'
import styles from './LegalDocument.module.css'

/**
 * A legal page's body (no Figma design; built from the site's parts): the three documents as tabs (the
 * Blog's category chips, as links), then "On this page" (sticky, follows the reading position) beside
 * the document: "The short version" (green tint card with checks), the numbered sections, and a
 * contact card.
 */
function Block({ block }: { block: LegalBlock }) {
  if ('p' in block) return <p className={styles.paragraph}>{block.p}</p>
  if ('list' in block)
    return (
      <ul className={styles.list}>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {block.table.head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) => (i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** The id of the section being read: the last one whose heading has passed 1/4 down the window. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.25
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      // At the very bottom, the last section counts as read even if its heading never reaches the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = ids[ids.length - 1]
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])
  return active
}

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  const [ids] = useState(() => doc.sections.map((section) => section.id))
  const active = useActiveSection(ids)

  return (
    <div className={styles.section} data-section="legal">
      <div className={`container ${styles.inner}`}>
        <nav className={styles.tabs} aria-label="Legal documents">
          {legalDocs.map((item) => (
            <a key={item.slug} href={item.href} className={styles.tab} aria-current={item.slug === doc.slug ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.columns}>
          <nav className={styles.toc} aria-label="On this page">
            <p className={styles.tocTitle}>On this page</p>
            <ol className={styles.tocList}>
              {doc.sections.map((section, i) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={styles.tocLink} aria-current={active === section.id ? 'location' : undefined}>
                    <span className={styles.tocNumber}>{i + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className={styles.doc}>
            <Reveal className={styles.summary}>
              <h2 className={styles.summaryTitle}>The short version</h2>
              <ul className={styles.summaryList}>
                {doc.summary.map((line) => (
                  <li key={line}>
                    <img src="/assets/pricing/table-check.svg" width={20} height={20} alt="" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>

            {doc.sections.map((section, i) => (
              <section key={section.id} id={section.id} className={styles.part} aria-labelledby={`${section.id}-title`}>
                <h2 id={`${section.id}-title`} className={styles.partTitle}>
                  <span className={styles.partNumber}>{i + 1}.</span> {section.title}
                </h2>
                {section.blocks.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </section>
            ))}

            <div className={styles.contact}>
              <img src="/assets/contact/chat.svg" width={24} height={24} alt="" />
              <div>
                <p className={styles.contactTitle}>Questions about this {doc.slug === 'terms' ? 'agreement' : 'policy'}?</p>
                <p className={styles.contactText}>
                  Email us at{' '}
                  <a href={`mailto:${LEGAL_EMAIL}`} className={styles.contactLink}>
                    {LEGAL_EMAIL}
                  </a>{' '}
                  or use our{' '}
                  <a href="/contact" className={styles.contactLink}>
                    contact page
                  </a>
                  .
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
