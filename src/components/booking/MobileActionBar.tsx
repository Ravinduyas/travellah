import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Car, MessageCircle } from 'lucide-react';
import { Odometer } from '../motion/effects';
import { SENDING_MS } from './BookingParts';

interface MobileActionBarProps {
  /** id of the booking form; the main button submits it from outside the form */
  formId: string;
  step: number;
  isLast: boolean;
  /** the next screen is the review */
  reviewNext: boolean;
  onBack: () => void;
  total: number | null;
  perPerson: number | null;
  calculating: boolean;
  sending: boolean;
}

/**
 * Phones and tablets (below 1024px): a bar fixed to the bottom of the screen with Back,
 * the live price and the next action, so nobody has to scroll to find the price or the
 * button. It respects the iPhone home indicator through the safe-area inset.
 */
export function MobileActionBar({
  formId,
  step,
  isLast,
  reviewNext,
  onBack,
  total,
  perPerson,
  calculating,
  sending,
}: MobileActionBarProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.3 }}
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-[760px] mx-auto px-4 py-3 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to the previous step"
            className="w-11 h-11 shrink-0 rounded-full border border-neutral-200 inline-flex items-center justify-center text-[#171717] active:bg-neutral-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {/* live price */}
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="text-[10.5px] uppercase tracking-[0.06em] text-neutral-500">Your price</p>
          {total === null ? (
            <p className="text-[13px] text-neutral-500 truncate">Choose your town</p>
          ) : calculating ? (
            <span className="shimmer-light block mt-1 h-5 w-20 rounded-md" aria-label="Finding your price" />
          ) : (
            <p className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-[20px] font-medium tracking-[-0.02em] text-[#171717] leading-tight">
                <Odometer value={total} prefix="$" />
              </span>
              {perPerson !== null && (
                <span className="text-[11px] text-neutral-500 tabular-nums truncate">≈ ${perPerson} pp</span>
              )}
            </p>
          )}
        </div>

        {/* main action submits the form, so step checks run exactly as with the in-card button */}
        <button
          type="submit"
          form={formId}
          disabled={sending}
          aria-busy={sending}
          className="relative overflow-hidden h-11 shrink-0 rounded-full bg-[#171717] text-white px-5 text-[13px] font-medium inline-flex items-center gap-2 active:scale-[0.98] transition-transform cursor-pointer disabled:cursor-wait"
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
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
                  <Car className="w-4 h-4" />
                </span>
              </motion.span>
            )}
          </AnimatePresence>
          <span className="relative z-10 inline-flex items-center gap-2">
            {sending ? (
              'Preparing…'
            ) : isLast ? (
              <>
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Book now
              </>
            ) : (
              <>
                {reviewNext ? 'Review' : 'Continue'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
