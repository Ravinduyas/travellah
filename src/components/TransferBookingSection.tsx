import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Car,
  Check,
  History,
  MessageCircle,
  Plus,
  PlaneLanding,
  PlaneTakeoff,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { CONTACT, ROUTES, VEHICLES } from '../data/travelData';
import {
  MAX_TRANSFER_PASSENGERS,
  buildWhatsAppLink,
  calculateTransferQuote,
  generateBookingReference,
  pickVehicleForPassengers,
  validateTransferForm,
  type JourneyType,
  type TransferDirection,
  type TransferValidationResult,
} from '../utils/travelLogic';
import {
  BookingStepper,
  CALCULATING_MS,
  DrawnCheck,
  EASE_OUT,
  FieldError,
  PriceLoading,
  Row,
  SENDING_MS,
  SegmentedToggle,
  inputClass,
  labelClass,
  rowVariants,
  stepRowsVariants,
} from './booking/BookingParts';
import { DateTimeFields } from './booking/DateTimePicker';
import { MobileActionBar } from './booking/MobileActionBar';
import { clearDraft, loadDraft, saveDraft } from './booking/draft';
import { Eyebrow, Odometer, SplitWords } from './motion/effects';

interface TransferBookingSectionProps {
  initialDirection?: TransferDirection;
  initialTownId?: string;
  initialPassengers?: number;
  /** Pick up an unfinished booking saved on this device (only when the link did not choose a town). */
  restoreDraft?: boolean;
  /** Shorter intro on small screens (used on the stand-alone booking page). */
  compact?: boolean;
}

/** Which element to scroll to and focus for each field's error. */
const FIELD_IDS: Partial<Record<FieldKey, string>> = {
  townId: 'tr-town',
  date: 'tr-date',
  time: 'tr-time',
  flightNumber: 'tr-flight',
  passengers: 'tr-pax',
  fullName: 'tr-name',
  email: 'tr-email',
};

/** Goal-gradient copy: encouragement grows as the visitor nears the end. */
const PROGRESS_LINES = [
  'Takes about 2 minutes',
  'Good start',
  'Halfway there',
  'Almost done',
  'Last step, just check and book',
];

/** Everything included in the price (value framing). */
const INCLUDED = ['Tolls & fuel', 'Flight tracking', '60 min free waiting', 'Water on board', 'Child seats on request'];

/** December to April is high season on the south coast. */
function isHighSeason(iso: string) {
  if (!iso) return false;
  const month = Number(iso.slice(5, 7));
  return month === 12 || month <= 4;
}

/** True when the date is today, tomorrow or the day after. */
function isShortNotice(iso: string) {
  if (!iso) return false;
  const days = (new Date(`${iso}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000;
  return days >= 0 && days <= 2;
}

type Errors = TransferValidationResult['errors'];
type FieldKey = keyof Errors;

const STEPS = [
  { id: 'trip', label: 'Trip', title: 'Where are you going?', fields: ['townId'] },
  { id: 'time', label: 'Date & time', title: 'When do you travel?', fields: ['date', 'time', 'flightNumber'] },
  { id: 'group', label: 'Passengers', title: 'Who is travelling?', fields: ['passengers'] },
  { id: 'details', label: 'Details', title: 'Your contact details', fields: ['fullName', 'email'] },
  { id: 'review', label: 'Review', title: 'Check and book', fields: [] },
] as const satisfies ReadonlyArray<{ id: string; label: string; title: string; fields: readonly FieldKey[] }>;

const LAST_STEP = STEPS.length - 1;

/** Screens slide in the direction of travel: forward → from the right, back → from the left. */
const screenVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, filter: 'blur(6px)' }),
};

function pickErrors(all: Errors, fields: readonly FieldKey[]): Errors {
  const out: Errors = {};
  for (const f of fields) if (all[f]) out[f] = all[f];
  return out;
}

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** One line of the review screen, with an Edit link back to its step. */
function ReviewLine({ label, value, onEdit }: { label: string; value: ReactNode; onEdit: () => void }) {
  return (
    <motion.div variants={rowVariants} className="flex items-start justify-between gap-4 py-2.5 border-b border-neutral-200 last:border-b-0">
      <div className="min-w-0">
        <dt className="text-[11.5px] text-neutral-500">{label}</dt>
        <dd className="mt-0.5 text-[14px] text-[#171717] font-medium break-words">{value}</dd>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="shrink-0 text-[12px] font-medium text-[#3E8E9E] hover:text-[#171717] underline-offset-2 hover:underline cursor-pointer"
      >
        Edit
      </button>
    </motion.div>
  );
}

export function TransferBookingSection({
  initialDirection = 'pickup',
  initialTownId = '',
  initialPassengers = 2,
  restoreDraft = false,
  compact = false,
}: TransferBookingSectionProps) {
  // An unfinished booking saved on this device, picked up where the visitor left off.
  const [draft] = useState(() => (restoreDraft ? loadDraft() : null));
  const [showWelcomeBack, setShowWelcomeBack] = useState(draft !== null);

  const [direction, setDirection] = useState<TransferDirection>(draft?.direction ?? initialDirection);
  const [journey, setJourney] = useState<JourneyType>(draft?.journey ?? 'one-way');
  const [townId, setTownId] = useState(draft?.townId ?? initialTownId);
  const [passengers, setPassengers] = useState(draft?.passengers ?? initialPassengers);
  const [vehicleId, setVehicleId] = useState(
    () => draft?.vehicleId ?? pickVehicleForPassengers(VEHICLES, initialPassengers)?.id ?? VEHICLES[0].id,
  );
  const [date, setDate] = useState(draft?.date ?? '');
  const [time, setTime] = useState(draft?.time ?? '');
  const [flightNumber, setFlightNumber] = useState(draft?.flightNumber ?? '');
  const [hotel, setHotel] = useState(draft?.hotel ?? '');
  const [fullName, setFullName] = useState(draft?.fullName ?? '');
  const [email, setEmail] = useState(draft?.email ?? '');
  const [notes, setNotes] = useState(draft?.notes ?? '');
  const [errors, setErrors] = useState<Errors>({});
  const [showNotes, setShowNotes] = useState(false);

  const [step, setStep] = useState(draft ? Math.min(draft.step, LAST_STEP) : 0);
  const [maxReached, setMaxReached] = useState(draft ? Math.min(draft.maxReached, LAST_STEP) : 0);
  const [slideDir, setSlideDir] = useState(1);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ ref: string; link: string } | null>(null);
  const [calculating, setCalculating] = useState(false);

  const shake = useAnimationControls();
  const sendTimer = useRef<number | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);

  // Follow the URL when it later sends new values, and start again at step 1.
  // (Skipped on first render, so a restored draft is not overwritten.)
  const urlSeen = useRef(false);
  useEffect(() => {
    if (!urlSeen.current) {
      urlSeen.current = true;
      return;
    }
    setDirection(initialDirection);
    setTownId(initialTownId);
    setPassengers(initialPassengers);
    setStep(0);
    setSent(null);
  }, [initialDirection, initialTownId, initialPassengers]);

  // Save the unfinished booking on this device (debounced) until it is sent.
  useEffect(() => {
    if (sent || !townId) return;
    const id = window.setTimeout(
      () =>
        saveDraft({
          direction, journey, townId, passengers, vehicleId, date, time,
          flightNumber, hotel, fullName, email, notes, step, maxReached,
        }),
      300,
    );
    return () => window.clearTimeout(id);
  }, [sent, direction, journey, townId, passengers, vehicleId, date, time, flightNumber, hotel, fullName, email, notes, step, maxReached]);

  // Never leave a vehicle selected that is too small for the group.
  useEffect(() => {
    const current = VEHICLES.find((v) => v.id === vehicleId);
    if (!current || current.seats < passengers) {
      const fit = pickVehicleForPassengers(VEHICLES, passengers);
      if (fit) setVehicleId(fit.id);
    }
  }, [passengers, vehicleId]);

  const route = ROUTES.find((r) => r.id === townId);
  const vehicle = VEHICLES.find((v) => v.id === vehicleId) ?? VEHICLES[0];
  const quote = useMemo(
    () => (route ? calculateTransferQuote(route.carPrice, vehicle.multiplier, journey) : null),
    [route, vehicle, journey],
  );
  const isPickup = direction === 'pickup';
  const fromLabel = isPickup ? 'CMB airport' : route?.town ?? '';
  const toLabel = isPickup ? route?.town ?? '' : 'CMB airport';

  // Short "finding your price" animation whenever the price inputs change.
  useEffect(() => {
    if (!townId) return;
    setCalculating(true);
    const id = window.setTimeout(() => setCalculating(false), CALCULATING_MS);
    return () => window.clearTimeout(id);
  }, [townId, vehicleId, journey, direction]);

  useEffect(() => () => window.clearTimeout(sendTimer.current), []);

  // The new screen's heading mounts only after the old screen has slid out,
  // so focus it from a (stable) callback ref when it appears, not from the step effect.
  const focusHeadingOnMount = useCallback((el: HTMLHeadingElement | null) => {
    if (el && hasMoved.current) el.focus({ preventScroll: true });
  }, []);

  // After moving between screens, start the new screen at the top of the card.
  // On phones and tablets the step is often longer than the screen, so it should not
  // open half-way down; 80px leaves room for the sticky header on the booking page.
  useEffect(() => {
    if (!hasMoved.current) return;
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    const isSmall = window.innerWidth < 1024;
    const outOfPlace = isSmall ? top < 72 || top > 160 : top < 0 || top > window.innerHeight * 0.6;
    if (outOfPlace) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const clearError = (key: FieldKey) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateAll = () =>
    validateTransferForm({ fullName, email, townId, date, time, flightNumber, passengers, direction });

  const goTo = (index: number) => {
    hasMoved.current = true;
    setSlideDir(index > step ? 1 : -1);
    setStep(index);
    setMaxReached((m) => Math.max(m, index));
  };

  const rejectStep = (stepErrors: Errors) => {
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    shake.start({ x: [0, -10, 9, -7, 5, -2, 0], transition: { duration: 0.5 } });
    // Take the visitor straight to the first field that needs attention.
    const first = (Object.keys(stepErrors) as FieldKey[])[0];
    const fieldId = first ? FIELD_IDS[first] : undefined;
    const field = fieldId ? document.getElementById(fieldId) : null;
    if (field) {
      window.setTimeout(() => {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        field.focus({ preventScroll: true });
      }, 60);
    }
  };

  const handleNext = () => {
    const stepErrors = pickErrors(validateAll().errors, STEPS[step].fields);
    if (Object.keys(stepErrors).length > 0) {
      rejectStep(stepErrors);
      return;
    }
    goTo(step + 1);
  };

  const handleBook = () => {
    if (sending) return;
    const validation = validateAll();
    if (!validation.valid || !route || !quote) {
      // Send the visitor back to the first screen that still has a problem.
      const firstBad = STEPS.findIndex((s) => Object.keys(pickErrors(validation.errors, s.fields)).length > 0);
      setErrors(validation.errors);
      if (firstBad >= 0) goTo(firstBad);
      return;
    }

    const ref = generateBookingReference(route.id);
    const lines = [
      `Transfer booking ${ref}`,
      isPickup ? `Airport pick-up: CMB airport → ${route.town}` : `Airport drop-off: ${route.town} → CMB airport`,
      `Journey: ${journey === 'return' ? 'Return (2 transfers)' : 'One way'}`,
      `Date: ${date}`,
      isPickup ? `Flight: ${flightNumber.trim().toUpperCase()} landing ${time}` : `Hotel pick-up time: ${time}`,
      hotel.trim() ? `Hotel / address: ${hotel.trim()}` : '',
      `Passengers: ${passengers}`,
      `Vehicle: ${vehicle.name}`,
      `Price: $${quote.total}`,
      `Name: ${fullName.trim()}`,
      `Email: ${email.trim()}`,
      notes.trim() ? `Notes: ${notes.trim()}` : '',
    ].filter(Boolean);
    const link = buildWhatsAppLink(CONTACT.whatsappDigits, lines.join('\n'));

    setErrors({});
    setSending(true);
    sendTimer.current = window.setTimeout(() => {
      window.open(link, '_blank', 'noopener,noreferrer');
      setSending(false);
      setSent({ ref, link });
      clearDraft();
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
    }, SENDING_MS);
  };

  // Enter key (form submit) moves forward, or books on the last screen.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < LAST_STEP) handleNext();
    else handleBook();
  };

  const startOver = () => {
    setSent(null);
    hasMoved.current = true;
    setSlideDir(-1);
    setStep(0);
  };

  // "Start a new booking" from the welcome-back banner: forget the saved draft.
  const discardDraft = () => {
    clearDraft();
    setShowWelcomeBack(false);
    setDirection(initialDirection);
    setJourney('one-way');
    setTownId(initialTownId);
    setPassengers(initialPassengers);
    setDate('');
    setTime('');
    setFlightNumber('');
    setHotel('');
    setFullName('');
    setEmail('');
    setNotes('');
    setShowNotes(false);
    setErrors({});
    setMaxReached(0);
    hasMoved.current = true;
    setSlideDir(-1);
    setStep(0);
  };

  const perPerson = quote && passengers > 1 ? Math.ceil(quote.total / passengers) : null;
  const bestFitId = pickVehicleForPassengers(VEHICLES, passengers)?.id;

  /* ---------------------------- screens ---------------------------- */

  const screens: Record<(typeof STEPS)[number]['id'], ReactNode> = {
    trip: (
      <>
        <Row className="flex flex-col sm:flex-row gap-3">
          <SegmentedToggle
            id="direction"
            label="Transfer direction"
            value={direction}
            onChange={setDirection}
            className="flex-1"
            options={[
              { value: 'pickup', label: 'Airport pick-up', icon: <PlaneLanding className="w-4 h-4" aria-hidden="true" /> },
              { value: 'drop', label: 'Airport drop-off', icon: <PlaneTakeoff className="w-4 h-4" aria-hidden="true" /> },
            ]}
          />
          <SegmentedToggle
            id="journey"
            label="Journey type"
            value={journey}
            onChange={setJourney}
            className="sm:w-[220px]"
            options={[
              { value: 'one-way', label: 'One way' },
              { value: 'return', label: 'Return' },
            ]}
          />
        </Row>
        <Row className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tr-town" className={labelClass}>
              {isPickup ? 'Drop me in' : 'Pick me up in'}
            </label>
            <select
              id="tr-town"
              value={townId}
              onChange={(e) => {
                setTownId(e.target.value);
                clearError('townId');
              }}
              className={inputClass}
            >
              <option value="">Choose your town</option>
              {ROUTES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.town} ({r.duration})
                </option>
              ))}
            </select>
            <FieldError message={errors.townId} />
          </div>
          <div>
            <label htmlFor="tr-hotel" className={labelClass}>
              Hotel or address <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <input id="tr-hotel" type="text" enterKeyHint="next" autoComplete="street-address" value={hotel} onChange={(e) => setHotel(e.target.value)} className={inputClass} />
          </div>
        </Row>
      </>
    ),

    time: (
      <>
        <Row>
          {/* two-month calendar and a time picker in 10-minute steps */}
          <DateTimeFields
            date={date}
            time={time}
            onDateChange={(iso) => {
              setDate(iso);
              clearError('date');
            }}
            onTimeChange={(hhmm) => {
              setTime(hhmm);
              clearError('time');
            }}
            dateLabel={isPickup ? 'Arrival date' : 'Transfer date'}
            timeLabel={isPickup ? 'Landing time (local)' : 'Pick-up time from your hotel'}
            dateError={errors.date}
            timeError={errors.time}
          />
        </Row>
        {isPickup ? (
          <Row>
            <label htmlFor="tr-flight" className={labelClass}>
              Flight number
            </label>
            <div className="sm:flex sm:items-center sm:gap-4">
            <input
              id="tr-flight"
              type="text"
              enterKeyHint="next"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              placeholder="e.g. EK650"
              value={flightNumber}
              onChange={(e) => {
                setFlightNumber(e.target.value);
                clearError('flightNumber');
              }}
              className={`${inputClass} sm:max-w-[260px] uppercase placeholder:normal-case`}
            />
              {/* the reassurance sits beside the field on larger screens */}
              <p className="mt-1.5 sm:mt-0 text-[12px] text-neutral-500">
                We track your flight, so delays are no problem.
              </p>
            </div>
            <FieldError message={errors.flightNumber} />
          </Row>
        ) : (
          <Row>
            <p className="rounded-xl bg-neutral-50 border border-neutral-200/80 px-4 py-3 text-[12.5px] text-[#525252] leading-relaxed">
              Tip: plan to reach the airport 3 hours before an international flight.
              {route ? ` The drive from ${route.town} takes about ${route.duration}.` : ''}
            </p>
          </Row>
        )}
        {/* honest, date-based context: high season and short-notice reassurance */}
        <AnimatePresence initial={false}>
          {(isHighSeason(date) || isShortNotice(date)) && (
            <motion.div
              key={isShortNotice(date) ? 'short' : 'season'}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              <p className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200/70 px-4 py-3 text-[12.5px] text-amber-900 leading-relaxed">
                <CalendarClock className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                {isShortNotice(date)
                  ? 'Travelling soon? No problem. Book now and we will confirm your driver on WhatsApp as quickly as we can.'
                  : 'You are travelling in high season (December to April), the busiest time on the south coast. Booking ahead means your driver is set before you fly.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    ),

    group: (
      <>
        {/* label and select on one line to save height */}
        <Row className="flex items-center justify-between gap-4">
          <label htmlFor="tr-pax" className="text-[13px] font-medium text-[#171717]">
            How many passengers?
          </label>
          <select
            id="tr-pax"
            value={passengers}
            onChange={(e) => {
              setPassengers(Number(e.target.value));
              clearError('passengers');
            }}
            className={`${inputClass} max-w-[180px]`}
          >
            {Array.from({ length: MAX_TRANSFER_PASSENGERS }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'passenger' : 'passengers'}
              </option>
            ))}
          </select>
        </Row>
        <FieldError message={errors.passengers} />
        <Row>
          <fieldset>
            <legend className={labelClass}>Vehicle</legend>
            {/* three across on every screen (compact cards), so phones do not stack them */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              {VEHICLES.map((v) => {
                const tooSmall = v.seats < passengers;
                const selected = v.id === vehicleId;
                const price = route ? calculateTransferQuote(route.carPrice, v.multiplier, journey).total : null;
                return (
                  <label
                    key={v.id}
                    className={`relative rounded-xl border p-2.5 sm:p-3.5 transition-[border-color,opacity,background-color] duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#4694A4] ${
                      tooSmall
                        ? 'border-neutral-200 opacity-45 cursor-not-allowed'
                        : selected
                          ? 'border-transparent bg-[#4694A4]/6 cursor-pointer'
                          : 'border-neutral-200 hover:border-neutral-300 cursor-pointer'
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="vehicle-ring"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-xl border-2 border-[#4694A4] pointer-events-none"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <input
                      type="radio"
                      name="vehicle"
                      value={v.id}
                      checked={selected}
                      disabled={tooSmall}
                      onChange={() => setVehicleId(v.id)}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between gap-1">
                      <span className="block text-[12px] sm:text-[13px] font-medium text-[#171717] leading-tight">{v.name}</span>
                      <motion.span
                        aria-hidden="true"
                        animate={selected ? { x: [0, 6, 0], opacity: 1 } : { x: 0, opacity: 0.35 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="hidden sm:block text-[#3E8E9E]"
                      >
                        <Car className="w-4 h-4" />
                      </motion.span>
                    </span>
                    <span className="block text-[11px] sm:text-[11.5px] text-neutral-500 mt-0.5 leading-snug">
                      Up to {v.seats} people
                    </span>
                    {price !== null && (
                      <span className="flex flex-wrap items-baseline gap-x-1.5 mt-1.5 sm:mt-2">
                        <span className="text-[13px] font-medium text-[#171717] tabular-nums">
                          {tooSmall ? 'Too small' : `$${price}`}
                        </span>
                        {/* per-person framing makes the group price easy to compare */}
                        {!tooSmall && passengers > 1 && (
                          <span className="text-[10.5px] sm:text-[11px] text-neutral-500 tabular-nums">
                            ≈ ${Math.ceil(price / passengers)} pp
                          </span>
                        )}
                      </span>
                    )}
                    {/* default effect: highlight the vehicle that fits the group */}
                    {v.id === bestFitId && (
                      <span className="absolute -top-2.5 right-2 sm:right-3 rounded-full bg-[#171717] text-white px-2 py-0.5 text-[10px] font-medium tracking-[0.02em] whitespace-nowrap">
                        Best fit
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </Row>
        {/* notes stay out of the way until needed (most bookings have none) */}
        <Row>
          {showNotes || notes ? (
            <>
              <label htmlFor="tr-notes" className={labelClass}>
                Anything else? <span className="text-neutral-400 font-normal">(child seats, surfboards, stops)</span>
              </label>
              <textarea
                id="tr-notes"
                rows={2}
                autoFocus={showNotes && !notes}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowNotes(true)}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#3E8E9E] hover:text-[#171717] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Add a note (child seats, surfboards, stops)
            </button>
          )}
        </Row>
      </>
    ),

    details: (
      <>
        <Row className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tr-name" className={labelClass}>
              Full name
            </label>
            <input
              id="tr-name"
              type="text"
              enterKeyHint="next"
              autoCapitalize="words"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                clearError('fullName');
              }}
              className={inputClass}
            />
            <FieldError message={errors.fullName} />
          </div>
          <div>
            <label htmlFor="tr-email" className={labelClass}>
              Email
            </label>
            <input
              id="tr-email"
              type="email"
              inputMode="email"
              enterKeyHint="next"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
              className={inputClass}
            />
            <FieldError message={errors.email} />
          </div>
        </Row>
        <Row>
          <p className="text-[12px] text-neutral-500 leading-relaxed">
            We only use these details for your booking. You will confirm everything with us on WhatsApp in the next step.
          </p>
        </Row>
      </>
    ),

    review: (
      <dl>
        <ReviewLine
          label="Transfer"
          value={
            <>
              {isPickup ? 'Airport pick-up' : 'Airport drop-off'} · {journey === 'return' ? 'Return' : 'One way'}
              <span className="block text-[12.5px] font-normal text-neutral-500">
                {fromLabel} → {toLabel}
                {hotel.trim() ? ` · ${hotel.trim()}` : ''}
              </span>
            </>
          }
          onEdit={() => goTo(0)}
        />
        <ReviewLine
          label="Date & time"
          value={
            <>
              {formatDate(date)} · {time}
              {isPickup && flightNumber.trim() && (
                <span className="block text-[12.5px] font-normal text-neutral-500">
                  Flight {flightNumber.trim().toUpperCase()}
                </span>
              )}
            </>
          }
          onEdit={() => goTo(1)}
        />
        <ReviewLine
          label="Passengers & vehicle"
          value={
            <>
              {passengers} {passengers === 1 ? 'passenger' : 'passengers'} · {vehicle.name}
              {notes.trim() && <span className="block text-[12.5px] font-normal text-neutral-500">{notes.trim()}</span>}
            </>
          }
          onEdit={() => goTo(2)}
        />
        <ReviewLine
          label="Your details"
          value={
            <>
              {fullName.trim()}
              <span className="block text-[12.5px] font-normal text-neutral-500">{email.trim()}</span>
            </>
          }
          onEdit={() => goTo(3)}
        />
      </dl>
    ),
  };

  const current = STEPS[step];

  return (
    <section
      id="book"
      className={`max-w-[1180px] mx-auto px-4 sm:px-6 md:px-10 scroll-mt-4 ${
        compact ? 'pt-4 pb-8 sm:pt-6 lg:pt-7 lg:pb-12' : 'py-14 lg:py-20'
      }`}
    >
      {/* on the booking page the intro is compact on small screens, so the form starts higher */}
      <div className={compact ? 'mb-3 sm:mb-4 lg:mb-5' : 'mb-10'}>
        <Eyebrow className={compact ? 'mb-0 sm:mb-1.5' : 'mb-3'}>BOOK A TRANSFER</Eyebrow>
        <h2
          className={`font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] text-balance ${
            compact
              ? 'hidden sm:block sm:text-[28px] lg:text-[32px] mb-0'
              : 'text-[32px] sm:text-[40px] lg:text-[44px] mb-3.5'
          }`}
        >
          <SplitWords text="See your fixed price and book in *two* minutes" />
        </h2>
        <p className={`text-[13px] sm:text-[14px] text-[#737373] max-w-[560px] leading-relaxed ${compact ? 'hidden' : ''}`}>
          Five quick steps. Your booking goes to us on WhatsApp and we confirm
          with your driver’s details. No payment until the day of your transfer.
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="rounded-[22px] border border-neutral-200 bg-neutral-50 p-8 sm:p-10 text-center max-w-[560px] mx-auto"
          >
            <DrawnCheck />
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }}
            >
              <motion.h3 variants={rowVariants} className="text-[22px] font-medium text-[#171717] mb-2">
                Send your booking on WhatsApp
              </motion.h3>
              <motion.p variants={rowVariants} className="text-[13px] text-[#666666] leading-relaxed mb-5">
                We opened WhatsApp with your booking details ready to send. If it did
                not open, use the button below. Reference{' '}
                <span className="font-semibold text-[#171717] tabular-nums">{sent.ref}</span>.
              </motion.p>
              {/* uncertainty reduction: say exactly what happens next */}
              <motion.ol variants={rowVariants} className="mb-6 text-left rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-200">
                {[
                  { title: 'We confirm on WhatsApp', text: 'You get your driver’s name, photo, car number and phone number.' },
                  {
                    title: isPickup ? 'We track your flight' : 'We remind you the day before',
                    text: isPickup ? 'Your driver adjusts to your real landing time, at no extra cost.' : 'Your driver will be at your hotel on time.',
                  },
                  {
                    title: isPickup ? 'Your driver waits at arrivals' : 'Relax on the way to the airport',
                    text: isPickup ? 'Look for the board with your name at the arrivals exit.' : 'Pay the driver in cash or by card link. Nothing to pay before.',
                  },
                ].map((item, i) => (
                  <li key={item.title} className="flex gap-3 px-4 py-3">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-[#4694A4]/12 text-[#3E8E9E] inline-flex items-center justify-center text-[11.5px] font-medium tabular-nums">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[13px] font-medium text-[#171717]">{item.title}</span>
                      <span className="block text-[12px] text-[#737373] leading-relaxed">{item.text}</span>
                    </span>
                  </li>
                ))}
              </motion.ol>
              <motion.div variants={rowVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={sent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171717] hover:bg-neutral-800 text-white px-7 py-2.5 text-[13px] font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  Open WhatsApp
                </a>
                <button
                  type="button"
                  onClick={startOver}
                  className="rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 px-7 py-2.5 text-[13px] font-medium text-[#404040] transition-colors cursor-pointer"
                >
                  Edit booking
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            id="transfer-booking-form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
          >
            <motion.div ref={cardRef} animate={shake} className="lg:col-span-8 scroll-mt-24">
              <div className="rounded-[22px] border border-neutral-200 bg-white p-4 sm:p-6 overflow-hidden">
                {/* Zeigarnik effect: welcome the visitor back to the booking they started */}
                <AnimatePresence initial={false}>
                  {showWelcomeBack && route && (
                    <motion.div
                      key="welcome-back"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <div role="status" className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#4694A4]/8 border border-[#4694A4]/25 px-4 py-3">
                        <p className="flex items-center gap-2 text-[13px] text-[#1F4E58]">
                          <History className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>
                            <span className="font-medium">Welcome back.</span> Your booking to {route.town} is saved, so you can carry on where you left off.
                          </span>
                        </p>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowWelcomeBack(false)}
                            className="rounded-full bg-[#171717] text-white px-4 py-1.5 text-[12px] font-medium hover:bg-[#262626] transition-colors cursor-pointer"
                          >
                            Continue
                          </button>
                          <button
                            type="button"
                            onClick={discardDraft}
                            className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-[12px] font-medium text-[#404040] hover:bg-neutral-100 transition-colors cursor-pointer"
                          >
                            Start new
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <BookingStepper steps={STEPS} current={step} maxReached={maxReached} onSelect={goTo} />

                <AnimatePresence mode="wait" custom={slideDir} initial={false}>
                  <motion.div
                    key={current.id}
                    custom={slideDir}
                    variants={screenVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.38, ease: EASE_OUT }}
                  >
                    {/* heading and goal-gradient progress share one line on larger screens */}
                    <div className="mb-4 sm:flex sm:items-baseline sm:justify-between sm:gap-4">
                      <p className="text-[11.5px] text-neutral-500 tabular-nums sm:order-2 sm:text-right sm:shrink-0">
                        Step {step + 1} of {STEPS.length}
                        <span className="text-[#3E8E9E] font-medium"> · {PROGRESS_LINES[step]}</span>
                      </p>
                      <h3
                        ref={focusHeadingOnMount}
                        tabIndex={-1}
                        className="mt-0.5 sm:mt-0 sm:order-1 text-[19px] sm:text-[20px] font-medium tracking-[-0.01em] text-[#171717] focus:outline-none"
                      >
                        {current.title}
                      </h3>
                    </div>
                    <motion.div variants={stepRowsVariants} initial="hidden" animate="show" className="space-y-4">
                      {screens[current.id]}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>

                {/* navigation (on phones and tablets the sticky bottom bar takes over) */}
                <div className="hidden lg:flex mt-5 pt-4 border-t border-neutral-200 items-center justify-between gap-3">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => goTo(step - 1)}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-[#404040] hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < LAST_STEP ? (
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 rounded-full bg-[#171717] hover:bg-[#262626] text-white px-6 py-3 text-[13px] font-medium transition-colors cursor-pointer"
                    >
                      {step === LAST_STEP - 1 ? 'Review my booking' : 'Continue'}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={sending}
                      aria-busy={sending}
                      className="relative overflow-hidden min-w-[230px] rounded-full bg-[#171717] text-white px-6 py-3 text-[13px] font-medium transition-colors cursor-pointer disabled:cursor-wait"
                    >
                      <AnimatePresence>
                        {sending && (
                          <motion.span
                            key="fill"
                            aria-hidden="true"
                            className="absolute inset-y-0 left-0 bg-[#4694A4]"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: SENDING_MS / 1000, ease: 'easeInOut' }}
                          >
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-white">
                              <Car className="w-4 h-4" />
                            </span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span className="relative z-10 inline-flex items-center justify-center gap-2">
                        {sending ? (
                          'Preparing your booking…'
                        ) : (
                          <>
                            <MessageCircle className="w-4 h-4" aria-hidden="true" />
                            Book on WhatsApp{quote ? ` · $${quote.total}` : ''}
                          </>
                        )}
                      </span>
                    </button>
                  )}
                </div>

                {/* risk reversal: remove the fear of committing too early */}
                <p className="mt-3 flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-[11.5px] text-neutral-500">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3E8E9E]" aria-hidden="true" />
                    Nothing to pay now
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#3E8E9E]" aria-hidden="true" />
                    Free cancellation up to 24 h before
                  </span>
                </p>
              </div>
            </motion.div>

            {/* price panel: stays beside the steps and fills in a summary as the visitor goes */}
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
              className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 rounded-[22px] bg-[#161616] text-white p-6 overflow-hidden"
            >
              <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/60 mb-4">Your price</p>
              {/* The price is always rendered once a town is chosen; the "finding your price"
                  loader is a separate layer on top. Showing the price never waits for an exit animation. */}
              <div aria-live="polite" className="relative min-h-[150px]">
                <AnimatePresence initial={false}>
                  {route && quote && calculating && (
                    <motion.div
                      key="loading"
                      className="absolute inset-0 z-10 bg-[#161616]"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: 0.25 }}
                    >
                      <PriceLoading from={fromLabel} to={toLabel} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {route && quote ? (
                    <motion.div
                      initial={false}
                      animate={
                        calculating
                          ? { opacity: 0, y: 10, filter: 'blur(4px)' }
                          : { opacity: 1, y: 0, filter: 'blur(0px)' }
                      }
                      transition={{ duration: 0.4, ease: EASE_OUT }}
                    >
                      <p className="text-[13px] text-white/80 leading-relaxed">
                        {fromLabel} → {toLabel}
                      </p>
                      <p className="text-[12px] text-white/55 mt-1">
                        approx. {route.distanceKm} km · {route.duration} · {vehicle.name}
                      </p>
                      <div className="mt-6 flex items-end justify-between border-t border-white/15 pt-5">
                        <span className="text-[13px] text-white/70">
                          {quote.legs === 2 ? `2 × $${quote.perLeg}` : 'One way'}
                        </span>
                        <span className="text-[34px] font-medium tracking-[-0.02em] leading-none">
                          <Odometer value={quote.total} prefix="$" />
                        </span>
                      </div>
                      {/* price framing: the same total, shown per person */}
                      <p className="text-[11.5px] text-white/55 mt-2 flex justify-between gap-3">
                        <span>USD for the whole vehicle</span>
                        {perPerson !== null && (
                          <span className="text-white/90 font-medium tabular-nums">≈ ${perPerson} per person</span>
                        )}
                      </p>
                    </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[13px] text-white/70 leading-relaxed"
                  >
                    Choose your town to see the fixed price.
                  </motion.p>
                )}
              </div>

              {/* trip summary that grows as each step is filled in */}
              <ul className="mt-5 pt-5 border-t border-white/15 space-y-2 text-[12px]">
                <AnimatePresence initial={false}>
                  {date && time && (
                    <motion.li key="when" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-between gap-3">
                      <span className="text-white/55">When</span>
                      <span className="text-white/90 text-right">{formatDate(date)} · {time}</span>
                    </motion.li>
                  )}
                  {maxReached >= 2 && (
                    <motion.li key="who" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-between gap-3">
                      <span className="text-white/55">Passengers</span>
                      <span className="text-white/90">{passengers} · {vehicle.name}</span>
                    </motion.li>
                  )}
                  {fullName.trim() && maxReached >= 3 && (
                    <motion.li key="name" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex justify-between gap-3">
                      <span className="text-white/55">Lead traveller</span>
                      <span className="text-white/90 truncate">{fullName.trim()}</span>
                    </motion.li>
                  )}
                </AnimatePresence>
              </ul>

              {/* value framing: everything the price already covers */}
              <div className="mt-5 pt-5 border-t border-white/15">
                <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/50 mb-3">
                  Included in every transfer
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {INCLUDED.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full bg-white/[0.07] border border-white/10 px-2.5 py-1 text-[11.5px] text-white/85"
                    >
                      <Check className="w-3 h-3 text-[#7cc4d2]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11.5px] text-white/55">Pay the driver in cash or by card link.</p>
              </div>
            </motion.aside>
          </motion.form>
        )}
      </AnimatePresence>

      {/* phones & tablets: Back, live price and the next action always at thumb reach.
          Rendered outside the animated form, so position: fixed stays fixed to the screen. */}
      {!sent && (
        <>
          <div aria-hidden="true" className="h-24 lg:hidden" />
          <MobileActionBar
            formId="transfer-booking-form"
            step={step}
            isLast={step === LAST_STEP}
            reviewNext={step === LAST_STEP - 1}
            onBack={() => goTo(step - 1)}
            total={quote?.total ?? null}
            perPerson={perPerson}
            calculating={calculating}
            sending={sending}
          />
        </>
      )}
    </section>
  );
}
