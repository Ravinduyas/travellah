import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type PointerEvent,
  type ReactNode,
} from 'react';
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { pageZoom } from '../../utils/pageZoom';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* SplitWords — each word rises out of its own mask, slightly blurred  */
/* ------------------------------------------------------------------ */

/** Marks words inside *asterisks* (which may span several words) as accent words. */
function parseAccents(words: string[]) {
  let inAccent = false;
  return words.map((raw) => {
    let core = raw;
    let open = inAccent;
    if (core.startsWith('*')) {
      open = true;
      core = core.slice(1);
    }
    let trailing = '';
    let close = false;
    const end = core.match(/^(.*?)\*([^*]*)$/);
    if (open && end) {
      core = end[1];
      trailing = end[2];
      close = true;
    }
    inAccent = open && !close;
    return { raw: raw.replace(/\*/g, ''), core, trailing, accent: open };
  });
}

interface SplitWordsProps {
  text: string;
  /** Controlled trigger (e.g. after the preloader). Omit to play when scrolled into view. */
  play?: boolean;
  delay?: number;
  stagger?: number;
}

export function SplitWords({ text, play, delay = 0, stagger = 0.045 }: SplitWordsProps) {
  const words = text.split(/\s+/).filter(Boolean);
  const trigger =
    play === undefined
      ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } }
      : { animate: play ? 'show' : 'hidden' };

  return (
    <motion.span
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {parseAccents(words).map(({ raw, core, trailing, accent }, i) => {
        // "*word*" or "*several words*" are set in the italic serif accent
        const word = accent ? (
          <>
            <span className="accent-serif">{core}</span>
            {trailing}
          </>
        ) : (
          raw
        );
        return (
        <span key={`${raw}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '105%', rotate: 4, filter: 'blur(6px)' },
              show: { y: '0%', rotate: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: EASE_OUT } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
        );
      })}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Eyebrow — the //SECTION label types itself with a blinking caret    */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children, className = 'mb-3' }: { children: string; className?: string }) {
  const full = `//${children}`;
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setCount(full.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= full.length) window.clearInterval(id);
    }, 38);
    return () => window.clearInterval(id);
  }, [inView, reduce, full.length]);

  const typing = count < full.length;

  return (
    <p
      ref={ref}
      className={`text-[11px] font-medium tracking-[0.04em] uppercase text-[#4694A4] ${className}`}
    >
      <span className="sr-only">{full}</span>
      {/* inline box: works in left-aligned and centered sections; the invisible copy reserves the final width */}
      <span aria-hidden="true" className="relative inline-block">
        <span className="invisible before:content-[attr(data-text)]" data-text={full} />
        <span className="absolute left-0 top-0 whitespace-nowrap">
          {full.slice(0, count)}
          <span
            className={`inline-block w-[6px] h-[1.05em] align-[-0.15em] ml-[2px] bg-current ${
              typing ? '' : 'caret-blink'
            }`}
          />
        </span>
      </span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal — fade and rise into view                                    */
/* ------------------------------------------------------------------ */

type RevealProps = ComponentProps<typeof motion.div> & { delay?: number; y?: number };

export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Unmask — a card opens like a window as it scrolls into view         */
/* ------------------------------------------------------------------ */

export const unmaskProps = (delay = 0) => ({
  initial: { clipPath: 'inset(14% 10% 14% 10% round 28px)', scale: 1.04, opacity: 0.4 },
  whileInView: { clipPath: 'inset(0% 0% 0% 0% round 22px)', scale: 1, opacity: 1 },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
  transition: { duration: 1.1, ease: EASE_OUT, delay },
});

export function Unmask({
  delay = 0,
  children,
  className,
}: {
  delay?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} {...unmaskProps(delay)}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — "~2.5h", "12", "24/7": counts the first number it finds   */
/* ------------------------------------------------------------------ */

export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!match || !inView) return;
    const [, prefix, numText, suffix] = match;
    const target = Number(numText);
    const decimals = numText.includes('.') ? numText.split('.')[1].length : 0;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, value]); // `match` is derived from `value`

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Odometer — digits roll vertically when the number changes           */
/* ------------------------------------------------------------------ */

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function Odometer({ value, prefix = '' }: { value: number; prefix?: string }) {
  const chars = String(Math.round(value)).split('');

  return (
    <span className="inline-flex items-baseline tabular-nums" aria-label={`${prefix}${value}`}>
      <span aria-hidden="true">{prefix}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((ch, i) => {
          // key from the right so the ones column stays the same column as the number grows
          const key = chars.length - i;
          return (
            <span key={key} className="relative inline-block h-[1em] overflow-hidden leading-none">
              <motion.span
                className="flex flex-col"
                initial={false}
                animate={{ y: `-${Number(ch) * 10}%` }}
                transition={{ type: 'spring', stiffness: 140, damping: 20, mass: 0.8 }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="h-[1em] leading-none">
                    {d}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic — the element leans toward the pointer                     */
/* ------------------------------------------------------------------ */

export function Magnetic({
  children,
  strength = 0.35,
  className = 'inline-block',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const zoom = pageZoom(); // keep the pull the same size on scaled-up large screens
    x.set(((e.clientX - (rect.left + rect.width / 2)) * strength) / zoom);
    y.set(((e.clientY - (rect.top + rect.height / 2)) * strength) / zoom);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div className={className} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* ReadingProgress — a road along the top with a car driving to the end */
/* ------------------------------------------------------------------ */

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const carLeft = useTransform(progress, (p) => `calc(${p * 100}% - 10px)`);

  return (
    <div aria-hidden="true" className="fixed top-0 inset-x-0 z-[60] h-[3px] bg-black/5 pointer-events-none">
      <motion.div className="h-full bg-[#4694A4] origin-left" style={{ scaleX: progress }} />
      <motion.div
        className="absolute -top-[5px] w-5 h-[13px] rounded-[4px] bg-[#171717] shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
        style={{ left: carLeft }}
      >
        <span className="absolute right-[2px] top-[3px] w-[4px] h-[7px] rounded-[1px] bg-[#9fd7e2]" />
      </motion.div>
    </div>
  );
}
