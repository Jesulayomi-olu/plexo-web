# Plexo landing page

A build of the Figma frame **"Home page V2"** from the file *Plexo 2026* (node `532:23980`), made with Next.js (App Router), React, TypeScript and Framer Motion. The Figma file is the source of truth. At a 1440px-wide window the page matches the design's 1440 × 11815 layout (the build starts 1px higher: Figma's nav sits at y = 1).

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build in .next/ (the page is prerendered as static HTML)
npm run start     # serve the production build
```

Add `?capture` to the URL (for example `http://localhost:3000/?capture`) to turn off animations and show the static design. Use it when comparing screenshots against Figma. Add `?preview` to see proposed motion that isn't live yet (see `MOTION.md`).

## Pages

| Route | Figma frame |
|---|---|
| `/` | Home page V2 (532:23980) |
| `/pricing` | Pricing (571:11306) |
| `/for-you/founders`, `/coaches`, `/small-business`, `/designers` | For You (571:12846, 571:13665, 571:14526, 571:8810) |
| `/features/sol` | Build with Sol (575:15481) |
| `/features/drag` | Design with a Drag (644:21396) |
| `/features/mcp` | MCP and API (668:27186, "Mcp and AI") |
| `/features/ecommerce` | E-commerce (731:12626) |
| `/features/email` | Email & Marketing (736:14779, named "E commerce" in the file) |

The Figma frames of these pages still carry the old footer; they use the shared one. Their hidden frames (pricing, social proof and the like) are left out.

| Route | Figma frame |
|---|---|
| `/resources` | Resources hub (683:34865) |
| `/resources/blog` | Blog (718:8690); `?q=` narrows it by title (the hub's search sends you here) |
| `/resources/blog/[article]` | Blog article (894:5341); every article shares Figma's placeholder body for now |
| `/resources/templates` | Templates (718:9219) |
| `/resources/customer-stories` | Customer stories (718:10560) |

The nav's Resources menu is Figma 942:6996. Blog, Templates and Customer stories show "Back to Resources" only when opened from the Resources page (its links add `?from=resources`), as Figma's note on 718:9065 asks. Articles, templates and stories are sample content in `src/sections/resources/data.ts` until a CMS feeds them; their pictures are Figma's placeholders.

## Structure

| Path | What it is |
|---|---|
| `src/index.css` | Design tokens taken from Figma (colours, type, gutters, focus ring) and global styles |
| `src/components/Button.tsx` | The Figma **Button** component (Primary, Secondary, Outline, Contrast, White) with the design system's Hover, Pressed and Focus colours |
| `src/components/PromptBox.tsx` | The prompt box: the tall hero variant, the one-line final-CTA variant, the For You card and the flat Build with Sol panel |
| `src/components/Divider.tsx` | The dashed divider with star ornaments (hero top and bottom, footer band) |
| `src/components/Reveal.tsx`, `BlurIn.tsx` | Entrance animations; off for users who prefer reduced motion and in `?capture` mode |
| `src/sections/*` | One component with its own CSS module per Figma section, in page order (see `src/app/page.tsx`) |
| `src/sections/features/*` | Sections of the product pages: the line-photo hero (`FeatureHero`), the feature-card grids (`FeatureCards`), the Drag hero and block showcase, the stacking developer tiles (`DevStack`), "You Stay In Charge", the email statement and campaign diagram, and the hero pictures (`StoreMock`, `EmailMock`). Pages also reuse home, pricing, For You and Build with Sol sections with props (`Mcp variant="page"`, `FeatureStrip variant="mcp"`, `SolSteps variant`, `Solutions title`, `Faq variant="ecommerce"`, `PricingCta` with a link, a prompt box or its heading box) |
| `public/assets/features/` | Product page artwork: the editor screenshots and email picture (exported from Figma at 2×, WebP), the line-pattern tiles and SVG icons |
| `src/app/layout.tsx` | The HTML shell: metadata, fonts (loaded with `next/font`) and global styles |
| `public/assets/v2/` | Artwork exported from Figma at 2× (WebP) and SVG logos and icons |
| `MOTION.md` | Every animation on the page, with the vocabulary used to discuss motion |

## Responsive behaviour

These layouts were derived from the desktop design (same colours, type, radii and shadows) before the file's mobile design, "Home page V2 · Mobile" (527:2678), was found. The phone layout does not follow that design yet. Current behaviour:

- **1200px and wider:** the desktop layout. The content column is 1280px at most, centred, with 80px side margins. Fixed compositions (the AI panel, the MCP diagram) scale down uniformly below 1440.
- **768–1199px:** 40px side margins; grids drop to two columns or stack.
- **Under 768px:** 20px side margins; one column (two plans per row in Pricing); the MCP diagram becomes a vertical flow; tab rows scroll sideways. Type follows the design system's *mobile/** text styles (Figma page "Design system" → Typography): section headings 32/36.8 (heading/h2), body 14/21 (body/md), card text 12/18 (body/sm) and so on; the hero heading uses heading/h2 (32px) rather than h1. Buttons use Size=Large (48px), as the system specifies for main actions on mobile.

## Interactions

- Buttons use the design system's hover, pressed and focus states.
- From 768px up, *Features*, *For You* and *Resources* in the nav open menus (Figma 565:2852; 565:2838 and its three siblings; 942:6996). With a mouse they open on hover; with touch, on a tap. From the keyboard, Enter, Space or ↓ opens them, ↑ ↓ move through the links and Esc closes. In *For You*, the hovered or focused audience shows its own photo. The menu items live in `src/sections/navData.ts`, shared with the phone menu.
- On phones the bar follows Figma "Mobile navigation" (logo, a Small "Start free", menu button). The menu button opens the menu (Figma 555:2757 / 555:2816) as a 320px drawer from the right, with the page dimmed beside it: Features, For You and Resources expand in place, one at a time. While it is open the page behind can't scroll or take focus; Esc or a tap on the dimmed page closes it.
- The feature strip and the template row glide slowly in a loop and pause on hover.
- The three step cards pin and stack as you scroll (each one readable before the next arrives), on every screen size. On the MCP and API page, the five developer tiles beside the code window stack the same way.
- *Plexo is for everyone* is a set of keyboard-accessible tabs with a sliding underline.
- The *Drag and drop* cards expand on hover, focus or click.
- The MCP diagram's dashes flow toward Plexo and the live site.
- The Developers code window is built live (not an image) and its code types itself out once it scrolls into view.
- The Monthly/Yearly toggle switches the Starter and Pro prices.
- *Built with Plexo* scrolls sideways (swipe, or the arrows once there are more stories than fit). "View Prompt" opens the prompt dialog over its card (over the whole screen on phones); it is not on the page until pressed, and "Copy" copies the prompt.
- The FAQ is an accordion with one item open at a time; the open item's plus turns into a minus. The pricing page has its own questions (Figma "FAQ Pricing", 613:19248) and opens on the last one, as its Figma instance does. Build with Sol and E-commerce have their own too; E-commerce's answers are not in Figma yet (see `src/sections/Faq.tsx`).
- The footer (Figma 814:5666) is shared by every page. Its email field checks the address but isn't connected to a mailing list yet, and items with no page yet (Log in, Help center, the Company and legal links, the social icons) are plain text until they get a URL in `src/sections/Footer.tsx`.
- On small screens the nav collapses into a menu.
