import {
  REVIEWS_ROW_1,
  REVIEWS_ROW_2,
  type ReviewItem,
} from '../data/travelData';
import { ResilientImage } from './ResilientImage';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Eyebrow, Reveal, SplitWords } from './motion/effects';

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <article className="rounded-[16px] border border-neutral-200/85 bg-white p-5 sm:p-6 flex flex-col justify-between h-full">
      <div className="flex items-center gap-3 mb-3.5">
        <ResilientImage
          src={review.avatar}
          alt={`Portrait of ${review.name}`}
          fallbackLabel={review.name.slice(0, 2)}
          className="w-9 h-9 rounded-full object-cover shrink-0 bg-neutral-100"
        />
        <h3 className="text-[14px] font-medium text-[#171717]">
          {review.name}
        </h3>
      </div>
      <p className="text-[12.5px] sm:text-[13px] text-[#666666] leading-[1.6]">
        {review.quote}
      </p>
    </article>
  );
}

export function ReviewsSection() {
  // the two desktop rows drift in opposite directions while the section scrolls past
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const rowOneX = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rowTwoX = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const featuredMobileReviews = [
    REVIEWS_ROW_1[1],
    REVIEWS_ROW_1[2],
    REVIEWS_ROW_2[1],
    REVIEWS_ROW_2[2],
  ];

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="py-16 lg:py-20 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 text-center mb-10 lg:mb-12">
        <Eyebrow className="mb-3">REVIEW</Eyebrow>
        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15]">
            <SplitWords text="Your trusted partner in *travel*" />
          </h2>
      </div>

      {/* Desktop 2-Row Faded-Edge Showcase matching the reference */}
      <div className="hidden lg:block relative max-w-[1320px] mx-auto overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-28 xl:w-36 bg-gradient-to-r from-white via-white/65 to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-36 xl:w-48 bg-gradient-to-l from-white via-white/85 to-transparent z-10"
        />

        <div className="space-y-4">
          <motion.div style={{ x: rowOneX }} className="grid grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.48fr)] gap-4 -mx-8">
            {REVIEWS_ROW_1.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </motion.div>

          <motion.div style={{ x: rowTwoX }} className="grid grid-cols-[minmax(0,0.88fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.48fr)] gap-4 -mx-8">
            {REVIEWS_ROW_2.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Responsive Grid for Mobile & Tablet */}
      <div className="lg:hidden max-w-[1180px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {featuredMobileReviews.map((review, i) => (
          <Reveal key={review.id} delay={(i % 2) * 0.1}>
            <ReviewCard review={review} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
