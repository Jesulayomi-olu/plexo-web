'use client'

import type { ReactNode } from 'react'
import { Reveal } from '../../components/Reveal'
import styles from './SolSteps.module.css'

/**
 * Build with Sol "Solutions" (575:15516): #e8e8e4, 1440×598. "From sentence to site." (48, two lines)
 * beside three white step cards (r8, padding 16/12, gap 24): a 32px #517a12 circle with a white 20px
 * icon, then title (500 16/17.6) and line (400 14/15.4).
 * The product pages reuse it:
 * - "drag": Design with a Drag (644:21503), "Let Sol draft. You finish." with a lead, in a 493 column.
 * - "mcp": MCP and API (669:28949), "Connect In Three steps" and a lead, left-aligned in a 288 column;
 *   each card has one line (the title style) and no second line.
 */
type StepIcon = { src: string; w: number; h: number; x: number; y: number }
export type Step = { title: string; body?: string; icon: StepIcon }

const SEND: StepIcon = { src: 'send', w: 20, h: 20, x: 0, y: 0 }
// file-text's artwork is 15.08×18.42, placed at (2.585, 0.666) in its 20px frame.
const FILE_TEXT: StepIcon = { src: 'file-text', w: 15.0833, h: 18.4167, x: 2.585, y: 0.666 }
const PENCIL: StepIcon = { src: 'pencil', w: 20, h: 20, x: 0, y: 0 }

export const solSteps: Step[] = [
  { title: 'Tell Sol what you sell', body: 'One sentence is enough.', icon: SEND },
  { title: 'Sol drafts it', body: 'Pages, copy, images and layout in minutes.', icon: FILE_TEXT },
  { title: 'Tweak and publish', body: 'Chat to change it or drag it yourself.', icon: PENCIL },
]

/** Design with a Drag (644:21506): Sol's steps; its second line starts with a space. */
export const dragSteps: Step[] = solSteps.map((step, i) => (i === 1 ? { ...step, body: `\u00a0${step.body}` } : step))

export const mcpSteps: Step[] = [
  { title: 'Copy your Plexo MCP link from settings.', icon: SEND },
  { title: 'Paste it into Claude, ChatGPT or Cursor.', icon: FILE_TEXT },
  { title: 'Ask for a page. Watch it go live.', icon: PENCIL },
]

export default function SolSteps({
  variant = 'sol',
  title = (
    <>
      From sentence
      <br />
      to site.
    </>
  ),
  lead,
  steps = solSteps,
}: {
  variant?: 'sol' | 'drag' | 'mcp'
  title?: ReactNode
  lead?: string
  steps?: Step[]
}) {
  return (
    <section id="how" data-section={`${variant}-steps`} className={`${styles.section} ${styles[variant]}`} aria-labelledby="steps-title">
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.headSlot}>
          <h2 id="steps-title" className={styles.title}>
            {title}
          </h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </Reveal>
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <Reveal key={step.title} as="li" delay={0.08 * i} className={styles.step}>
              <span className={styles.badge} aria-hidden="true">
                <span className={styles.iconFrame}>
                  <img
                    src={`/assets/sol/steps/${step.icon.src}.svg`}
                    width={step.icon.w}
                    height={step.icon.h}
                    alt=""
                    style={{ left: step.icon.x, top: step.icon.y }}
                  />
                </span>
              </span>
              <span className={styles.copy}>
                <span className={styles.stepTitle}>{step.title}</span>
                {step.body && <span className={styles.stepBody}>{step.body}</span>}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
