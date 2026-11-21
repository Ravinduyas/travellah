import { ROUTES } from '../../data/travelData';
import type { JourneyType, TransferDirection } from '../../utils/travelLogic';

/**
 * Unfinished bookings are saved in the visitor's own browser (Zeigarnik effect: people
 * come back to finish what they started). Nothing leaves the device. Storage can be
 * blocked or cleared, so every access is wrapped and the site works without it.
 */

const KEY = 'travellah-booking-draft';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface BookingDraft {
  direction: TransferDirection;
  journey: JourneyType;
  townId: string;
  passengers: number;
  vehicleId: string;
  date: string;
  time: string;
  flightNumber: string;
  hotel: string;
  fullName: string;
  email: string;
  notes: string;
  step: number;
  maxReached: number;
  savedAt: number;
}

export function loadDraft(): BookingDraft | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as BookingDraft;
    if (!draft.townId || Date.now() - draft.savedAt > MAX_AGE_MS) return null;
    // ignore drafts for a town that is no longer offered
    if (!ROUTES.some((r) => r.id === draft.townId)) return null;
    return draft;
  } catch {
    return null;
  }
}

export function saveDraft(draft: Omit<BookingDraft, 'savedAt'>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    /* storage unavailable: nothing to do */
  }
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: nothing to do */
  }
}
