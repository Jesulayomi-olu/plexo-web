'use client'

import { useState } from 'react'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { audiences, featuredStory, stories, type Audience } from './data'
import { Avatar, Chips, Empty, LoadMore, PageHeader, ShotSlot } from './parts'
import styles from './StoryLibrary.module.css'

/**
 * Customer stories (718:11002): the left-aligned header; the featured story (#1d3509, r24, padding 24,
 * gap 48: the site picture, 620×380, beside a 520 column with the quote, "THE PROMPT" and the author
 * with "Read the story"); the audience chips; the stories, three to a row (410, gap 24); "Load more
 * stories" while there are more than a page. Stories have no pages yet, so the cards don't link.
 */
const PAGE = 3

const filters: { id: Audience | 'all'; label: string }[] = [{ id: 'all', label: 'All' }, ...audiences.map((a) => ({ id: a.id, label: a.chip }))]

export default function StoryLibrary() {
  const [audience, setAudience] = useState<Audience | 'all'>('all')
  const [shown, setShown] = useState(PAGE)
  const list = stories.filter((s) => audience === 'all' || s.audience === audience)

  return (
    <div className={`container ${styles.content}`}>
      <PageHeader id="stories-title" title="Customer stories" lead="Real prompts. Real sites." align="start" />

      <Reveal className={styles.featured}>
        <ShotSlot shot={featuredStory.shot} className={styles.featuredShot} alt="The Glow by Amy online store" />
        <div className={styles.featuredText}>
          <p className={styles.featuredTag}>{featuredStory.tag}</p>
          <blockquote className={styles.featuredQuote}>{featuredStory.quote}</blockquote>
          <div className={styles.featuredFoot}>
            <div className={styles.prompt}>
              <p className={styles.promptLabel}>THE PROMPT</p>
              <p className={styles.promptText}>{featuredStory.prompt}</p>
            </div>
            <div className={styles.featuredRow}>
              <div className={styles.author}>
                <Avatar />
                <span className={styles.who}>
                  <span className={styles.name}>{featuredStory.name}</span>
                  <span className={styles.role}>{featuredStory.role}</span>
                </span>
              </div>
              <Button
                variant="primary"
                className={styles.cta}
                trailingIcon={<img src="/assets/resources/arrow-right.svg" width={16} height={16} alt="" />}
              >
                Read the story
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      <Chips
        label="Filter stories"
        options={filters}
        value={audience}
        onChange={(id) => {
          setAudience(id)
          setShown(PAGE)
        }}
      />

      {list.length ? (
        <ul className={styles.grid}>
          {list.slice(0, shown).map((story) => (
            <li key={story.id} className={styles.card}>
              <ShotSlot shot={story.shot} className={styles.shot} alt="" />
              <blockquote className={styles.quote}>{story.quote}</blockquote>
              <div className={styles.author}>
                <Avatar />
                <span className={styles.who}>
                  <span className={`${styles.name} ${styles.dark}`}>{story.name}</span>
                  <span className={`${styles.role} ${styles.subtle}`}>{story.role}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No stories here yet.</Empty>
      )}

      {list.length > shown && <LoadMore label="Load more stories" onClick={() => setShown((n) => n + PAGE)} />}
    </div>
  )
}
