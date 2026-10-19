# Plexo motion guide

The motion vocabulary we use on this site, and where each kind of motion appears. Keep this file up to date when motion is added or changed.

## Vocabulary

### Easing: the speed curve of a movement

Easing describes timing, not the kind of movement. Every movement has one. A live demo is at `/motion-lab.html` when the dev server is running.

| Term | Feel | Typical use |
|---|---|---|
| Linear | Constant speed; mechanical | Progress bars, endless marquees |
| Ease-in | Starts slow, ends fast | Things leaving the screen |
| Ease-out | Starts fast, ends slow; arrives and settles | Entrances (our default) |
| Ease-in-out | Slow, then fast, then slow; calm | Loops, moving between two places |
| Spring | Overshoots slightly, then settles; physical | Hover lifts, tilts, pops |

### When motion plays

| Family | Meaning |
|---|---|
| Entrance | Plays once, the first time something appears |
| Triggered | Plays when something happens: a hover, a click, a card changing |
| Idle loop | Runs continuously while visible |
| Scroll-linked | Driven directly by scroll position |
| Transition | Animates between two states, e.g. one tab's content replacing another's |

### Kinds of motion

| Name | What it does |
|---|---|
| Fade-up (reveal) | Fades in while rising a few pixels |
| Blur-to-focus (blur-in) | Starts blurred and nearly transparent, then sharpens while fading in (Linear-style) |
| Rise & settle | Rises into place from below, with a soft slowdown or a tiny overshoot |
| Pop | A quick springy squash-and-stretch |
| Float | Bobs gently up and down |
| Bounce | Lifts, drops, rebounds slightly and settles, like a light ball landing |
| Wave (ripple) | The same motion running through a group one item after another, like a stadium wave |
| Typing indicator | Three dots in a chat bubble brightening and rising in turn (a wave) to show someone is typing |
| Sway (rock) | Tilts slowly back and forth |
| Turn (flip) | A 3D spin around an axis |
| Draw-on (line draw) | Outlines draw themselves line by line, then the fills fade in |
| Crossfade | One element fades out as another fades in, in the same place |
| Stagger | The same motion on several items, each starting slightly after the last |
| Tilt (parallax tilt) | An element turns toward the cursor |
| Morph / layout animation | An element smoothly changes size or position, e.g. an expanding card or a sliding tab underline |
| Spotlight | One item emphasised while the others dim |
|## Where motion is used

Home page V2 (Figma 532:23980).

| Section | Motion | Details |
|---|---|---|
| Nav menus (Features, For You) | Fade + small drop (triggered); crossfade | The card fades in while settling 4px into place (160–200ms, ease-out; closing 120ms), after an 80ms hover pause that stops menus flashing open as the pointer sweeps across the bar. A 160ms grace period on leaving. The chevron turns to point up. In For You, the photo crossfades (220ms) to the hovered item's. Reduced motion: fade only |
| Phone menu | Fade (triggered); accordion; icon crossfade | The menu fades in (0.18s) and its rows fade down 4px in turn (0.04s apart). Features / For You open with a height + opacity accordion (0.3s, ease-out) and their chevron turns. The menu icon turns into an X (crossfade with a 45° turn). Reduced motion: instant |
| Hero: eyebrow, heading, subtitle | Blur-to-focus entrance, staggered | Starts at 0.45s, 0.65s and 1.05s; 10px, 16px and 8px blur; ease `focusEase` (0.33, 1, 0.68, 1); `BlurIn` component |
| Hero: prompt box | Fade-up | Starts at 1.3s |
| Hero: prompt text | Typewriter placeholder (idle loop) | Types "A store for my skincare brand...", "A sales funnel for my coaching program...", "A landing page for my product launch..." in turn: types, holds 1.9s, deletes, next. Stops while the field is focused or filled; reduced motion shows the Figma placeholder. On phones it stays on one line: long text slides left, its start fading, so the caret stays in view |
| Feature strip | Ticker (idle loop) | The feature list glides left, one full loop every 32s, with soft fading edges; pauses on hover |
| Steps | Scroll stack, with holds and a peek | The step cards pin in the viewport (scaled down to fit short windows). Each card holds, fully readable, while the top of the next one peeks 32px in at the bottom of the window; scrolling on, the next card rises from there (ease-in-out) to stack on it. Pace in px of scroll: hold 200 / rise 460 on desktop, hold 120 / rise 380 on phones; spring-smoothed; ends on the Figma stack. Phones stack a column version of the cards, 52px apart, step number on top. Reduced motion lists the three cards in full |
| Start with a template | Ticker (idle loop), hand-scrollable | The row glides left at 24px/s in an endless loop. Visitors can take over: trackpad swipe or shift + wheel, drag with a mouse or finger (with momentum on release), or the arrow keys when focused. The glide pauses on hover and while interacting, and resumes 1.4s after. Vertical scrolling always moves the page. Reduced motion: manual only |
| Section headings, cards, rows | Fade-up entrances (stagger), hover lift | `Reveal` component |
| Plexo is for everyone | Tab underline morph; panel crossfade | Keyboard-accessible tabs |
| AI: card icons | Draw-on (stagger), float (idle loop), tilt toward the cursor (spring) | When the cards are half on screen each icon draws itself, 0.35s apart, then floats 6px over 3.6s |
| Drag and drop | Morph (card expands on hover, focus or click) | Framer Motion layout animation; the text fades in once the card has opened |
| MCP | Flowing dashes (idle loop) + ping | Dashes travel along the connectors toward Plexo and on to the live site (one dash period every 0.9s); the output dot pings every 2.4s; pauses off screen |
| Developers: code window | Typewriter (plays once) | When the panel is 40% on screen, the quickstart types itself out after 0.5s, about 6.5s in all: slightly uneven speed, a beat at each line end (longer before blank lines), indentation at once. The caret is solid while typing and blinks once finished, as in the hero prompt. Untyped code keeps its space, so nothing moves. Pauses off screen and carries on when back. Reduced motion: the full code at once |
| Developers: tiles | Hover lift; the corner brackets step outward | |
| Pricing | Toggle pill morph, price crossfade | Monthly / Yearly |
| Built with Plexo | Horizontal scroller with arrows | Swipe on touch; the arrows move one card |
| Built with Plexo: prompt dialog | Fade (triggered); rise & settle | Only after "View Prompt" is pressed: the card dims (fade, 0.18s) and the dialog rises 8px from 98% scale into place (0.22s, ease-out); closing reverses it faster. A peeking card first scrolls fully into view. Reduced motion: fade only |
| FAQ | Accordion height and opacity; plus turns into minus | All closed at first |

## Proposed (preview only)

Open the site with `?preview` to see these. They are not live on the normal URL until approved.

| Section | Motion | Details |
|---|---|---|
| Plexo is for everyone | Crossfade + settle zoom | The new photo fades in at 106% and settles to 100% over 2.4s |
| Drag and drop | Pick-up (triggered) | When "Start with ready made blocks" opens, the Testimonials chip dips into its slot and lifts back out |
| Pricing | Number roll (odometer) | Only the changed digits roll; the "Billed annually" line folds open |
| FAQ | Fade + rise | The answer rises 6px as it fades in |
| Final CTA | Blur-in on scroll | The prompt box sharpens into focus when reached |
| Footer | Rise + blur-in | The giant Plexo logo rises out of the footer's bottom edge while coming into focus |

Retired with the redesign (their sections are gone or changed): the Problem count-ups and typing dots, What you get draw-on, the Platform orbit, float and bounce wave, the How it works blur crossfade, the old MCP packet flow and the Developers line-by-line code reveal.

## Phones and tablets

| Section | Adaptation |
|---|---|
| MCP | Below 768px the diagram becomes a vertical flow (labels on top, junction, Plexo, live site) with the same flowing dashes |
| AI cards | Cursor tilt is mouse-only |
| Hero prompt | One line (an input instead of the multi-line area); the helper row keeps only "Start with a template" and the trial note, side by side |

parallax are mouse-only; on touch, cards stay still apart from their loops |
| Platform | Below 1200px the orbit layout becomes a grid; see the Platform (tablet, phone) row |
| Footer | The wordmark rise triggers on its band, so it plays even though the page ends there |

## Rules

- **Plays once:** entrances play once and are never tied to scroll unless stated.
- **Reduced motion and capture mode:** visitors with reduced motion, and the `?capture` screenshot mode, see the final static design (`useStaticMotion`).
- **Performance:** animate transforms, opacity and filters on small elements; avoid redrawing large blurs every frame.
- **Idle loops must be visible:** 5–7s periods with 10px+ of travel, or a periodic event. Slower or smaller reads as no motion at all.
- **Off screen:** idle loops pause when their section is off screen.
- **Auto-advancing content:** anything that advances on its own must pause on hover or focus and offer manual controls.
