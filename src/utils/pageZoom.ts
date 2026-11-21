/**
 * The page is scaled up with CSS `zoom` on large screens (see index.css). Mouse positions
 * (clientX/Y) and getBoundingClientRect() are in screen pixels, while CSS lengths set on
 * elements are multiplied by the zoom. Divide screen distances by this before using them
 * as CSS lengths, so cursor effects stay under the cursor.
 */
export function pageZoom(): number {
  const zoom = Number.parseFloat(getComputedStyle(document.documentElement).zoom || '1');
  return Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
}
