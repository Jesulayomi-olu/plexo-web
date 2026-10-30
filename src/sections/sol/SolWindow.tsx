import styles from './SolWindow.module.css'

/**
 * "SOL · New conversation · Light" (614:21161): the Sol workspace drawn at Figma's size (727×466.67,
 * a 4px rgba(0,0,0,0.2) frame) — sidebar (brand, nav with the pointer on "New chat", recents, account)
 * and the main pane (top bar, greeting, composer). Built in HTML, not an image, so it stays sharp and
 * can be animated later. Decorative: one label describes it.
 */
const icon = (name: string) => `/assets/sol/app/${name}.svg`

const navItems = [
  { label: 'New chat', icon: 'message-plus' },
  { label: 'Search chats', icon: 'search' },
  { label: 'Memory', icon: 'globe' },
  { label: 'Sol settings', icon: 'settings' },
]

export function SolWindow() {
  return (
    <div className={styles.window} role="img" aria-label="The Sol workspace: a new conversation, ready for a prompt.">
      <div className={styles.sidebar} aria-hidden="true">
        <div className={styles.brand}>
          <span className={styles.logo}>
            <img src={icon('shield-logo')} width={10.1784} height={10.1784} alt="" />
          </span>
          <span className={styles.brandName}>Plexo</span>
        </div>
        <div className={styles.nav}>
          {navItems.map((item) => (
            <span key={item.label} className={styles.navItem}>
              <img src={icon(item.icon)} width={12.2141} height={12.2141} alt="" />
              {item.label}
            </span>
          ))}
          <span className={styles.cursor}>
            <img src={icon('cursor')} width={17.6434} height={17.6434} alt="" />
          </span>
        </div>
        <div className={styles.recents}>
          <span className={styles.recentsLabel}>Recents</span>
          <span className={styles.recentsEmpty}>No conversations yet.</span>
        </div>
        <div className={styles.spacer} />
        <div className={styles.account}>
          <span className={styles.userMenu}>
            Esther James
            <img src={icon('chevron-down')} width={8.14276} height={8.14276} alt="" />
          </span>
          <img src={icon('logout')} width={12.2141} height={12.2141} alt="" />
        </div>
      </div>

      <div className={styles.main} aria-hidden="true">
        <div className={styles.topBar}>
          <span className={styles.switch}>
            <span className={styles.switchItem}>
              <img src={icon('grid')} width={9.49989} height={9.49989} alt="" />
              Back to Dashboard
            </span>
            <span className={`${styles.switchItem} ${styles.switchActive}`}>
              <img src={icon('shield-sol')} width={9.49989} height={9.49989} alt="" />
              SOL
            </span>
          </span>
          <span className={styles.convTitle}>New conversation</span>
          <span className={styles.topSpacer} />
          <span className={styles.credits}>
            <img src={icon('bolt')} width={9.49989} height={9.49989} alt="" />0
          </span>
        </div>
        <div className={styles.content}>
          <p className={styles.greeting}>Good morning, Esther!</p>
          <div className={styles.composer}>
            <span className={styles.composerAttach}>
              <img src={icon('composer-plus')} width={10.857} height={10.857} alt="" />
            </span>
            <span className={styles.composerText}>Ask SOL to publish a page…</span>
            <span className={styles.mode}>
              Standard
              <img src={icon('chevron-down-mode')} width={8.14276} height={8.14276} alt="" />
            </span>
            <img src={icon('mic')} width={12.2141} height={12.2141} alt="" />
            <span className={styles.send}>
              <img src={icon('arrow-up')} width={10.857} height={10.857} alt="" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
