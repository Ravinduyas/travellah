export type TransferDirection = 'pickup' | 'drop';
export type JourneyType = 'one-way' | 'return';

export interface TripPricing {
  guests: number;
  total: number;
}

export interface TransferQuote {
  perLeg: number;
  legs: number;
  total: number;
}

export interface BookingFormInput {
  fullName: string;
  email: string;
  travelDate: string;
  guests: number;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof BookingFormInput, string>>;
}

export interface TransferFormInput {
  fullName: string;
  email: string;
  townId: string;
  date: string;
  time: string;
  flightNumber: string;
  passengers: number;
  direction: TransferDirection;
}

export interface TransferValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof TransferFormInput, string>>;
}

export const MAX_TOUR_GUESTS = 12;
export const MAX_TRANSFER_PASSENGERS = 14;

/** Tour price: per-guest price times guests (guests clamped to 1..MAX_TOUR_GUESTS). */
export function calculateTripTotal(pricePerGuest: number, guests: number): TripPricing {
  const safeGuests = Math.max(1, Math.min(MAX_TOUR_GUESTS, Math.floor(guests)));
  const safePrice = Math.max(0, pricePerGuest);
  return { guests: safeGuests, total: safePrice * safeGuests };
}

/** Transfer price: route base price (sedan) scaled by vehicle, doubled for a return journey. */
export function calculateTransferQuote(
  baseCarPrice: number,
  vehicleMultiplier: number,
  journey: JourneyType,
): TransferQuote {
  const perLeg = Math.round(Math.max(0, baseCarPrice) * Math.max(1, vehicleMultiplier));
  const legs = journey === 'return' ? 2 : 1;
  return { perLeg, legs, total: perLeg * legs };
}

/** Smallest vehicle that seats the group, or null if nothing does. */
export function pickVehicleForPassengers<T extends { seats: number }>(
  vehicles: T[],
  passengers: number,
): T | null {
  const sorted = [...vehicles].sort((a, b) => a.seats - b.seats);
  return sorted.find((v) => v.seats >= passengers) ?? null;
}

export function validateEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
}

export function validateBookingForm(
  input: BookingFormInput,
): BookingValidationResult {
  const errors: Partial<Record<keyof BookingFormInput, string>> = {};

  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  if (!validateEmail(input.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!input.travelDate.trim()) {
    errors.travelDate = 'Please choose a preferred start date.';
  }

  if (
    !Number.isFinite(input.guests) ||
    input.guests < 1 ||
    input.guests > MAX_TOUR_GUESTS
  ) {
    errors.guests = `Travelers must be between 1 and ${MAX_TOUR_GUESTS}.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateTransferForm(
  input: TransferFormInput,
): TransferValidationResult {
  const errors: Partial<Record<keyof TransferFormInput, string>> = {};

  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }
  if (!validateEmail(input.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.townId) {
    errors.townId = 'Please choose your south coast town.';
  }
  if (!input.date) {
    errors.date = 'Please choose a date.';
  }
  if (!input.time) {
    errors.time =
      input.direction === 'pickup'
        ? 'Please enter your flight landing time.'
        : 'Please enter a pick-up time from your hotel.';
  }
  if (input.direction === 'pickup' && !input.flightNumber.trim()) {
    errors.flightNumber = 'We track your flight. Please add the flight number.';
  }
  if (
    !Number.isFinite(input.passengers) ||
    input.passengers < 1 ||
    input.passengers > MAX_TRANSFER_PASSENGERS
  ) {
    errors.passengers = `Passengers must be between 1 and ${MAX_TRANSFER_PASSENGERS}.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function generateBookingReference(
  prefixSource: string,
  seed = Date.now(),
): string {
  const prefix = prefixSource.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  const code = String((Math.abs(Math.floor(seed)) % 90000) + 10000);
  return `TRV-${prefix}-${code}`;
}

/** wa.me link with a prefilled message. Phone in international format, digits only. */
export function buildWhatsAppLink(phoneDigits: string, message: string): string {
  const digits = phoneDigits.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
