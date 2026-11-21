/**
 * Blocks page zoom. The viewport meta tag handles most browsers; this covers the rest:
 *  - iOS Safari ignores `user-scalable=no`, so pinch gestures are cancelled here
 *  - desktop trackpad pinch and Ctrl/⌘ + mouse wheel (both arrive as wheel events with ctrlKey)
 *  - Ctrl/⌘ with +, −, = or 0 on the keyboard
 * Double-tap zoom is stopped in CSS with `touch-action: manipulation`.
 * Note: the browser's own menu zoom cannot be blocked by a web page.
 */
export function preventZoom() {
  const block = (event: Event) => event.preventDefault();

  // iOS Safari pinch (non-standard gesture events)
  document.addEventListener('gesturestart', block, { passive: false });
  document.addEventListener('gesturechange', block, { passive: false });
  document.addEventListener('gestureend', block, { passive: false });

  // Two-finger touch moves (pinch) on other touch browsers
  document.addEventListener(
    'touchmove',
    (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    },
    { passive: false },
  );

  // Trackpad pinch and Ctrl/⌘ + mouse wheel
  window.addEventListener(
    'wheel',
    (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    },
    { passive: false },
  );

  // Ctrl/⌘ + plus, minus, equals or zero
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (['+', '-', '=', '_', '0'].includes(event.key) || ['Equal', 'Minus', 'NumpadAdd', 'NumpadSubtract', 'Digit0', 'Numpad0'].includes(event.code)) {
      event.preventDefault();
    }
  });
}
