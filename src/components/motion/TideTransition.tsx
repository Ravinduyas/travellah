import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  CalendarCheck,
  Compass,
  House,
  MessageCircle,
  TreePalm,
  PlaneLanding,
  type LucideIcon,
} from 'lucide-react';
import { BOOKING_PATH } from '../../booking';

const EASE = [0.76, 0, 0.24, 1] as const;
/** The layers hold still briefly so the icon can be seen before the tide recedes. */
const HOLD = 0.18;

/** The icon shown while moving to each page. */
function iconFor(path: string): LucideIcon {
  if (path === '/') return House;
  if (path === '/transfers') return PlaneLanding;
  if (path === '/tours') return TreePalm;
  if (path === '/blog' || path.startsWith('/blog/')) return BookOpen;
  if (path === '/contact') return MessageCircle;
  if (path === BOOKING_PATH) return CalendarCheck;
  return Compass;
}

function Wave({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`absolute left-0 top-full w-full h-[80px] -mt-px ${className}`}
    >
      <path fill="currentColor" d="M0 0h1440v50c-160 50-320 60-480 30S640 10 480 40 160 110 0 70z" />
    </svg>
  );
}

/**
 * On every page change, two layers (dark, then teal) recede upward like a tide,
 * revealing the new page. The dark layer carries an icon for the destination page.
 * It is keyed by path, so it mounts in the same render as the new page and there
 * is no flash. It never plays on the first load.
 */
export function TideTransition({ path }: { path: string }) {
  const reduce = useReducedMotion();
  const firstPath = useRef(path);
  const hasNavigated = useRef(false);
  if (path !== firstPath.current) hasNavigated.current = true;

  if (reduce || !hasNavigated.current) return null;

  const Icon = iconFor(path);

  return (
    <div key={path} aria-hidden="true" className="fixed inset-0 z-[90] pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-[#4694A4]"
        initial={{ y: '0%' }}
        animate={{ y: '-120%' }}
        transition={{ duration: 0.85, ease: EASE, delay: HOLD + 0.12 }}
      >
        <Wave className="text-[#4694A4]" />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-[#141E22] flex items-center justify-center"
        initial={{ y: '0%' }}
        animate={{ y: '-120%' }}
        transition={{ duration: 0.8, ease: EASE, delay: HOLD }}
      >
        <Wave className="text-[#141E22]" />

        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* soft ring that pulses out behind the icon */}
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-[#4694A4]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1, 1.35], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
          />
          <motion.span
            className="absolute inset-3 rounded-full bg-[#4694A4]/15"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          />
          {/* the page icon pops in with a little tilt, then rises away with the tide */}
          <motion.span
            className="relative text-white"
            initial={{ scale: 0.4, rotate: -18, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1, y: [0, 0, -18] }}
            transition={{
              scale: { type: 'spring', stiffness: 380, damping: 16 },
              rotate: { type: 'spring', stiffness: 260, damping: 14 },
              opacity: { duration: 0.15 },
              y: { duration: 0.8, times: [0, 0.45, 1], ease: 'easeIn' },
            }}
          >
            <Icon className="w-10 h-10" strokeWidth={1.6} />
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
