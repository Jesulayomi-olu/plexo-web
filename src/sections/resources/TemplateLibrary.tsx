'use client'

import { useState } from 'react'
import { audiences, templates, templateKinds, type Audience, type TemplateKind } from './data'
import { Empty, LoadMore, PageHeader, ShotSlot, Tag } from './parts'
import styles from './TemplateLibrary.module.css'

/**
 * Templates (718:9563): the centred header, then (gap 32) a row with the "Email Design" / "Landing Page"
 * chips and the 312-wide search, and (gap 48) the gallery: the 220-wide category checklist beside the
 * templates, three to a row (320 wide, gap 32/24). Every filter starts open (Figma ticks "Small
 * businesses" to show the checked style); a chip or a box narrows the list, a second press clears it.
 */
const PAGE = 6

export default function TemplateLibrary() {
  const [kind, setKind] = useState<TemplateKind | null>(null)
  const [picked, setPicked] = useState<Audience[]>([])
  const [search, setSearch] = useState('')
  const [shown, setShown] = useState(PAGE)
  const words = search.trim().toLowerCase()

  const list = templates.filter(
    (t) =>
      (!kind || t.kind === kind) &&
      (!picked.length || picked.includes(t.audience)) &&
      (!words || `${t.name} ${t.tag}`.toLowerCase().includes(words)),
  )

  const toggleAudience = (id: Audience) => {
    setPicked((current) => (current.includes(id) ? current.filter((a) => a !== id) : [...current, id]))
    setShown(PAGE)
  }

  return (
    <div className={`container ${styles.content}`}>
      <PageHeader id="templates-title" title="Templates" lead="Start from a proven page." />

      <div className={styles.library}>
        <div className={styles.toolbar}>
          <div className={styles.kinds} role="group" aria-label="Template type">
            {templateKinds.map((k) => (
              <button
                key={k.id}
                type="button"
                className={styles.kind}
                aria-pressed={kind === k.id}
                onClick={() => {
                  setKind((current) => (current === k.id ? null : k.id))
                  setShown(PAGE)
                }}
              >
                {k.label}
              </button>
            ))}
          </div>
          <label className={styles.search}>
            <span className={styles.searchIcon} aria-hidden="true">
              <img src="/assets/resources/search-16.svg" width={13.3333} height={13.3333} alt="" />
            </span>
            <span className="visually-hidden">Search templates</span>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setShown(PAGE)
              }}
              placeholder="Search templates"
              className={styles.input}
            />
          </label>
        </div>

        <div className={styles.gallery}>
          <fieldset className={styles.filters}>
            <legend className={styles.overline}>CATEGORIES</legend>
            {audiences.map((a) => (
              <label key={a.id} className={styles.option}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={picked.includes(a.id)}
                  onChange={() => toggleAudience(a.id)}
                />
                <span className={styles.checkbox} aria-hidden="true">
                  <img src="/assets/resources/check.svg" width={14} height={14} alt="" />
                </span>
                {a.label}
              </label>
            ))}
          </fieldset>

          <div className={styles.results}>
            {list.length ? (
              <ul className={styles.grid}>
                {list.slice(0, shown).map((t) => (
                  <li key={t.id} className={styles.card}>
                    <ShotSlot shot={t.shot} className={styles.shot} alt={`${t.name} template`} />
                    <div className={styles.text}>
                      <h2 className={styles.name}>{t.name}</h2>
                      <Tag>{t.tag}</Tag>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>No templates match these filters yet.</Empty>
            )}
          </div>
        </div>
      </div>

      {/* Figma's button here reads "Load more stories", copied from Customer stories. */}
      {list.length > shown && <LoadMore label="Load more templates" onClick={() => setShown((n) => n + PAGE)} />}
    </div>
  )
}
