import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { CONTACT, NAV_LINKS } from '../../data/travelData';
import { Link, useLocation } from '../../router';
import { BookingLink } from '../../booking';

/** Current time in Sri Lanka, refreshed every 30 seconds. */
function useSriLankaTime() {
  const read = () => {
    const now = new Date();
    const time = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Colombo',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);
    const hour = Number(
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', hour: 'numeric', hourCycle: 'h23' }).format(now),
    );
    return { time, isDay: hour >= 6 && hour < 18 };
  };
  const [state, setState] = useState(read);
  useEffect(() => {
    const id = window.setInterval(() => setState(read()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return state;
}

function isActive(current: string, href: string) {
  if (href === '/') return current === '/';
  return current === href || current.startsWith(`${href}/`);
}

/**
 * Frosted-glass pill navigation that drops in once the visitor scrolls past the hero,
 * with a sliding active marker, the live local time in Weligama and a booking button.
 */
export function FloatingNav() {
  const { path } = useLocation();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const { time, isDay } = useSriLankaTime();

  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > 560));
  // Hide again on page change until the visitor scrolls.
  useEffect(() => setVisible(window.scrollY > 560), [path]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="floating-nav"
          aria-label="Quick navigation"
          initial={{ y: -90, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -90, opacity: 0, filter: 'blur(8px)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed top-3 inset-x-0 z-40 flex justify-center px-3 pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 rounded-full border border-white/50 bg-white/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(15,23,26,0.14),inset_0_1px_0_rgba(255,255,255,0.8)] p-1.5 pl-4">
            <Link to="/" className="text-[15px] font-medium tracking-[-0.02em] text-[#171717] mr-1 sm:mr-2">
              {CONTACT.brand}
            </Link>

            <ul className="hidden lg:flex items-center">
              {NAV_LINKS.map((link) => {
                const active = isActive(path, link.href);
                return (
                  <li key={link.href} className="relative">
                    {active && (
                      <motion.span
                        layoutId="floating-nav-active"
                        className="absolute inset-0 rounded-full bg-[#171717]/[0.06]"
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <Link
                      to={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative block px-3.5 py-2 text-[12.5px] whitespace-nowrap transition-colors ${
                        active ? 'text-[#171717] font-medium' : 'text-[#525252] hover:text-[#171717]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <span
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#171717]/[0.04] px-3 py-2 text-[11.5px] text-[#404040] tabular-nums"
              title="Local time in Weligama, Sri Lanka"
            >
              {isDay ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#4694A4]" aria-hidden="true" />
              )}
              <span className="sr-only">Local time in Weligama:</span>
              Weligama {time}
            </span>

            <BookingLink
              
              className="relative overflow-hidden rounded-full bg-[#171717] text-white px-4 sm:px-5 py-2 text-[12.5px] font-medium whitespace-nowrap hover:bg-[#262626] transition-colors"
            >
              Book transfer
              {/* light sheen that sweeps across the button every few seconds */}
              <span aria-hidden="true" className="sheen" />
            </BookingLink>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
