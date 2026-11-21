import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';
import { CONTACT } from '../../data/travelData';
import { buildWhatsAppLink } from '../../utils/travelLogic';

const SEEN_KEY = 'travellah-exit-help-seen';
/** Only after the visitor has spent a little time on the page. */
const MIN_TIME_ON_PAGE_MS = 8000;

/**
 * Gentle exit-intent help: when a desktop visitor moves the mouse up to leave the
 * booking page, offer a human to ask, once per visit. No discounts or pressure,
 * easy to dismiss, never on touch screens.
 */
export function ExitIntentHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    try {
      if (window.sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      /* storage blocked: still show once for this page view */
    }

    const startedAt = Date.now();
    const onLeave = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 0) return; // only when leaving through the top
      if (Date.now() - startedAt < MIN_TIME_ON_PAGE_MS) return;
      setOpen(true);
      try {
        window.sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        /* ignore */
      }
      document.removeEventListener('mouseout', onLeave);
    };
    document.addEventListener('mouseout', onLeave);
    return () => document.removeEventListener('mouseout', onLeave);
  }, []);

  const link = buildWhatsAppLink(CONTACT.whatsappDigits, 'Hi! I have a question before I book my airport transfer.');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Need help with your booking?"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="fixed bottom-5 left-4 sm:left-6 z-50 w-[min(340px,calc(100vw-2rem))] rounded-2xl bg-white border border-neutral-200 shadow-[0_18px_50px_rgba(0,0,0,0.18)] p-5"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-3 right-3 w-7 h-7 rounded-full hover:bg-neutral-100 inline-flex items-center justify-center text-neutral-500 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
          <p className="text-[15px] font-medium text-[#171717] pr-6">Questions before you book?</p>
          <p className="mt-1.5 text-[12.5px] text-[#737373] leading-relaxed">
            Ask a local on WhatsApp about prices, luggage, child seats or anything else. Your
            booking is saved here, so you can finish it any time.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full bg-[#171717] hover:bg-[#262626] text-white px-4 py-2 text-[12.5px] font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Ask on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-2 text-[12.5px] font-medium text-[#404040] hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Keep booking
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
