import { useState, type FormEvent } from 'react';
import { ArrowUpRight, History, PlaneLanding, PlaneTakeoff } from 'lucide-react';
import { motion } from 'motion/react';
import { BookingLink, openBooking } from '../booking';
import { ROUTES, VEHICLES } from '../data/travelData';
import {
  MAX_TRANSFER_PASSENGERS,
  calculateTransferQuote,
  pickVehicleForPassengers,
  type TransferDirection,
} from '../utils/travelLogic';
import { SegmentedToggle } from './booking/BookingParts';
import { loadDraft } from './booking/draft';
import { Eyebrow, Odometer, Reveal, SplitWords } from './motion/effects';

const STEPS = ['Your trip', 'Date & time', 'Passengers & vehicle', 'Your details', 'Review & book on WhatsApp'];

const selectClass =
  'w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#4694A4] [&>option]:bg-[#161616]';

interface BookingLauncherProps {
  initialDirection: TransferDirection;
  initialTownId: string;
  initialPassengers: number;
}

/**
 * Takes the place of the booking form on the Transfers page: the visitor picks the basics
 * and the full step-by-step booking opens in a new tab, already filled in.
 */
export function BookingLauncher({ initialDirection, initialTownId, initialPassengers }: BookingLauncherProps) {
  const [direction, setDirection] = useState<TransferDirection>(initialDirection);
  const [town, setTown] = useState(initialTownId);
  const [pax, setPax] = useState(initialPassengers);

  const route = ROUTES.find((r) => r.id === town);
  const vehicle = pickVehicleForPassengers(VEHICLES, pax) ?? VEHICLES[0];
  const price = route ? calculateTransferQuote(route.carPrice, vehicle.multiplier, 'one-way').total : null;
  // An unfinished booking saved on this device (read once; /book without a town restores it).
  const [draftTown] = useState(() => {
    const draft = loadDraft();
    return draft ? ROUTES.find((r) => r.id === draft.townId)?.town ?? null : null;
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openBooking({ direction, town: town || undefined, pax });
  };

  return (
    <section id="book" className="max-w-[1180px] mx-auto px-6 md:px-10 py-14 lg:py-20 scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-6">
          <Eyebrow className="mb-3">BOOK A TRANSFER</Eyebrow>
          <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] mb-3.5 text-balance">
            <SplitWords text="Book in five quick steps, in a *new tab*" />
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#737373] max-w-[460px] leading-relaxed">
            Choose the basics here. The booking opens in its own tab, so you can
            keep checking prices and tours while you book.
          </p>
          <ol className="mt-7 space-y-3">
            {STEPS.map((step, i) => (
              <Reveal key={step} delay={i * 0.07} y={12}>
                <li className="flex items-center gap-3 text-[13.5px] text-[#404040]">
                  <span className="w-7 h-7 rounded-full border border-neutral-300 inline-flex items-center justify-center text-[11.5px] font-medium tabular-nums text-[#171717]">
                    {i + 1}
                  </span>
                  {step}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grain lg:col-span-6 relative overflow-hidden rounded-[24px] bg-[#161616] text-white p-6 sm:p-8"
          aria-label="Start your booking"
        >
          <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/60 mb-5">Start your booking</p>

          {/* Zeigarnik effect: invite the visitor back to a booking they started */}
          {draftTown && (
            <BookingLink className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-[#4694A4]/20 border border-[#4694A4]/40 px-4 py-3 text-[12.5px] text-white hover:bg-[#4694A4]/30 transition-colors">
              <span className="inline-flex items-center gap-2">
                <History className="w-4 h-4 shrink-0" aria-hidden="true" />
                Continue your booking to {draftTown}
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </BookingLink>
          )}

          <SegmentedToggle
              tone="dark"
              id="launcher-direction"
              label="Transfer direction"
              value={direction}
              onChange={setDirection}
              options={[
                { value: 'pickup', label: 'Airport pick-up', icon: <PlaneLanding className="w-4 h-4" aria-hidden="true" /> },
                { value: 'drop', label: 'Airport drop-off', icon: <PlaneTakeoff className="w-4 h-4" aria-hidden="true" /> },
              ]}
            />

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="launcher-town" className="block text-[12px] text-white/70 mb-1.5">
                {direction === 'pickup' ? 'Drop me in' : 'Pick me up in'}
              </label>
              <select id="launcher-town" value={town} onChange={(e) => setTown(e.target.value)} className={selectClass}>
                <option value="">Choose your town</option>
                {ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.town}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="launcher-pax" className="block text-[12px] text-white/70 mb-1.5">
                Passengers
              </label>
              <select id="launcher-pax" value={pax} onChange={(e) => setPax(Number(e.target.value))} className={selectClass}>
                {Array.from({ length: MAX_TRANSFER_PASSENGERS }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'passenger' : 'passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex items-end justify-between gap-4">
            <div>
              <p className="text-[12px] text-white/60">
                {route ? `${direction === 'pickup' ? 'CMB → ' : ''}${route.town}${direction === 'drop' ? ' → CMB' : ''} · ${vehicle.name}` : 'Fixed price, tolls included'}
              </p>
              <p className="mt-1 text-[30px] font-medium tracking-[-0.02em] leading-none">
                {price !== null ? <Odometer value={price} prefix="$" /> : <span className="text-white/40">$—</span>}
              </p>
              {/* price framing: per person for groups */}
              {price !== null && pax > 1 && (
                <p className="mt-1.5 text-[11.5px] text-white/60 tabular-nums">≈ ${Math.ceil(price / pax)} per person</p>
              )}
            </div>
            <button
              type="submit"
              className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-white text-[#171717] hover:bg-neutral-100 px-6 py-3 text-[13px] font-medium transition-colors cursor-pointer shrink-0"
            >
              Start booking
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
