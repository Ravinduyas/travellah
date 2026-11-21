import { useState } from 'react';
import { ArrowRight, Car, Clock } from 'lucide-react';
import { AboutSection } from '../components/AboutSection';
import { BlogCard } from '../components/BlogCard';
import { BookingModal } from '../components/BookingModal';
import { CtaBannerSection } from '../components/CtaBannerSection';
import { FaqSection } from '../components/FaqSection';
import { HeroSection } from '../components/HeroSection';
import { PackagesSection } from '../components/PackagesSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { ServicesSection } from '../components/ServicesSection';
import { WhyUsStrip } from '../components/WhyUsStrip';
import { BLOG_POSTS } from '../data/blogData';
import { ROUTES, TRANSFER_FAQS, type TravelPackage } from '../data/travelData';
import { Link } from '../router';
import { Eyebrow, Reveal, SplitWords } from '../components/motion/effects';
import { BookingLink } from '../booking';

export function HomePage() {
  const [bookingPackage, setBookingPackage] = useState<TravelPackage | null>(null);
  const popularRoutes = ROUTES.filter((r) => r.popular);

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <WhyUsStrip />

      {/* Popular airport routes */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 lg:py-14">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Eyebrow className="mb-3">POPULAR ROUTES</Eyebrow>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] text-balance">
            <SplitWords text="Airport transfers at *fixed* prices" />
          </h2>
          </div>
          <Link
            to="/transfers#prices"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#171717] hover:text-[#3E8E9E] transition-colors whitespace-nowrap"
          >
            All routes and prices <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {popularRoutes.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08}>
            <BookingLink
              prefill={{ town: r.id }}
              className="spotlight group block h-full rounded-[22px] border border-neutral-200 hover:border-[#171717] p-6 transition-colors"
            >
              <p className="text-[12px] text-neutral-500">Colombo airport ↔</p>
              <h3 className="mt-1 text-[20px] font-medium text-[#171717] tracking-[-0.01em]">{r.town}</h3>
              <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-[#737373]">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {r.duration} · ~{r.distanceKm} km
              </p>
              {/* a little road: the lane markings scroll and the car drives across on hover */}
              <div aria-hidden="true" className="route-road relative mt-5 h-5">
                <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[2px] overflow-visible" preserveAspectRatio="none">
                  <line x1="0" y1="1" x2="100%" y2="1" stroke="#D4D4D4" strokeWidth="2" />
                </svg>
                <span className="route-car absolute top-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#3E8E9E]">
                  <Car className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-[12px] text-neutral-500">
                  from <span className="text-[24px] font-medium text-[#171717] tabular-nums">${r.carPrice}</span>
                </span>
                <span className="w-9 h-9 rounded-full border border-neutral-300 group-hover:bg-[#171717] group-hover:border-[#171717] group-hover:text-white inline-flex items-center justify-center transition-colors">
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </BookingLink>
            </Reveal>
          ))}
        </div>
      </section>

      <PackagesSection
        onChoosePackage={setBookingPackage}
        footer={
          <div className="mt-8 text-center">
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-300 hover:bg-[#171717] hover:text-white hover:border-[#171717] px-6 py-2.5 text-[13px] font-medium transition-colors"
            >
              See all tours and day trips <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      <FaqSection items={TRANSFER_FAQS.slice(0, 5)} />
      <ReviewsSection />

      <section className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 lg:py-14">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Eyebrow className="mb-3">FROM THE BLOG</Eyebrow>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] text-balance">
            <SplitWords text="Travel tips for Sri *Lanka*" />
          </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#171717] hover:text-[#3E8E9E] transition-colors whitespace-nowrap"
          >
            All articles <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((post, i) => (
            <BlogCard key={post.slug} post={post} delay={(i % 3) * 0.1} />
          ))}
        </div>
      </section>

      <CtaBannerSection />
      <BookingModal pkg={bookingPackage} onClose={() => setBookingPackage(null)} />
    </main>
  );
}
