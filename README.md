# Plexo landing page

A build of the Figma frame **"Home page"** from the file *Plexo 2026* (node `234:672`), made with Vite, React, TypeScript and Framer Motion. The Figma file is the source of truth. At a 1440px-wide window the page matches the design's 1440 × 13127 layout.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Add `?capture` to the URL (for example `http://localhost:5173/?capture`) to turn off entrance animations. Use it when comparing screenshots against Figma.

## Structure

| Path | What it is |
|---|---|
| `src/index.css` | Design tokens taken from Figma (colours, type, gutters, focus ring) and global styles |
| `src/components/Button.tsx` | The Figma **Button** component (Primary, Secondary, Outline, Contrast) with the design system's Hover, Pressed and Focus colours |
| `src/components/PromptBox.tsx` | The prompt box shared by the hero and the final CTA |
| `src/components/Reveal.tsx` | Scroll entrance animation; off for users who prefer reduced motion and in `?capture` mode |
| `src/sections/*` | One component with its own CSS module per Figma section, in page order (see `src/App.tsx`) |
| `public/assets/` | Product mockups and photos exported from Figma at 2× (WebP), plus SVG icons |

## Responsive behaviour

The file has no mobile design, so the smaller layouts are derived from the desktop one using the same colours, type, radii and shadows:

- **1200px and wider:** the desktop layout. The content column is 1280px at most, centred, with 80px side margins.
- **768–1199px:** 40px side margins; grids drop to two columns or stack.
- **Under 768px:** 20px side margins; one column; headings at 32px (40px in the hero); tab rows scroll sideways.

## Interactions

- Buttons use the design system's hover, pressed and focus states.
- The hero badges and the Platform feature cards drift slowly.
- Steps in *How it works* switch on click.
- *Who it's for* is a set of keyboard-accessible tabs with a sliding underline.
- The *Drag and drop* cards expand on hover, focus or click.
- The Monthly/Yearly toggle switches the Starter and Pro prices.
- The *Built with Plexo* cards scroll sideways.
- The FAQ is an accordion with one item open at a time; the open item's plus turns into a minus.
- On small screens the nav collapses into a menu.
