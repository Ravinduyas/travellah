import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { useState } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { CONTACT } from '../../data/travelData';
import { buildWhatsAppLink } from '../../utils/travelLogic';

const RING_RADIUS = 21;

/**
 * Bottom-right floating actions: a back-to-top button whose ring fills with
 * scroll progress, and a WhatsApp button with a soft pulse that expands on hover.
 */
export function FloatingActions() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [showTop, setShowTop] = useState(false);
  const [hovered, setHovered] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setShowTop(y > 900));

  const whatsapp = buildWhatsAppLink(CONTACT.whatsappDigits, 'Hi! I would like to ask about an airport transfer.');

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="relative w-12 h-12 rounded-full bg-white/80 backdrop-blur-xl border border-neutral-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] text-[#171717] inline-flex items-center justify-center cursor-pointer"
          >
            <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
              <circle cx="24" cy="24" r={RING_RADIUS} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2" />
              <motion.circle
                cx="24"
                cy="24"
                r={RING_RADIUS}
                fill="none"
                stroke="#4694A4"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ pathLength: progress }}
              />
            </svg>
            <ArrowUp className="relative w-4 h-4" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.2 }}
        className="relative flex items-center h-14 rounded-full bg-[#171717] text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
      >
        {/* soft pulse rings */}
        <span aria-hidden="true" className="pulse-ring absolute inset-0 rounded-full" />
        <span aria-hidden="true" className="pulse-ring pulse-ring-delay absolute inset-0 rounded-full" />

        <span className="relative w-14 h-14 inline-flex items-center justify-center shrink-0">
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#171717]" />
        </span>
        <motion.span
          aria-hidden="true"
          className="relative overflow-hidden whitespace-nowrap text-[13px] font-medium"
          initial={false}
          animate={{ width: hovered ? 'auto' : 0, paddingRight: hovered ? 20 : 0, opacity: hovered ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          Chat with us
          <span className="block text-[10.5px] font-normal text-white/60">Usually replies in minutes</span>
        </motion.span>
      </motion.a>
    </div>
  );
}
