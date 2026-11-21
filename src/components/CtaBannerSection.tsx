import { MessageCircle } from 'lucide-react';
import { CONTACT, IMAGES } from '../data/travelData';
import { buildWhatsAppLink } from '../utils/travelLogic';
import { Magnetic, SplitWords } from './motion/effects';
import { ResilientImage } from './ResilientImage';
import { BookingLink } from '../booking';

export function CtaBannerSection() {
  const whatsapp = buildWhatsAppLink(
    CONTACT.whatsappDigits,
    'Hi! I would like to book an airport transfer.',
  );

  return (
    <section id="book-cta" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-7 pt-8 pb-8">
      <div className="grain relative overflow-hidden rounded-[24px] min-h-[420px] lg:h-[500px] flex flex-col items-center justify-center text-center px-6 py-16 bg-[#263237]">
        <ResilientImage
          src={IMAGES.cta}
          alt="Couple walking toward green hills"
          fallbackLabel="Book your transfer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/36 to-black/42"
        />

        <div className="relative z-10 w-full max-w-[960px] flex flex-col items-center -mt-6 lg:-mt-10">
          <h2 className="text-[26px] sm:text-[36px] lg:text-[42px] font-normal text-white leading-[1.18] tracking-[-0.02em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.24)] max-w-[760px] text-balance">
            <SplitWords text="Landing in Sri Lanka soon? Book your airport pick-up *before* you fly" stagger={0.06} />
          </h2>
          <p className="mt-3 text-[13px] sm:text-[14px] text-white/90 max-w-[520px]">
            Fixed price, flight tracking and a driver waiting at arrivals. We
            usually reply on WhatsApp within minutes.
          </p>

          <div className="mt-7 w-full max-w-[460px] rounded-[24px] sm:rounded-full bg-black/32 backdrop-blur-md border border-white/42 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <Magnetic className="flex-1 flex" strength={0.2}>
            <BookingLink
              
              className="flex-1 text-center bg-white text-[#171717] hover:bg-neutral-100 transition-colors rounded-full px-7 py-2.5 text-[13px] font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              Book a transfer
            </BookingLink>
            </Magnetic>
            <Magnetic className="flex-1 flex" strength={0.2}>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 text-white hover:bg-white/15 transition-colors rounded-full px-7 py-2.5 text-[13px] font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              WhatsApp us
            </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
