import { useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import { CtaBannerSection } from '../components/CtaBannerSection';
import { FaqSection } from '../components/FaqSection';
import { PageHero } from '../components/PageHero';
import { PackagesSection } from '../components/PackagesSection';
import { ResilientImage } from '../components/ResilientImage';
import { ReviewsSection } from '../components/ReviewsSection';
import { DAY_TOURS, IMAGES, TOUR_FAQS, type TravelPackage } from '../data/travelData';
import { Eyebrow, SplitWords, unmaskProps } from '../components/motion/effects';
import { motion } from 'motion/react';

export function ToursPage() {
  const [bookingPackage, setBookingPackage] = useState<TravelPackage | null>(null);

  return (
    <main>
      <PageHero
        eyebrow="TOUR PACKAGES"
        title="Private Sri Lanka tours for international *travellers*"
        intro="Multi-day packages and day trips with your own car and English-speaking driver-guide. Every tour can start at the airport or at your south coast hotel."
        image={IMAGES.toursHero}
        imageAlt="Temple beside a calm misty lake"
        location="Sri Lanka"
      >
        <a
          href="#packages"
          className="self-start lg:self-end inline-flex items-center gap-2 rounded-full bg-white text-[#171717] hover:bg-neutral-100 px-6 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors"
        >
          View packages
        </a>
      </PageHero>

      <PackagesSection
        onChoosePackage={setBookingPackage}
        heading="Multi-day tour packages, hotels and transport *included*"
      />

      <section id="day-tours" className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 lg:py-14">
        <Eyebrow className="mb-3">DAY TOURS</Eyebrow>
        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] mb-3.5 text-balance">
            <SplitWords text="Day trips from your south coast *hotel*" />
          </h2>
        <p className="text-[13px] sm:text-[14px] text-[#737373] max-w-[520px] leading-relaxed mb-8">
          Hotel pick-up and drop-off included. Prices are per person for a
          private tour of two people.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DAY_TOURS.map((tour, i) => (
            <motion.article key={tour.id} {...unmaskProps(i * 0.1)} className="spotlight group rounded-[22px] border border-neutral-200 overflow-hidden flex flex-col">
              <div className="h-[180px] overflow-hidden">
                <ResilientImage
                  src={tour.image}
                  alt={tour.imageAlt}
                  fallbackLabel={tour.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {tour.destinations.join(', ')}
                  </span>
                </div>
                <h3 className="mt-2 text-[17px] font-medium text-[#171717] leading-snug">{tour.title}</h3>
                <p className="mt-1.5 text-[12.5px] text-[#737373] leading-relaxed flex-1">{tour.subtitle}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[12px] text-neutral-500">
                    from <span className="text-[20px] font-medium text-[#171717] tabular-nums">${tour.pricePerGuest}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setBookingPackage(tour)}
                    className="rounded-full border border-neutral-300 hover:bg-[#171717] hover:text-white hover:border-[#171717] px-4 py-1.5 text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    View & book
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <FaqSection
        items={TOUR_FAQS}
        intro="Everything you need to know about our private tours before you book."
      />
      <ReviewsSection />
      <CtaBannerSection />
      <BookingModal pkg={bookingPackage} onClose={() => setBookingPackage(null)} />
    </main>
  );
}
