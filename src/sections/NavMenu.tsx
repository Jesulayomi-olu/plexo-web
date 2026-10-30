'use client'

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { audienceItems, featureItems } from './navData'
import { resourceMenu } from './resources/data'
import styles from './NavMenu.module.css'

export type MenuId = 'features' | 'for-you' | 'resources'

/* "chevron-up" (191:3635) rotated 180°: 16×16, white 1px stroke. Turns to point up while its menu is open. */
function Chevron({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type Controls = {
  /** Pointer (mouse) entered or left the trigger + menu area. */
  hover: (id: MenuId, inside: boolean) => void
  /** Trigger pressed; mouse presses keep the menu open, touch and keyboard presses toggle it. */
  press: (id: MenuId, pointer: string) => void
  close: (id: MenuId) => void
}

type DropdownProps = {
  id: MenuId
  label: string
  open: boolean
  controls: Controls
  triggerClassName: string
  chevronClassName: string
  children: ReactNode
}

/** Moves focus between the menu's links with the arrow keys. */
function focusSibling(menu: HTMLElement, step: number) {
  const links = [...menu.querySelectorAll<HTMLAnchorElement>('a')]
  const index = links.indexOf(document.activeElement as HTMLAnchorElement)
  links[(index + step + links.length) % links.length]?.focus()
}

/**
 * A nav item that opens a menu below the bar: on hover with a mouse, on press with touch, and from the
 * keyboard (Enter / Space / ↓; Esc closes and returns focus; ↑ ↓ move through the links). The menu stays
 * mounted so its photos load ahead of time; it is hidden from pointers, focus and screen readers while closed.
 */
function Dropdown({ id, label, open, controls, triggerClassName, chevronClassName, children }: DropdownProps) {
  const [pointer, setPointer] = useState('mouse')
  const menuId = `nav-menu-${id}`

  const onKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    const menu = event.currentTarget.querySelector<HTMLElement>(`#${menuId}`)
    if (!menu) return
    const inMenu = menu.contains(document.activeElement)
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      controls.close(id)
      event.currentTarget.querySelector('button')?.focus()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) controls.press(id, 'keyboard')
      // The menu becomes focusable once it is visible, on the next frame.
      requestAnimationFrame(() => (inMenu ? focusSibling(menu, event.key === 'ArrowDown' ? 1 : -1) : menu.querySelector('a')?.focus()))
    }
  }

  return (
    <li
      className={styles.item}
      data-open={open || undefined}
      onPointerEnter={(event) => event.pointerType === 'mouse' && controls.hover(id, true)}
      onPointerLeave={(event) => event.pointerType === 'mouse' && controls.hover(id, false)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget as Node | null) && controls.close(id)}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        className={triggerClassName}
        aria-expanded={open}
        aria-controls={menuId}
        onPointerDown={(event) => setPointer(event.pointerType)}
        // A click without a pointer (detail 0) came from the keyboard.
        onClick={(event) => controls.press(id, event.detail === 0 ? 'keyboard' : pointer)}
      >
        {label}
        <Chevron className={chevronClassName} />
      </button>
      <div id={menuId} className={`${styles.menu} ${styles[id === 'for-you' ? 'forYou' : id]}`}>
        {children}
      </div>
    </li>
  )
}

/** "Features" (565:2852): five links. */
export function FeaturesMenu(props: Omit<DropdownProps, 'id' | 'label' | 'children'> & { onNavigate: () => void }) {
  const { onNavigate, ...rest } = props
  return (
    <Dropdown id="features" label="Features" {...rest}>
      <ul className={styles.links}>
        {featureItems.map((item) => (
          <li key={item.label}>
            <a href={item.href} className={styles.link} onClick={onNavigate}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Dropdown>
  )
}

/**
 * "For you dropdown" (565:2838, 565:2864, 565:2878, 565:2891): four links beside a photo. The four Figma
 * frames are one menu in four states; hovering or focusing an item highlights it and brings in its photo.
 * Each time the menu opens it starts on Founders.
 */
export function ForYouMenu(props: Omit<DropdownProps, 'id' | 'label' | 'children'> & { onNavigate: () => void }) {
  const { onNavigate, ...rest } = props
  const [active, setActive] = useState(0)
  const [wasOpen, setWasOpen] = useState(props.open)
  if (props.open !== wasOpen) {
    setWasOpen(props.open)
    if (props.open) setActive(0)
  }

  return (
    <Dropdown id="for-you" label="For You" {...rest}>
      <div className={styles.row}>
        <ul className={styles.links}>
          {audienceItems.map((item, index) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={styles.link}
                data-active={index === active || undefined}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={onNavigate}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.photo}>
          {audienceItems.map((item, index) => (
            <img
              key={item.label}
              src={item.photo}
              width={148}
              height={120}
              alt=""
              decoding="async"
              fetchPriority="low"
              data-active={index === active || undefined}
            />
          ))}
        </div>
      </div>
    </Dropdown>
  )
}

/** The Resources card: 1 + 8 + 12 from its edge to the item text; 562 wide (Figma). */
const MENU_INSET = 21
const RESOURCES_WIDTH = 562
const EDGE_MARGIN = 16

/**
 * "Dropdown / Resources" (942:6996): two columns of items (title 600 14, line 400 14 #5b5b58); Changelog
 * and Developer Docs carry the external-link icon. "All resources" with an arrow below a 1px line. Items
 * without a page yet are shown but are not links.
 */
export function ResourcesMenu(props: Omit<DropdownProps, 'id' | 'label' | 'children'> & { onNavigate: () => void }) {
  const { onNavigate, ...rest } = props
  const columnsRef = useRef<HTMLDivElement>(null)

  // The card starts under the "Resources" label (text aligned, 21px inset), always two columns. Where
  // that would run past the window's edge (narrower laptops), it moves left just enough to stay on
  // screen (--shift on the card). Measured while closed too: the hidden card still takes up room, and
  // unshifted it would widen the page.
  useLayoutEffect(() => {
    const measure = () => {
      const card = columnsRef.current?.parentElement
      const item = card?.closest('li')
      if (!card || !item) return
      const left = item.getBoundingClientRect().left - MENU_INSET
      const shift = Math.max(0, left + RESOURCES_WIDTH - (document.documentElement.clientWidth - EDGE_MARGIN))
      card.style.setProperty('--shift', `${shift}px`)
    }
    measure()
    // The label moves once the web font has loaded.
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [props.open])

  return (
    <Dropdown id="resources" label="Resources" {...rest}>
      <div ref={columnsRef} className={styles.columns}>
        {resourceMenu.columns.map((column, i) => (
          <ul key={i} className={styles.column}>
            {column.map((item) => {
              const content = (
                <>
                  <span className={styles.itemTitle}>
                    {item.label}
                    {item.external && <img src="/assets/resources/external.svg" width={16} height={16} alt="" />}
                  </span>
                  <span className={styles.itemText}>{item.description}</span>
                </>
              )
              return (
                <li key={item.label}>
                  {item.href ? (
                    <a href={item.href} className={styles.resource} onClick={onNavigate}>
                      {content}
                    </a>
                  ) : (
                    <span className={`${styles.resource} ${styles.inactive}`}>{content}</span>
                  )}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
      <div className={styles.menuFoot}>
        <a href={resourceMenu.all.href} className={styles.allLink} onClick={onNavigate}>
          {resourceMenu.all.label}
          <img src="/assets/resources/arrow-right-green.svg" width={16} height={16} alt="" />
        </a>
      </div>
    </Dropdown>
  )
}
