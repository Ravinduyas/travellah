import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import { CONTACT } from '../../data/travelData';
import { finishIntro, markIntroSeen, shouldShowPreloader } from './intro';

// The road, drawn in a fixed 300×180 box so the car can follow the same path with CSS offset-path.
const ROAD = 'M18 26 C 96 6, 120 70, 150 84 S 214 118, 230 140 S 268 168, 284 160';
const DRAW_SECONDS = 1.5;
const HOLD_MS = 2100;

/**
 * First-visit loader: a winding road draws from the airport to the south coast,
 * a car drives it while the km counter runs, then the screen lifts away with a wave edge.
 */
export function Preloader() {
  const [show, setShow] = useState(shouldShowPreloader);
  const km = useMotionValue(0);
  const kmText = useTransform(km, (v) => `${Math.round(v)} km`);

  useEffect(() => {
    if (!show) return;
    markIntroSeen();
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const counter = animate(km, 180, { duration: DRAW_SECONDS, ease: [0.65, 0, 0.35, 1], delay: 0.25 });
    const timer = window.setTimeout(() => setShow(false), HOLD_MS);
    return () => {
      counter.stop();
      window.clearTimeout(timer);
      root.style.overflow = '';
    };
  }, [show, km]);

  return (
    <AnimatePresence onExitComplete={finishIntro}>
      {show && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[100] text-white"
          exit={{ y: '-112%' }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 bg-[#141E22]" />
          {/* wave edge that trails the lifting curtain */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="absolute left-0 top-full w-full h-[90px] -mt-px text-[#141E22]"
          >
            <path
              fill="currentColor"
              d="M0 0h1440v40c-120 40-240 60-360 40S840 20 720 40 480 100 360 90 120 30 0 60z"
            />
          </svg>

          <div className="relative h-full flex flex-col items-center justify-center px-4">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[22px] font-medium tracking-[-0.02em] mb-8"
            >
              {CONTACT.brand}
            </motion.p>

            <div className="relative w-[300px] h-[180px]">
              <svg viewBox="0 0 300 180" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
                {/* faint dashed lane markings */}
                <path d={ROAD} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" strokeLinecap="round" />
                <motion.path
                  d={ROAD}
                  fill="none"
                  stroke="#4694A4"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: DRAW_SECONDS, ease: [0.65, 0, 0.35, 1], delay: 0.25 }}
                />
                <path d={ROAD} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" strokeDasharray="3 7" />
                <circle cx="18" cy="26" r="5" fill="#fff" />
                <motion.circle
                  cx="284"
                  cy="160"
                  r="5"
                  fill="#fff"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.6, 1] }}
                  transition={{ delay: 0.25 + DRAW_SECONDS, duration: 0.45 }}
                />
              </svg>

              {/* the car rides the exact same path */}
              <motion.div
                aria-hidden="true"
                className="absolute left-0 top-0 w-4 h-4 rounded-[5px] bg-white shadow-[0_0_0_4px_rgba(70,148,164,0.45),0_0_24px_rgba(70,148,164,0.9)]"
                style={{ offsetPath: `path('${ROAD}')`, offsetRotate: 'auto' }}
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                transition={{ duration: DRAW_SECONDS, ease: [0.65, 0, 0.35, 1], delay: 0.25 }}
              />

              <span className="absolute -left-1 -top-6 text-[11px] uppercase tracking-[0.08em] text-white/65">
                CMB airport
              </span>
              <span className="absolute right-0 top-[172px] text-[11px] uppercase tracking-[0.08em] text-white/65">
                Weligama
              </span>
            </div>

            <div className="mt-10 flex items-baseline gap-3 text-white/70 text-[12px]">
              <motion.span className="text-[28px] font-medium text-white tabular-nums tracking-[-0.02em]">
                {kmText}
              </motion.span>
              <span>to the south coast</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
