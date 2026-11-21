import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { PACKAGES, type TravelPackage } from '../data/travelData';
import { ResilientImage } from './ResilientImage';
import { Eyebrow, SplitWords, unmaskProps } from './motion/effects';

interface PackagesSectionProps {
  onChoosePackage: (pkg: TravelPackage) => void;
  heading?: string;
  footer?: ReactNode;
}

export function PackagesSection({
  onChoosePackage,
  heading = 'Private tour packages from the *south coast*',
  footer,
}: PackagesSectionProps) {
  const [activeId, setActiveId] = useState(PACKAGES[0].id);

  return (
    <section id="packages" className="max-w-[1180px] mx-auto px-6 md:px-10 py-14 lg:py-20">
      <div className="text-center mb-10 lg:mb-12">
        <Eyebrow className="mb-3">OUR PACKAGE</Eyebrow>
        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] max-w-[740px] mx-auto text-balance">
          <SplitWords text={heading} />
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:h-[430px]">
        {PACKAGES.map((pkg, index) => {
          const isActive = pkg.id === activeId;

          return (
            <motion.article
              key={pkg.id}
              {...unmaskProps(index * 0.12)}
              data-active={isActive ? 'true' : 'false'}
              className={`group relative overflow-hidden rounded-[22px] h-[360px] md:h-[300px] lg:h-full transition-[flex] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? 'lg:flex-[2]' : 'lg:flex-1'
              }`}
            >
              <ResilientImage
                src={pkg.image}
                alt={pkg.imageAlt}
                fallbackLabel={pkg.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/25 to-black/10"
              />

              {!isActive && (
                <button
                  type="button"
                  onClick={() => setActiveId(pkg.id)}
                  aria-label={`Show ${pkg.title}`}
                  className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4694A4] focus-visible:outline-offset-[-3px] rounded-[22px]"
                />
              )}

              <div className="absolute top-5 left-5 right-5 z-10 pointer-events-none flex justify-between gap-3">
                <span className="inline-block rounded-full border border-white/55 bg-black/18 backdrop-blur-sm px-3.5 py-1 text-[11px] font-normal text-white">
                  {pkg.duration}
                </span>
                <span className="inline-block rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-medium text-[#171717] tabular-nums">
                  from ${pkg.pricePerGuest}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
                <div className={isActive ? 'max-w-[320px]' : 'max-w-[240px]'}>
                  <h3 className="text-[19px] sm:text-[20px] font-medium text-white tracking-[-0.01em] mb-1.5">
                    {pkg.title}
                  </h3>
                  <p className="text-[12px] text-white/82 leading-[1.5]">{pkg.subtitle}</p>
                </div>

                {isActive && (
                  <button
                    type="button"
                    onClick={() => onChoosePackage(pkg)}
                    className="pointer-events-auto self-start sm:self-end rounded-full border border-white/65 bg-white/15 hover:bg-white hover:text-[#171717] backdrop-blur-sm px-5 py-2 text-[12px] font-medium text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  >
                    View & book
                  </button>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      {footer}
    </section>
  );
}
