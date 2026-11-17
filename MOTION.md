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

Home page V2 (Figma 1166:14994).

| Section | Motion | Details |
|---|---|---|
| Nav menus (Features, Solution, Resources) | Fade + small drop (triggered); crossfade | The card fades in while settling 4px into place (160–200ms, ease-out; closing 120ms), after an 80ms hover pause that stops menus flashing open as the pointer sweeps across the bar. A 160ms grace period on leaving. The chevron turns to point up. In Solution, the photo crossfades (220ms) to the hovered item's. Reduced motion: fade only |
| Phone menu | Slide-in drawer (triggered); accordion; icon crossfade | The drawer slides in from the right (0.3s, ease-out) while the page behind dims; it slides back out on close. Its rows fade down 4px in turn (0.04s apart). Features / Solution / Resources open with a height + opacity accordion (0.3s, ease-out) and their chevron turns. The menu icon turns into an X (crossfade with a 45° turn). Reduced motion: instant |
| Hero: heading, lead | Blur-to-focus entrance, staggered | Starts at 0.45s and 0.85s; 16px and 8px blur; ease `focusEase` (0.33, 1, 0.68, 1); `BlurIn` component |
| Hero: buttons, picture | Fade-up | Start at 1.1s and 1.3s; on a short screen, the picture fades up as soon as it is scrolled to, without waiting out its delay |
| Hero: the boxed word | Typewriter (idle loop) | "Business" (the Figma text) holds 1.5s from load, then is deleted and "Products" and "Services" are typed in turn, near-instantly so a change never reads as loading: deleted at 12ms a letter, a 0.12s pause, typed at about 26ms a letter (slightly uneven), so a swap takes about 0.45s; each word then holds 1.5s. The hand-drawn box keeps the width of the word being typed or deleted and eases (0.22s, ease-out) to the next word's width in the pause. The caret is solid while typing and blinks while holding. Pauses off screen and resumes where it stopped. Screen readers get "Get Your Business Online Without Any Stress". Reduced motion: "Business", no caret. `useWordTypewriter` |
| Hero: picture | Storyboard loop (9.2s), after Figma "Hero storyboard" (1133:16152) and the reference cut | Nothing plays until the visitor reaches the picture (60% of it on screen); until then it shows the empty prompt. From then it starts at once (if the picture is on screen at load, as it fades up). The prompt types itself (26ms a letter); a cursor flies in on a curve, slightly motion-blurred, and clicks "Build" (press: cursor and button dip, the field dims). The box morphs (0.5s, ease-out) into the shorter "Plexo is thinking..." pill, a light band sweeping through the text, then into the "Your site is live" card: its parts blur into focus in turn and the check pops (spring). The cursor clicks "View site" and the card blows out (scale up, blur, fade); the site rises in its desktop window, the phone slides in from the left and the three chips pop in (spring, 0.12s apart) and bob. After 3.2s it all sweeps left with motion blur and the empty prompt fades back in. It loops for as long as any of the picture is on screen. Once the picture has left the screen it stops and rewinds, so the next visit starts from the beginning. There is no pause button and no pause on hover (the design team's call). Below 1280 the 1280×339 composition scales with the picture (at least 0.75 on tablets, 0.5 on phones). Reduced motion and capture mode: storyboard frame 1. `HeroStory` |
| Feature strip | Ticker (idle loop) | The feature list glides left, one full loop every 44s (the same speed as before with the longer list), with soft fading edges; pauses on hover |
| Build with AI | Flowing dashes (idle loop) + ping; fade-up (stagger) | Dashes travel along the connectors toward Plexo and on to the live site, and the output dot pings; both pause off screen. The four step cards on the photo fade up in turn |
| Built around the way you create | Tab crossfade; height morph; template glide (idle loop) | The panels crossfade (0.28s) while the panel area eases to the new tab's height (0.45s). The other tabs' pictures load once the section is 400px away. In "Start with a template", the template row glides left in an endless loop at 24px/s (as the earlier home page's template row), starting from the Figma position; Fieldnote, just out of view in Figma, comes round with the rest. Visitors can take over with a swipe, a drag (a little momentum on release) or the arrow keys; it pauses on hover and while in use, and resumes 1.4s after. Pauses off screen. Reduced motion: instant tabs, no glide (the row still moves by hand). `useGlide` |
| Section headings, cards, rows | Fade-up entrances (stagger), hover lift | `Reveal` component |
| See what people are building | Horizontal scroller with arrows | Swipe on touch; the arrows move one story |
| Pricing | Toggle pill morph, price crossfade | Monthly / Yearly |
| FAQ | Accordion height and opacity; plus turns into minus; unfold | Opens on the first question. "See more" unfolds the last 7 questions (height 0.45s ease-out, opacity 0.35s) and its chevron turns up; they fade up in turn as they appear. "See less" folds them away (opacity 0.2s) |

Shared sections that now appear only on other pages keep their motion:

| Section | Motion | Details |
|---|---|---|
| MCP (MCP and API page) | Flowing dashes (idle loop) + ping | Dashes travel along the connectors toward Plexo and on to the live site (one dash period every 0.9s); the output dot pings every 2.4s; pauses off screen |
| Code window (MCP and API page; For Developers hero) | Typewriter (plays once) | When the panel is 40% on screen, the quickstart types itself out after 0.5s, about 6.5s in all: slightly uneven speed, a beat at each line end (longer before blank lines), indentation at once. The caret is solid while typing and blinks once finished. Untyped code keeps its space, so nothing moves. Pauses off screen and carries on when back. Reduced motion: the full code at once |

Build with Sol, `/features/sol` (Figma 575:15481): the sections only use the shared entrances. "You direct. AI builds it live." is a still (the gym prompt and its Iron & Grain site), not an animation.

The other product pages, `/features/drag`, `/features/mcp`, `/features/ecommerce` and `/features/email`, use the shared entrances (heroes blur into focus as on Build with Sol; cards, rows and panels fade up) and the home sections they reuse keep their motion (MCP flowing dashes, the strip's ticker, the code window's typewriter). One addition:

| Element | Motion | Notes |
|---|---|---|
| Email & Marketing: "Launch the whole campaign." diagram | Sequence (plays when reached; rewinds off screen) | Once 40% of the panel is on screen (~4s): your message card drops in (spring) and types "Black Friday. 30% off. Ends Sunday." (32ms a letter, solid caret) while the "You" cursor pops in; the dashed line draws down to Plexo (top to bottom, 0.45s); Plexo's reply drops in and its two lines write themselves from the left; the lines out to the results draw; Page, Email and Reminder drop in 0.15s apart, each ticking its check 0.35s after it lands. Once the panel has left the screen it rewinds, so the next visit plays it from the start. Phones: the same order down the column. Reduced motion and capture mode: the finished diagram. `features/Campaign` |
| MCP and API: "Prompt from your terminal." tiles | Scroll stack, with holds and a peek (as the former home Steps) | Figma's note on 669:29126. The row (the code window and the five tiles) pins in the viewport, scaled down to fit short windows; below 1200 the code window and the tiles pin together, one above the other. At first only "Webhooks" shows. Each tile holds, fully readable, while the top of the next peeks 32px in at the bottom of the window, then rises (ease-in-out) to land 72px below the last, which stays underneath. Pace in px of scroll: hold 120 / rise 260 on desktop, hold 100 / rise 240 below 1200; spring-smoothed; ends on the Figma stack, then the page scrolls on. Reduced motion lists the five tiles in full; capture mode shows the Figma stack |

Sign-up, log-in and password-reset screens (`/signup`, `/login`, `/forgot-password`, `/reset-password` and their next steps; `src/sections/auth/*`):

| Element | Motion | Details |
|---|---|---|
| Form | Fade-up on load | The title (and lead) rise 12px into place while fading in (0.6s, ease-out); the rest of the form follows 0.08s later. Each screen does this when it opens; the panel stays put while you move between screens |
| Panel tagline, quote | Blur-to-focus; fade-up | The tagline comes into focus on load (8px blur, 1.2s); the quote fades up 0.35s later. The arrows switch quotes with a short crossfade (out 6px up, in 6px from below; 0.3s each); an arrow with nowhere to go turns grey (icon crossfade, 0.16s) |
| Password checklist | Height + opacity | "Password must contain :" folds open under the field (0.3s, ease-out) when it takes focus, and folds away when it's done with. A rule that's met: its border turns green (0.2s) and the filled check pops in (scale 0.6 → 1) over the outline one |
| Field messages | Height + opacity | Error messages fold open under their field (0.3s) and fold away when fixed; the red border fades in (0.16s), as does the focus border |
| Show / hide password | Crossfade | The eye and crossed-out eye crossfade (0.16s) |
| "Resend link" confirmation | Fade + small drop | "We’ve sent you a new link." fades in under the line, 4px from above (0.3s), and fades out after 5s |

Reduced motion and capture mode: everything appears in its final state at once.

## Proposed (preview only)

Open the site with `?preview` to see these. They are not live on the normal URL until approved.

| Section | Motion | Details |
|---|---|---|
| Pricing | Number roll (odometer) | Only the changed digits roll; the "Billed annually" line folds open |
| FAQ | Fade + rise | The answer rises 6px as it fades in |
| Footer | Rise + blur-in | The giant Plexo logo rises out of the footer's bottom edge while coming into focus |

Retired with the redesigns (their sections are gone or changed): the Problem count-ups and typing dots, What you get draw-on, the Platform orbit, float and bounce wave, the How it works blur crossfade, the old MCP packet flow and the Developers line-by-line code reveal. With the November 2026 home page: the hero prompt's typewriter placeholder, the Steps scroll stack, the template section (its glide lives on in *Built around the way you create*), the Plexo is for everyone tabs, the AI card icons and the Drag and drop cards, with the proposed photo zoom, chip pick-up and final CTA blur-in that went with them. With the Solution pages (November 2026): the Built with Plexo story card and its prompt dialog (replaced by the home stories).

## Phones and tablets

| Section | Adaptation |
|---|---|
| Hero heading | The two-line composition scales with the screen (32px at most); the boxed word and its box scale with it |
| MCP, Build with AI | Below 768px the diagrams become vertical flows with the same flowing dashes |
| Built around the way you create | Below 1024px the panels stack (copy above the picture); on phones the tabs scroll sideways |
| Footer | The wordmark rise triggers on its band, so it plays even though the page ends there |
| Sign-up, log-in and reset screens | Below 1024px the panel is a band with just the logo (no tagline or quotes); the form motion is the same |

## Rules

- **Plays once:** entrances play once and are never tied to scroll unless stated.
- **Reduced motion and capture mode:** visitors with reduced motion, and the `?capture` screenshot mode, see the final static design (`useStaticMotion`).
- **Performance:** animate transforms, opacity and filters on small elements; avoid redrawing large blurs every frame.
- **Idle loops must be visible:** 5–7s periods with 10px+ of travel, or a periodic event. Slower or smaller reads as no motion at all.
- **Off screen:** idle loops pause when their section is off screen.
- **Auto-advancing content:** anything that advances on its own must pause on hover or focus and offer manual controls. Exception: the hero storyboard loops without controls, as the design team asked (see its row); reduced motion still shows it as a still.
