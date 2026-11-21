import { motion } from 'motion/react';
import { ArrowLeft, Lock, MessageCircle } from 'lucide-react';
import { readBookingPrefill } from '../booking';
import { ExitIntentHelp } from '../components/booking/ExitIntentHelp';
import { TransferBookingSection } from '../components/TransferBookingSection';
import { CONTACT } from '../data/travelData';
import { Link, useLocation } from '../router';
import { buildWhatsAppLink } from '../utils/travelLogic';

/**
 * Stand-alone booking page (/book). Opened in a new tab from every "Book" button,
 * so it has a slim header and no site navigation, preloader or large footer.
 */
export function BookPage() {
  const { params } = useLocation();
  const { direction, townId, passengers } = readBookingPrefill(params);
  const help = buildWhatsAppLink(CONTACT.whatsappDigits, 'Hi! I need help with my airport transfer booking.');

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl"
      >
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/" className="text-[18px] font-medium tracking-[-0.02em] text-[#171717] shrink-0">
              {CONTACT.brand}
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#4694A4]/10 text-[#2C6F7D] px-3 py-1 text-[11.5px] font-medium">
              <Lock className="w-3 h-3" aria-hidden="true" />
              Airport transfer booking
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={help}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#404040] hover:text-[#171717] transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Need help?</span> WhatsApp
            </a>
            <Link
              to="/transfers"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-[12.5px] font-medium text-[#171717] hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Prices & routes
            </Link>
          </div>
        </div>
      </motion.header>

      <main>
        <TransferBookingSection
          initialDirection={direction}
          initialTownId={townId}
          initialPassengers={passengers}
          restoreDraft={!params.get('town')}
          compact
        />
      </main>
      <ExitIntentHelp />

      <footer className="max-w-[1180px] mx-auto px-6 md:px-10 pb-10 flex flex-col sm:flex-row justify-between gap-2 text-[11.5px] text-neutral-500">
        <p>
          © {new Date().getFullYear()} {CONTACT.brand} · {CONTACT.base}
        </p>
        <p>{CONTACT.hours}</p>
      </footer>
    </div>
  );
}
