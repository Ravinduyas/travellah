import type { ReactNode } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { Car, Check } from 'lucide-react';

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** How long the price panel shows its "finding your price" state after a change. */
export const CALCULATING_MS = 650;
/** How long the book button shows "Preparing your booking" before WhatsApp opens.
 *  Kept short so browsers still treat the WhatsApp window as a response to the click. */
export const SENDING_MS = 700;

export const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] text-[#171717] transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#4694A4] focus:shadow-[0_0_0_4px_rgba(70,148,164,0.12)]';
export const labelClass = 'block text-[12px] font-medium text-[#171717] mb-1.5';

// Rows inside a step load in one after another.
export const stepRowsVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
export const rowVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT } },
};

export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={rowVariants} className={className}>
      {children}
    </motion.div>
  );
}

/** Error message that slides open under its field. */
export function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key="error"
          role="alert"
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="overflow-hidden text-[11.5px] text-red-600"
        >
          <span className="block pt-1">{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/** Segmented switch whose dark pill slides to the chosen option. */
export function SegmentedToggle<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  className = '',
  tone = 'light',
}: {
  id: string;
  label: string;
  value: T;
  options: { value: T; label: string; icon?: ReactNode }[];
  onChange: (value: T) => void;
  className?: string;
  /** 'dark' for use on dark panels */
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <div className={`flex rounded-full border p-1 ${dark ? 'border-white/15' : 'border-neutral-200'} ${className}`} role="group" aria-label={label}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`relative flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium cursor-pointer transition-colors duration-300 ${
              active
                ? dark ? 'text-[#171717]' : 'text-white'
                : dark ? 'text-white/70 hover:text-white' : 'text-[#404040] hover:text-[#171717]'
            }`}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className={`absolute inset-0 rounded-full ${dark ? 'bg-white' : 'bg-[#171717]'}`}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** The price panel's loading state: a route draws from the airport to the town while a car drives it. */
export function PriceLoading({ from, to }: { from: string; to: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(4px)' }}
      transition={{ duration: 0.2 }}
      aria-label="Finding your fixed price"
    >
      <div className="flex justify-between text-[11px] uppercase tracking-[0.06em] text-white/55">
        <span>{from}</span>
        <span>{to}</span>
      </div>
      <div className="relative mt-3 h-6">
        <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/15" />
        <motion.span
          className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#4694A4] origin-left w-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: CALCULATING_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
        />
        <motion.span
          className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 rounded-full bg-white text-[#171717] inline-flex items-center justify-center shadow-[0_0_16px_rgba(70,148,164,0.8)]"
          initial={{ left: '0%' }}
          animate={{ left: '100%' }}
          transition={{ duration: CALCULATING_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
        >
          <Car className="w-3.5 h-3.5" aria-hidden="true" />
        </motion.span>
      </div>
      <p className="mt-4 text-[13px] text-white/80">Finding your fixed price…</p>
      <div className="mt-6 pt-5 border-t border-white/15 flex items-end justify-between">
        <span className="shimmer-dark block h-3 w-20 rounded-full" />
        <span className="shimmer-dark block h-8 w-24 rounded-lg" />
      </div>
      <span className="shimmer-dark block mt-3 h-2.5 w-44 rounded-full" />
    </motion.div>
  );
}

/** Check mark that draws itself inside a pulsing ring. */
export function DrawnCheck() {
  return (
    <div className="relative w-14 h-14 mx-auto mb-5">
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#4694A4]/20"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.5, 1.5], opacity: [0, 0.6, 0] }}
        transition={{ duration: 1.2, delay: 0.35, ease: 'easeOut' }}
      />
      <motion.svg
        viewBox="0 0 56 56"
        className="relative w-14 h-14"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r="27" fill="#4694A4" />
        <motion.path
          d="M17 29 L25 37 L40 20"
          fill="none"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
        />
      </motion.svg>
    </div>
  );
}

/**
 * Step bar drawn as a road: the filled lane grows to the current step and a car rides at its head.
 * Steps already reached can be clicked to go back.
 */
export function BookingStepper({
  steps,
  current,
  maxReached,
  onSelect,
}: {
  steps: readonly { id: string; label: string }[];
  current: number;
  maxReached: number;
  onSelect: (index: number) => void;
}) {
  const progress = steps.length > 1 ? current / (steps.length - 1) : 0;

  return (
    <nav aria-label="Booking steps" className="mb-5">
      <p className="sr-only">
        Step {current + 1} of {steps.length}: {steps[current].label}
      </p>
      <div className="relative px-4">
        {/* the road, running through the centres of the step circles */}
        <div className="absolute left-8 right-8 top-[15px] h-[3px] rounded-full bg-neutral-200" />
        <div className="absolute left-8 right-8 top-[15px] h-[3px]">
          <motion.div
            className="h-full rounded-full bg-[#4694A4] origin-left"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
        {/* own layer above the circles (the road stays behind them) */}
        <div className="absolute left-8 right-8 top-[15px] h-[3px] z-10">
          {/* the car sits on the current step's circle and drives to the next one */}
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#4694A4] text-white inline-flex items-center justify-center ring-4 ring-[#4694A4]/20 shadow-[0_6px_14px_rgba(70,148,164,0.35)] pointer-events-none"
            initial={false}
            animate={{ left: `${progress * 100}%` }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <Car className="w-4 h-4" />
          </motion.span>
        </div>

        <ol className="relative flex justify-between">
          {steps.map((step, i) => {
            const done = i < current;
            const active = i === current;
            const reachable = i <= maxReached && !active;
            return (
              <li key={step.id} className="flex flex-col items-center w-8">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => onSelect(i)}
                  aria-current={active ? 'step' : undefined}
                  aria-label={`${step.label}${done ? ' (done)' : ''}`}
                  className={`relative w-8 h-8 rounded-full inline-flex items-center justify-center text-[12px] font-medium tabular-nums transition-colors duration-300 ${
                    active
                      ? 'bg-[#4694A4] text-white ring-4 ring-[#4694A4]/20'
                      : done
                        ? 'bg-[#171717] text-white'
                        : 'bg-white text-neutral-400 border border-neutral-200'
                  } ${reachable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {done ? (
                      <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </motion.span>
                    ) : (
                      <motion.span key="num" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <span
                  className={`mt-2 text-[11px] whitespace-nowrap transition-colors ${
                    active ? 'text-[#171717] font-medium' : 'text-neutral-500 hidden sm:block'
                  }`}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
