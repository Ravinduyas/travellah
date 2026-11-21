import { useState, type FormEvent } from 'react';
import { ArrowDown, ChevronDown, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { IMAGES, ROUTES } from '../data/travelData';
import { openBooking } from '../booking';
import { MAX_TRANSFER_PASSENGERS } from '../utils/travelLogic';
import { Magnetic, SplitWords } from './motion/effects';
import { useIntroDone } from './motion/intro';
import { ResilientImage } from './ResilientImage';
import { SiteHeader } from './SiteHeader';

const selectClass =
  'w-full appearance-none bg-transparent text-white text-[13px] py-2.5 pl-2 pr-7 focus:outline-none cursor-pointer [&>option]:bg-[#172226] [&>option]:text-white';

export function HeroSection() {
  const [direction, setDirection] = useState('pickup');
  const [town, setTown] = useState('');
  const [passengers, setPassengers] = useState('2');
  const introDone = useIntroDone();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openBooking({
      direction: direction === 'drop' ? 'drop' : 'pickup',
      town: town || undefined,
      pax: Number(passengers),
    });
  };

  return (
    <section
      id="home"
      className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-7 pt-4 sm:pt-5"
    >
      <div className="grain relative overflow-hidden rounded-[24px] min-h-[600px] lg:h-[670px] flex flex-col justify-between bg-[#25363D]">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.25 }}
          animate={{ scale: introDone ? 1 : 1.25 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full h-full photo-drift">
            <ResilientImage
              src={IMAGES.homeHero}
              priority
              alt="Tropical coastline with ocean cliffs"
              fallbackLabel="South coast, Sri Lanka"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/55"
        />

        <SiteHeader />

        <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 my-auto pt-4 pb-10">
          <h1 className="text-[30px] sm:text-[42px] lg:text-[48px] font-normal text-white leading-[1.16] tracking-[-0.02em] max-w-[860px] text-balance drop-shadow-[0_2px_16px_rgba(0,0,0,0.2)]">
            <SplitWords
              text="Colombo airport to the south coast, with a driver *waiting* when you land"
              play={introDone}
              delay={0.15}
            />
          </h1>

          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={introDone ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
            onSubmit={handleSubmit}
            aria-label="Check your airport transfer price"
            className="mt-7 sm:mt-8 w-full max-w-[680px] rounded-[24px] sm:rounded-full bg-black/40 backdrop-blur-md border border-white/28 p-2 sm:p-1.5 sm:pl-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 shadow-[0_12px_36px_rgba(0,0,0,0.22)]"
          >
            <div className="relative flex-1 flex items-center sm:border-r sm:border-white/20 sm:pr-3">
              <label htmlFor="hero-direction" className="sr-only">
                Transfer type
              </label>
              <select
                id="hero-direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className={selectClass}
              >
                <option value="pickup">Airport pick-up</option>
                <option value="drop">Airport drop-off</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/80 pointer-events-none absolute right-2 sm:right-3" aria-hidden="true" />
            </div>

            <div className="relative flex-1 flex items-center sm:border-r sm:border-white/20 sm:px-3">
              <label htmlFor="hero-town" className="sr-only">
                Your town
              </label>
              <select
                id="hero-town"
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className={selectClass}
              >
                <option value="">Your town</option>
                {ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.town}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/80 pointer-events-none absolute right-2 sm:right-3" aria-hidden="true" />
            </div>

            <div className="relative flex-1 flex items-center sm:px-3">
              <label htmlFor="hero-pax" className="sr-only">
                Passengers
              </label>
              <select
                id="hero-pax"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className={selectClass}
              >
                {Array.from({ length: MAX_TRANSFER_PASSENGERS }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'passenger' : 'passengers'}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/80 pointer-events-none absolute right-2 sm:right-3" aria-hidden="true" />
            </div>

            <Magnetic className="shrink-0" strength={0.25}>
              <button
                type="submit"
                className="w-full bg-white text-[#171717] hover:bg-neutral-100 active:scale-[0.98] transition-[background-color,transform] rounded-full px-8 py-2.5 text-[13px] font-medium whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                See price
              </button>
            </Magnetic>
          </motion.form>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
          className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5 px-6 sm:px-10 lg:px-12 pb-8"
        >
          <div className="max-w-[400px]">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-black/22 backdrop-blur-sm px-3.5 py-1.5 text-[12px] text-white/95 mb-3">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Ahangama · Weligama · Mirissa · Tangalle</span>
            </div>
            <p className="text-[13px] sm:text-[14px] text-white/92 leading-[1.55] font-light">
              Private airport transfers at fixed prices, plus tour packages
              around Sri Lanka for international travellers
            </p>
          </div>

          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-black/18 hover:bg-white/20 backdrop-blur-sm px-5 py-2.5 text-[12px] font-normal text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <span>Explore more</span>
            <ArrowDown className="w-3.5 h-3.5 motion-safe:animate-bounce" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
