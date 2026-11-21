import type { AnchorHTMLAttributes } from 'react';
import { ROUTES } from './data/travelData';
import { withBase } from './router';
import { MAX_TRANSFER_PASSENGERS, type TransferDirection } from './utils/travelLogic';

/** The booking flow lives on its own page and always opens in a new tab. */
export const BOOKING_PATH = '/book';

export interface BookingPrefill {
  direction?: TransferDirection;
  town?: string;
  pax?: number;
}

/** /book?direction=…&town=…&pax=… (only the values that are set). */
export function bookingUrl(prefill: BookingPrefill = {}): string {
  const params = new URLSearchParams();
  if (prefill.direction) params.set('direction', prefill.direction);
  if (prefill.town) params.set('town', prefill.town);
  if (prefill.pax) params.set('pax', String(prefill.pax));
  const query = params.toString();
  return withBase(query ? `${BOOKING_PATH}?${query}` : BOOKING_PATH);
}

/** Reads and sanitises the prefill values from the booking page's URL. */
export function readBookingPrefill(params: URLSearchParams) {
  const direction: TransferDirection = params.get('direction') === 'drop' ? 'drop' : 'pickup';
  const townParam = params.get('town') ?? '';
  const townId = ROUTES.some((r) => r.id === townParam) ? townParam : '';
  const paxParam = Number(params.get('pax'));
  const passengers =
    Number.isInteger(paxParam) && paxParam >= 1 && paxParam <= MAX_TRANSFER_PASSENGERS ? paxParam : 2;
  return { direction, townId, passengers };
}

/** Opens the booking page in a new tab (call from a click or submit handler). */
export function openBooking(prefill: BookingPrefill = {}) {
  window.open(bookingUrl(prefill), '_blank', 'noopener,noreferrer');
}

interface BookingLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target'> {
  prefill?: BookingPrefill;
}

/** A plain link (not the in-app router) to the booking page, opening in a new tab. */
export function BookingLink({ prefill, children, ...rest }: BookingLinkProps) {
  return (
    <a href={bookingUrl(prefill)} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
