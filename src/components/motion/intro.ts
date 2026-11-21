import { useSyncExternalStore } from 'react';
import { BOOKING_PATH } from '../../booking';
import { stripBase } from '../../router';

/**
 * Tiny store that tells hero animations when the first-visit preloader has finished,
 * so they play in view instead of behind the loader.
 */

const SESSION_KEY = 'travellah-intro-seen';

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function shouldShowPreloader(): boolean {
  if (typeof window === 'undefined' || prefersReducedMotion()) return false;
  // The booking page opens in a new tab and should show the form straight away.
  if (stripBase(window.location.pathname) === BOOKING_PATH) return false;
  try {
    return !window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return true;
  }
}

let introDone = typeof window === 'undefined' ? true : !shouldShowPreloader();
const listeners = new Set<() => void>();

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* storage blocked: the loader just shows again next visit */
  }
}

export function finishIntro() {
  if (introDone) return;
  introDone = true;
  listeners.forEach((l) => l());
}

export function useIntroDone(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => introDone,
    () => true,
  );
}
