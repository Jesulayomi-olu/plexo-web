# Plexo landing page

A build of the Figma frame **"Home page V2"** from the file *Plexo 2026* (node `532:23980`), made with Vite, React, TypeScript and Framer Motion. The Figma file is the source of truth. At a 1440px-wide window the page matches the design's 1440 × 11815 layout (the build starts 1px higher: Figma's nav sits at y = 1).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Add `?capture` to the URL (for example `http://localhost:5173/?capture`) to turn off animations and show the static design. Use it when comparing screenshots against Figma. Add `?preview` to see proposed motion that isn't live yet (see `MOTION.md`).

## Structure

| Path | What it is |
|---|---|
| `src/index.css` | Design tokens taken from Figma (colours, type, gutters, focus ring) and global styles |
| `src/components/Button.tsx` | The Figma **Button** component (Primary, Secondary, Outline, Contrast, White) with the design system's Hover, Pressed and Focus colours |
| `src/components/PromptBox.tsx` | The prompt box: the tall hero variant and the one-line final-CTA variant |
| `src/components/Divider.tsx` | The dashed divider with star ornaments (hero top and bottom, footer band) |
| `src/components/Reveal.tsx`, `BlurIn.tsx` | Entrance animations; off for users who prefer reduced motion and in `?capture` mode |
| `src/sections/*` | One component with its own CSS module per Figma section, in page order (see `src/App.tsx`) |
| `public/assets/v2/` | Artwork exported from Figma at 2× (WebP) and SVG logos and icons |
| `MOTION.md` | Every animation on the page, with the vocabulary used to discuss motion |

## Responsive behaviour

The file has no mobile design, so the smaller layouts are derived from the desktop one using the same colours, type, radii and shadows:

- **1200px and wider:** the desktop layout. The content column is 1280px at most, centred, with 80px side margins. Fixed compositions (the AI panel, the MCP diagram) scale down uniformly below 1440.
- **768–1199px:** 40px side margins; grids drop to two columns or stack.
- **Under 768px:** 20px side margins; one column (two plans per row in Pricing); the MCP diagram becomes a vertical flow; tab rows scroll sideways. Type follows the design system's *mobile/** text styles (Figma page "Design system" → Typography): section headings 32/36.8 (heading/h2), body 14/21 (body/md), card text 12/18 (body/sm) and so on; the hero heading uses heading/h2 (32px) rather than h1. Buttons use Size=Large (48px), as the system specifies for main actions on mobile.

## Interactions

- Buttons use the design system's hover, pressed and focus states.
- The feature strip and the template row glide slowly in a loop and pause on hover.
- The three step cards pin and stack as you scroll (each one readable before the next arrives), on every screen size.
- *Plexo is for everyone* is a set of keyboard-accessible tabs with a sliding underline.
- The *Drag and drop* cards expand on hover, focus or click.
- The MCP diagram's dashes flow toward Plexo and the live site.
- The Monthly/Yearly toggle switches the Starter and Pro prices.
- *Built with Plexo* scrolls sideways (swipe, or the arrows once there are more stories than fit).
- The FAQ is an accordion with one item open at a time; the open item's plus turns into a minus.
- On small screens the nav collapses into a menu.
