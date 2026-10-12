/**
 * Prepare an inline Figma SVG for line-drawing: scale it to its box, hide it from assistive tech, and
 * give every path pathLength="1" (so stroke-dasharray works in fractions) plus an index (--k) used to
 * stagger the lines.
 */
export function prepareDrawableSvg(svg: string) {
  let k = 0
  return svg
    .replace(/<svg width="[^"]*" height="[^"]*"/, '<svg width="100%" height="100%" aria-hidden="true" focusable="false"')
    .replace(/<path /g, () => `<path pathLength="1" style="--k:${k++}" `)
}
