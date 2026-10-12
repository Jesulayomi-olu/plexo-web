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

## Where motion is used

| Section | Motion | Details |
|---|---|---|
| Hero: eyebrow, heading, subtitle | Blur-to-focus entrance, staggered | Starts at 0.45s, 0.65s and 1.05s; 10px, 16px and 8px blur; ease `focusEase` (0.33, 1, 0.68, 1); `BlurIn` component |
| Hero: prompt box | Fade-up | Starts at 1.3s |
| Hero: mockup | Rise & settle entrance | Rises 100px over 1.2s and scales from 97% to 100%; starts after the heading on load, or as soon as it scrolls into view |
| Hero: badges | Pop-in (stagger), then float (idle loop) | 0.75s, 0.9s and 1.05s after the mockup starts; float of 5px over 6s |
| Problem, What you get, Platform, etc. | Fade-up entrances (stagger), hover lift | `Reveal` component |
| How it works | Crossfade between steps; description expands | Click a step |
| Who it's for | Tab underline morph; panel crossfade | Keyboard-accessible tabs |
| AI: cards | One card at a time: blur-to-focus crossfade, 3s each, looping; progress bars | Pauses on hover or focus; on the first pass a scroll safety net makes sure all three are seen |
| AI: card icons | Draw-on entrance (each time a card appears), float (idle loop), tilt toward the cursor (spring) | Draws in 1.3s with lines 70ms apart; floats 6px over 3.6s |
| Drag and drop | Morph (card expands on hover, focus or click) | Framer Motion layout animation |
| Platform | Fade-up stagger, float (idle loop), hover lift | |
| Pricing | Toggle pill morph, price crossfade | Monthly / Yearly |
| Built with Plexo | Horizontal scroll with snap | |
| FAQ | Accordion height and opacity; plus turns into minus | |

## Proposed (preview only)

Open the site with `?preview` to see these. They are not live on the normal URL until approved.

| Section | Motion | Details |
|---|---|---|
| Hero: prompt box | Typewriter placeholder | Types, holds 1.9s, deletes, then the next of three prompts; stops while the field is focused or filled |
| Problem | Count-up + pop-in stagger | "23 unread" counts up while the message lines stack in; the five app tiles pop in while "$148/mo" counts up |
| Problem: Looking Small | Typing indicator (idle loop) | The three dots in the dark reply bubble run a wave: each brightens (30% to 100%) and rises 2px in turn, 0.15s apart, on a 1.2s loop. Pauses off screen |
| How it works | Blur crossfade | The outgoing screen softens away while the new one sharpens into focus (0.55s) |
| What you get | Pop + draw-on (stagger) | Badges spring in, then each icon draws itself |
| Who it's for | Crossfade + settle zoom | The new photo fades in at 106% and settles to 100% over 2.4s |
| Drag and drop | Pick-up (triggered) | When "Ready made blocks" opens, the Testimonials chip dips into its slot and lifts back out |
| MCP | Data flow | The prompt lights up; a packet travels to the Plexo hub (ping), then to the live site (glow); cycles Claude, ChatGPT, Cursor |
| Platform (desktop) | Orbit-in, then float + bounce wave + parallax | The cards sweep out from behind the heading on curved paths (once). Afterwards each card floats ±6px on its own 5.4–6.2s rhythm, and every 6.5s a bounce wave runs clockwise around the heading: each card lifts 12px, drops, rebounds 3px and settles, with a soft shadow and its icon popping. Cards follow the cursor slightly. The wave pauses while a card is hovered; both loops stop off screen |
| Platform (tablet, phone) | Fade-up, then bounce wave | The cards are a grid, so they fade up as they scroll in, and the bounce wave (8px) runs down the list in reading order every 6.5s |
| Developers | Line-by-line reveal | The code appears one line at a time |
| Pricing | Number roll (odometer) | Only the changed digits roll; the "Billed annually" line folds open |
| FAQ | Fade + rise | The answer rises 6px as it fades in |
| Final CTA | Blur-in on scroll | The prompt box sharpens into focus when reached |
| Footer | Rise + blur-in | The giant wordmark rises out of its clipped band while coming into focus |

## Phones and tablets

Everything above runs on touch screens, with these adaptations:

| Section | Adaptation |
|---|---|
| Hero prompt | When a typed prompt is wider than the field, the text aligns to its end so the caret stays visible, and the start fades out (as a real text field scrolls) |
| AI cards, Platform | Cursor tilt and parallax are mouse-only; on touch, cards stay still apart from their loops |
| Platform | Below 1200px the orbit layout becomes a grid; see the Platform (tablet, phone) row |
| Footer | The wordmark rise triggers on its band, so it plays even though the page ends there |

## Rules

- **Plays once:** entrances play once and are never tied to scroll unless stated.
- **Reduced motion and capture mode:** visitors with reduced motion, and the `?capture` screenshot mode, see the final static design (`useStaticMotion`).
- **Performance:** animate transforms, opacity and filters on small elements; avoid redrawing large blurs every frame.
- **Idle loops must be visible:** 5–7s periods with 10px+ of travel, or a periodic event. Slower or smaller reads as no motion at all.
- **Off screen:** idle loops pause when their section is off screen.
- **Auto-advancing content:** anything that advances on its own must pause on hover or focus and offer manual controls.
