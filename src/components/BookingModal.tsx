import { useEffect, useState, type FormEvent } from 'react';
import { Check, CheckCircle2, MessageCircle, Minus, Plane, Plus, X } from 'lucide-react';
import { CONTACT, type TravelPackage } from '../data/travelData';
import {
  MAX_TOUR_GUESTS,
  buildWhatsAppLink,
  calculateTripTotal,
  generateBookingReference,
  validateBookingForm,
  type BookingValidationResult,
} from '../utils/travelLogic';
import { ResilientImage } from './ResilientImage';

interface BookingModalProps {
  pkg: TravelPackage | null;
  onClose: () => void;
}

const inputClass =
  'w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-[13px] text-[#171717] focus:outline-none focus:border-[#4694A4]';

function isoDateFromToday(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function BookingModal({ pkg, onClose }: BookingModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState(() => isoDateFromToday(14));
  const [guests, setGuests] = useState(2);
  const [needsTransfer, setNeedsTransfer] = useState(true);
  const [errors, setErrors] = useState<BookingValidationResult['errors']>({});
  const [request, setRequest] = useState<{ ref: string; link: string } | null>(null);

  useEffect(() => {
    if (!pkg) return;
    setErrors({});
    setRequest(null);
    setGuests(2);
    setNeedsTransfer(true);
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pkg, onClose]);

  if (!pkg) return null;

  const pricing = calculateTripTotal(pkg.pricePerGuest, guests);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateBookingForm({ fullName, email, travelDate, guests });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const ref = generateBookingReference(pkg.id);
    const message = [
      `Tour request ${ref}`,
      `Tour: ${pkg.title} (${pkg.duration})`,
      `Name: ${fullName.trim()}`,
      `Email: ${email.trim()}`,
      `Start date: ${travelDate}`,
      `Travellers: ${guests}`,
      `Estimate: $${pricing.total.toLocaleString()}`,
      `Airport transfer needed: ${needsTransfer ? 'Yes' : 'No'}`,
    ].join('\n');
    const link = buildWhatsAppLink(CONTACT.whatsappDigits, message);

    setErrors({});
    setRequest({ ref, link });
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[780px] max-h-[90vh] overflow-y-auto rounded-[22px] bg-white shadow-2xl border border-neutral-200"
      >
        <div className="relative h-44 sm:h-52 overflow-hidden">
          <ResilientImage
            src={pkg.image}
            alt={pkg.imageAlt}
            fallbackLabel={pkg.title}
            className="w-full h-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tour booking"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-sm text-white inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>

          <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.06em] text-white/80 mb-1">
                {pkg.duration} · {pkg.destinations.join(' / ')}
              </p>
              <h3 id="booking-modal-title" className="text-[24px] font-medium text-white tracking-[-0.015em]">
                {pkg.title}
              </h3>
            </div>
            <div className="text-right text-white shrink-0">
              <span className="text-[22px] font-semibold tabular-nums">${pkg.pricePerGuest.toLocaleString()}</span>
              <span className="block text-[11px] text-white/80">per traveller</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {request ? (
            <div className="py-6 text-center max-w-[440px] mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#4694A4]/12 text-[#4694A4] inline-flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h4 className="text-[22px] font-medium text-[#171717] mb-2">Almost done</h4>
              <p className="text-[13px] text-[#666666] leading-relaxed mb-5">
                Send the prepared WhatsApp message to us and we will confirm
                availability and your final price, usually within an hour.
              </p>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-left text-[13px] space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Request reference</span>
                  <span className="font-semibold text-[#171717] tabular-nums">{request.ref}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-2">
                  <span className="text-neutral-500">Estimated total</span>
                  <span className="font-semibold text-[#171717] tabular-nums">${pricing.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={request.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171717] hover:bg-neutral-800 text-white px-7 py-2.5 text-[13px] font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  Open WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-neutral-200 hover:bg-neutral-50 px-7 py-2.5 text-[13px] font-medium text-[#404040] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-6 space-y-5">
                <div>
                  <h4 className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#4694A4] mb-2.5">
                    Included highlights
                  </h4>
                  <ul className="space-y-2">
                    {pkg.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px] text-[#404040] leading-snug">
                        <Check className="w-4 h-4 text-[#4694A4] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#4694A4] mb-2.5">
                    Sample itinerary
                  </h4>
                  <ol className="space-y-2 text-[12.5px] text-[#666666] leading-relaxed">
                    {pkg.itinerary.map((day) => (
                      <li key={day}>{day}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="md:col-span-6 space-y-4">
                <div>
                  <label htmlFor="booking-full-name" className="block text-[12px] font-medium text-[#171717] mb-1.5">
                    Full name
                  </label>
                  <input
                    id="booking-full-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                    className={inputClass}
                  />
                  {errors.fullName && <p role="alert" className="mt-1 text-[11.5px] text-red-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="booking-email" className="block text-[12px] font-medium text-[#171717] mb-1.5">
                    Email address
                  </label>
                  <input
                    id="booking-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={inputClass}
                  />
                  {errors.email && <p role="alert" className="mt-1 text-[11.5px] text-red-600">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="booking-date" className="block text-[12px] font-medium text-[#171717] mb-1.5">
                      Start date
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      value={travelDate}
                      onChange={(e) => {
                        setTravelDate(e.target.value);
                        if (errors.travelDate) setErrors((prev) => ({ ...prev, travelDate: undefined }));
                      }}
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[13px] text-[#171717] focus:outline-none focus:border-[#4694A4]"
                    />
                    {errors.travelDate && <p role="alert" className="mt-1 text-[11.5px] text-red-600">{errors.travelDate}</p>}
                  </div>

                  <div>
                    <span className="block text-[12px] font-medium text-[#171717] mb-1.5">Travellers</span>
                    <div className="flex items-center justify-between rounded-xl border border-neutral-200 px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        aria-label="Fewer travellers"
                        className="w-7 h-7 rounded-lg hover:bg-neutral-100 inline-flex items-center justify-center text-neutral-700 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span className="text-[13px] font-medium text-[#171717] tabular-nums" aria-live="polite">
                        {guests}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(MAX_TOUR_GUESTS, g + 1))}
                        aria-label="More travellers"
                        className="w-7 h-7 rounded-lg hover:bg-neutral-100 inline-flex items-center justify-center text-neutral-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-2.5 rounded-xl border border-neutral-200 p-3 cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={needsTransfer}
                    onChange={(e) => setNeedsTransfer(e.target.checked)}
                    className="mt-0.5 accent-[#4694A4]"
                  />
                  <span className="text-[12px] text-[#404040] leading-snug">
                    <span className="font-medium text-[#171717] inline-flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-[#4694A4]" aria-hidden="true" />
                      I also need an airport pick-up or drop-off
                    </span>
                    <span className="block text-neutral-500 mt-0.5">
                      We will add it to your quote at our fixed route price.
                    </span>
                  </span>
                </label>

                <div className="rounded-xl bg-neutral-50 border border-neutral-200/80 p-3.5 text-[12.5px] space-y-1.5">
                  <div className="flex justify-between text-neutral-600">
                    <span>
                      ${pkg.pricePerGuest.toLocaleString()} × {pricing.guests}{' '}
                      {pricing.guests === 1 ? 'traveller' : 'travellers'}
                    </span>
                    <span className="tabular-nums">${pricing.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#171717] border-t border-neutral-200 pt-2 text-[14px]">
                    <span>Estimated total</span>
                    <span className="tabular-nums">${pricing.total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#171717] hover:bg-neutral-800 text-white py-3 text-[13px] font-medium transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  Send request on WhatsApp
                </button>
                <p className="text-[11.5px] text-neutral-500 text-center">
                  No payment now. We confirm availability first.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
