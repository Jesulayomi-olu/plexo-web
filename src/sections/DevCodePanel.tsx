import { useInView } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { useFitScale } from '../lib/useFitScale'
import { useStaticMotion } from '../lib/motion'
import { useCodeTyping } from '../motion/useCodeTyping'
import { devCode, devCodeText } from './devCode'
import styles from './DevCodePanel.module.css'

const LABEL =
  'Code editor showing app/developer-quickstart.tsx: importing PlexoBuilder and mcpServer, embedding the visual builder canvas and registering MCP tools, with “SDK & MCP Active” and “Vercel Edge Ready” status.'

/** The code split at `count`: typed runs, the caret, then the rest kept in place but invisible. */
function renderCode(count: number, caret: ReactNode) {
  const typed: ReactNode[] = []
  const rest: ReactNode[] = []
  let start = 0
  devCode.forEach(([text, kind], i) => {
    const shown = Math.max(0, Math.min(text.length, count - start))
    if (shown > 0) typed.push(<span key={`t${i}`} className={styles[kind]}>{text.slice(0, shown)}</span>)
    if (shown < text.length) rest.push(<span key={`r${i}`} className={styles[kind]}>{text.slice(shown)}</span>)
    start += text.length
  })
  return (
    <>
      {typed}
      {caret}
      {rest.length > 0 && <span className={styles.pending}>{rest}</span>}
    </>
  )
}

/**
 * Figma "SDK quickstart · Dark" (532:24769): a 717×515 #121212 panel (r19.31) with two blurred glows and
 * the "Code window" (title bar, code, status bar). Built live so the code can type itself out when the
 * panel comes into view (once; it pauses while off screen). Scaled as one piece to fit narrower columns.
 * Reduced motion and capture mode show the finished code.
 */
export function DevCodePanel() {
  const isStatic = useStaticMotion()
  const { ref, scale } = useFitScale<HTMLDivElement>(717, 0)
  const inView = useInView(ref, { amount: 0.4 })
  const { count, done } = useCodeTyping(devCodeText, !isStatic && inView, 500)
  const shown = isStatic ? devCodeText.length : count
  const typing = !isStatic && count > 0 && !done
  const caret = isStatic ? null : <span className={`${styles.caret} ${typing ? '' : styles.caretBlink}`} />

  return (
    <div ref={ref} className={styles.fit} style={{ '--s': scale } as CSSProperties}>
      <div className={styles.panel} role="img" aria-label={LABEL}>
        <span className={`${styles.glow} ${styles.glowTop}`} />
        <span className={`${styles.glow} ${styles.glowBottom}`} />
        <div className={styles.window} aria-hidden="true">
          <div className={styles.titleBar}>
            <span className={styles.controls}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.spacer} />
            <span className={styles.fileName}>app/developer-quickstart.tsx</span>
            <span className={styles.spacer} />
            <span className={styles.version}>SDK v1.0.40</span>
          </div>
          <pre className={styles.code}>{renderCode(shown, caret)}</pre>
          <div className={styles.statusBar}>
            <span className={styles.status}>
              <span className={styles.icon}>
                <img src="/assets/v2/icons/dev-sparkles.svg" width={14} height={14} alt="" />
              </span>
              SDK &amp; MCP Active
            </span>
            <span className={`${styles.status} ${styles.deploy}`}>
              <span className={`${styles.icon} ${styles.iconBolt}`}>
                <img src="/assets/v2/icons/dev-bolt.svg" width={12} height={12} alt="" />
              </span>
              Vercel Edge Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
