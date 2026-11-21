import type { ReactNode } from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { SplitWords } from './motion/effects';
import { useIntroDone } from './motion/intro';
import { ResilientImage } from './ResilientImage';
import { SiteHeader } from './SiteHeader';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  location?: string;
  children?: ReactNode;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Shorter version of the home hero, used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  location = 'South coast, Sri Lanka',
  children,
}: PageHeroProps) {
  const ready = useIntroDone();
  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-7 pt-4 sm:pt-5">
      <div className="grain relative overflow-hidden rounded-[24px] min-h-[440px] lg:min-h-[480px] flex flex-col bg-[#25363D]">
        {/* slow zoom-out as the tide transition reveals the page */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={ready ? { scale: 1 } : undefined}
          transition={{ duration: 2.2, ease: EASE_OUT }}
        >
          <div className="w-full h-full photo-drift">
            <ResilientImage
              src={image}
              priority
              alt={imageAlt}
              fallbackLabel={eyebrow}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60"
        />

        <SiteHeader />

        <div className="relative z-10 mt-auto px-6 sm:px-10 lg:px-12 pb-9 pt-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-[720px]">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={ready ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-black/22 backdrop-blur-sm px-3.5 py-1.5 text-[12px] text-white/95 mb-4"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{location}</span>
            </motion.div>
            <p className="text-[11px] font-medium tracking-[0.06em] uppercase text-white/80 mb-2">
              //{eyebrow}
            </p>
            <h1 className="text-[30px] sm:text-[40px] lg:text-[46px] font-normal text-white leading-[1.14] tracking-[-0.02em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.2)] text-balance">
              <SplitWords text={title} play={ready} delay={0.4} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.85 }}
              className="mt-3 text-[13px] sm:text-[14px] text-white/90 leading-[1.6] font-light max-w-[560px]"
            >
              {intro}
            </motion.p>
          </div>
          {children && (
            <motion.div
              className="self-start lg:self-end"
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 1 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
