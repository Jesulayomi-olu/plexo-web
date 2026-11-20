'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type Ref,
} from 'react'
import { Button } from '../../components/Button'
import { Reveal } from '../../components/Reveal'
import { ease, useStaticMotion } from '../../lib/motion'
import { useGlide } from '../../motion/useGlide'
import { SIGNUP_HREF } from '../navData'
import styles from './CreateModes.module.css'

/**
 * Figma "Hero" (1166:15342) on Home page V2: 1440×924, white, padding 80. It holds an instance
 * (1166:15364, 1278 wide) of "Component 9" (1133:17767), whose three variants are the three tabs:
 * - "Start with Plexo AI" = 1133:17766: a 402-tall #1d3509 panel (20% black wash, r32) with the prompt
 *   card on a glass pane beside the white "Start with an idea." card and its three steps.
 * - "Start with a template" = 1133:17764: a 602-tall #e8e8e4 panel with the copy, the "Start with a
 *   template" chip and a row of template screenshots that runs past both sides and glides (as the
 *   earlier home page's template row did).
 * - "Design with the visual editor" = 1133:17765, the page instance since November 2026 ("the new build
 *   with editor section"): a 456-tall line-pattern panel with the copy, "Start from a blank canvas" and
 *   the dark editor ("Editor v2 · Dark", the Elements panel open beside a Foundry & Form page), which
 *   runs off the right and bottom edges.
 * The tab order is the page instance's (AI · template · visual editor); the AI variant still lists the
 * last two the other way round. The heading is the instance's override ("Built around the way you
 * create"), so every tab keeps it. The page opens on the Plexo AI tab (the design team's call). Every
 * panel gets r32 corners, as the AI panel has (the earlier template instance had them too; the editor
 * and template variants are square). The editor (1328:9837) and the template screenshots are images
 * exported from Figma.
 *
 * Motion: switching tabs crossfades the panels while the panel area eases to the new height. The
 * template row glides left in a loop from the Figma position (useGlide, 24px/s, as the earlier home
 * page's row): drag, swipe or the arrow keys move it, and it pauses on hover and while in use.
 * Reduced motion: instant tabs, no glide (the row still moves by hand). Capture mode: the Figma row.
 */
type TabId = 'ai' | 'template' | 'editor'

const TABS: { id: TabId; label: string }[] = [
  { id: 'ai', label: 'Start with Plexo AI' },
  { id: 'template', label: 'Start with a template' },
  { id: 'editor', label: 'Design with the visual editor' },
]

/* The page opens on "Start with Plexo AI" (the design team's call; the Figma instance shows the template tab). */
const DEFAULT_TAB: TabId = 'ai'
const ASSETS = '/assets/v3/create-modes'

/*
 * Template row (1133:17128), left to right; at rest the row is centred and "image 26" (Fieldnote) lies
 * just out of view on the left, as in Figma. The glide brings it round.
 */
const TEMPLATE_TILES = [
  { src: `${ASSETS}/template-fieldnote.webp`, w: 298.517, alt: 'Software template: Fieldnote, “Know why they leave, not just when.”' },
  { src: `${ASSETS}/template-solene.webp`, w: 298.357, alt: 'Skincare store template: Solène' },
  { src: `${ASSETS}/template-atelier-oak.webp`, w: 441.534, alt: 'Architecture studio template: Atelier Oak, “Quiet houses, built to last a century.”' },
  { src: `${ASSETS}/template-iron-grain.webp`, w: 435.532, alt: 'Gym template: Iron & Grain, “Strength is a skill. We coach it.”' },
  { src: `${ASSETS}/template-northfold.webp`, w: 475.839, alt: 'Brand studio template: Northfold' },
] as const

/* The three steps (1133:16250): a 24px #121212 disc holding a 12px icon. */
const AI_STEPS = [
  { label: 'Describe what your business does', icon: 'step-pencil.svg', className: '' },
  { label: 'Let Plexo generate your website', icon: 'step-sparkles.svg', className: styles.stepIconSparkles },
  { label: 'Customize and Publish', icon: 'step-rectangle-vertical.svg', className: '' },
] as const

/** Template row glide speed (px/s) and the copies of the row in its track, so no edge ever shows. */
const GLIDE_SPEED = 24
const GLIDE_COPIES = 4

/** Every picture the tabs show, fetched once the section is near so switching tabs never waits. */
/* "Editor v2 · Dark" (1328:9837): the panel shows its top-left 753×420, exported at 2× and 3×. */
const EDITOR_SHOT = {
  src: `${ASSETS}/editor-v2@2x.webp`,
  srcSet: `${ASSETS}/editor-v2@2x.webp 1506w, ${ASSETS}/editor-v2@3x.webp 2259w`,
  sizes: '(max-width: 767px) 565px, 753px',
}

const PRELOAD = [EDITOR_SHOT, ...TEMPLATE_TILES.map((t) => ({ src: t.src, srcSet: undefined, sizes: undefined }))]

/* "Start with Plexo AI" (1133:16214). */
function AiPanel() {
  const inputId = `${useId()}-prompt`
  const onSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault()

  return (
    <div className={`${styles.panel} ${styles.ai}`}>
      <div className={styles.aiGlass}>
        <form className={styles.aiPrompt} onSubmit={onSubmit}>
          <div className={styles.aiField}>
            <div className={styles.aiFieldMain}>
              <button type="button" className={styles.attach} aria-label="Attach a file">
                <img src={`${ASSETS}/plus.svg`} width={17} height={17} alt="" />
              </button>
              <label htmlFor={inputId} className="visually-hidden">
                Describe the site you want to build
              </label>
              <input id={inputId} name="prompt" type="text" className={styles.aiInput} placeholder="Type in your prompt" autoComplete="off" />
            </div>
            <Button type="submit" className={styles.aiSubmit}>
              Build it
            </Button>
          </div>
        </form>
      </div>
      <div className={styles.aiCard}>
        {/* Figma keeps the leading space of the second line. */}
        <h3 className={styles.aiTitle}>{'Start with an idea.\n Let AI do the heavy lifting.'}</h3>
        <ol className={styles.aiSteps}>
          {AI_STEPS.map((step) => (
            <li key={step.label} className={styles.aiStep}>
              <span className={styles.stepIcon} aria-hidden="true">
                <img src={`${ASSETS}/${step.icon}`} className={step.className || undefined} alt="" />
              </span>
              {step.label}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* One copy of the template row; the glide track repeats it (only the shown copy is read out). */
function TemplateList({ ref, hidden = false }: { ref?: Ref<HTMLUListElement>; hidden?: boolean }) {
  return (
    <ul ref={ref} className={styles.templateList} aria-hidden={hidden || undefined}>
      {TEMPLATE_TILES.map((tile) => (
        <li key={tile.src} className={styles.templateTile} style={{ '--w': tile.w } as CSSProperties}>
          <img src={tile.src} width={tile.w} height={401.238} alt={hidden ? '' : tile.alt} draggable={false} />
        </li>
      ))}
    </ul>
  )
}

/* The gliding template row ("Frame 2147239134"). */
function TemplateRow() {
  const isStatic = useStaticMotion()
  const { viewportRef, listRef, x, nudge } = useGlide({ auto: !isStatic, speed: GLIDE_SPEED })
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    nudge(event.key === 'ArrowRight' ? 320 : -320)
  }
  return (
    <div
      ref={viewportRef}
      className={styles.templateRow}
      role="region"
      aria-roledescription="carousel"
      aria-label="Templates: drag, swipe or use the arrow keys to browse"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <motion.div className={styles.templateTrack} style={{ x }}>
        {Array.from({ length: GLIDE_COPIES }, (_, i) =>
          i === 1 ? <TemplateList key={i} ref={listRef} /> : <TemplateList key={i} hidden />,
        )}
      </motion.div>
    </div>
  )
}

/* "Start with a template" (1133:17118 in the variant 1133:17764). */
function TemplatesPanel() {
  return (
    <div className={`${styles.panel} ${styles.templates}`}>
      <div className={styles.templatesContent}>
        <div className={styles.templatesHead}>
          <div className={styles.copyText}>
            <h3 className={styles.panelTitle}>Ready-made designs to get you started.</h3>
            {/* Full stop added (Figma ends with "from scratch"). */}
            <p className={styles.panelBody}>
              Browse professionally designed templates and choose one that fits your business. Start with a layout that&apos;s already
              put together instead of building from scratch.
            </p>
          </div>
          <a href="/resources/templates" className={styles.chip}>
            Start with a template
            <img src={`${ASSETS}/chevron-right.svg`} width={12} height={12} alt="" />
          </a>
        </div>
        <TemplateRow />
      </div>
    </div>
  )
}

/* "Design with the visual editor" (I1166:15364;1164:8664, the page instance). */
function EditorPanel() {
  return (
    <div className={`${styles.panel} ${styles.editor}`}>
      <div className={styles.editorCopy}>
        <div className={styles.copyText}>
          <h3 className={styles.panelTitle}>Bring your own creative touch.</h3>
          <p className={styles.panelBody}>
            Arrange sections, change colours and fonts, add images and adjust layouts. Make every part of your website look and feel
            the way you want.
          </p>
        </div>
        {/* Figma has two spaces after "from"; one here. */}
        <a href={SIGNUP_HREF} className={styles.pillCta}>
          Start from a blank canvas
          <img src={`${ASSETS}/arrow-right.svg`} width={16} height={16} alt="" />
        </a>
      </div>
      <img
        className={styles.editorShot}
        src={EDITOR_SHOT.src}
        srcSet={EDITOR_SHOT.srcSet}
        sizes={EDITOR_SHOT.sizes}
        width={753}
        height={420}
        alt="The Plexo visual editor: the Elements panel with ready-made sections and basic blocks, beside a furniture shop's home page on the canvas"
        draggable={false}
      />
    </div>
  )
}

const PANELS: Record<TabId, ComponentType> = { ai: AiPanel, template: TemplatesPanel, editor: EditorPanel }

/**
 * Phones: the tab row scrolls sideways, so a tab tapped where it is cut off at the edge slides fully into
 * view (a gutter's width from the edge). Where the row fits (tablets, desktop) nothing moves.
 */
function revealTab(tabEl: HTMLElement) {
  const scroller = tabEl.parentElement?.parentElement
  if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return
  const edge = 20
  const s = scroller.getBoundingClientRect()
  const t = tabEl.getBoundingClientRect()
  const by = t.left < s.left + edge ? t.left - s.left - edge : t.right > s.right - edge ? t.right - s.right + edge : 0
  if (by) scroller.scrollBy({ left: by, behavior: 'smooth' })
}

export default function CreateModes() {
  const uid = useId()
  const isStatic = useStaticMotion()
  const [tab, setTab] = useState<TabId>(DEFAULT_TAB)
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({})

  // Warm the other tabs' pictures once the section is close.
  const sectionRef = useRef<HTMLElement>(null)
  const near = useInView(sectionRef, { once: true, margin: '400px 0px' })
  useEffect(() => {
    if (!near) return
    PRELOAD.forEach(({ src, srcSet, sizes }) => {
      const img = new Image()
      if (srcSet && sizes) {
        img.sizes = sizes
        img.srcset = srcSet
      }
      img.src = src
    })
  }, [near])

  // The panel area follows the active panel's height, so it can ease between tabs of different heights.
  const [height, setHeight] = useState<number>()
  const observer = useRef<ResizeObserver | null>(null)
  const measure = useCallback((el: HTMLDivElement | null) => {
    if (!el) return
    observer.current?.disconnect()
    observer.current = new ResizeObserver(() => setHeight(el.offsetHeight))
    observer.current.observe(el)
  }, [])
  useEffect(() => () => observer.current?.disconnect(), [])

  // Arrow keys move between tabs (and select them), Home and End jump to the ends.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((t) => t.id === tab)
    const next =
      event.key === 'ArrowRight' ? (index + 1) % TABS.length
      : event.key === 'ArrowLeft' ? (index - 1 + TABS.length) % TABS.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? TABS.length - 1
      : -1
    if (next < 0) return
    event.preventDefault()
    const id = TABS[next].id
    setTab(id)
    tabRefs.current[id]?.focus()
  }

  const tabId = (id: TabId) => `${uid}-tab-${id}`
  const panelId = `${uid}-panel`
  const Panel = PANELS[tab]
  const panel = (
    <div id={panelId} role="tabpanel" aria-labelledby={tabId(tab)} tabIndex={0} className={styles.tabpanel}>
      <Panel />
    </div>
  )

  return (
    <section ref={sectionRef} id="create" data-section="create" className={styles.section}>
      <div className="container">
        <div className={styles.component}>
          <Reveal className={styles.header}>
            <h2 className={styles.title}>Built around the way you create</h2>
            <div className={styles.tabsScroller}>
              <div role="tablist" aria-label="Ways to build" className={styles.tabs} onKeyDown={onKeyDown}>
                {TABS.map((t) => {
                  const selected = t.id === tab
                  return (
                    <button
                      key={t.id}
                      ref={(el) => {
                        tabRefs.current[t.id] = el
                      }}
                      id={tabId(t.id)}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={selected ? panelId : undefined}
                      tabIndex={selected ? 0 : -1}
                      className={`${styles.tab} ${selected ? styles.tabActive : ''}`}
                      onClick={(event) => {
                        setTab(t.id)
                        revealTab(event.currentTarget)
                      }}
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {isStatic ? (
              <div className={styles.stage}>{panel}</div>
            ) : (
              <motion.div
                className={styles.stage}
                initial={false}
                animate={height === undefined ? undefined : { height }}
                transition={{ duration: 0.45, ease }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <div ref={measure}>{panel}</div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
