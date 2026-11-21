import { CheckCircle2 } from 'lucide-react';
import { WHY_US } from '../data/travelData';

/** Endless marquee of service promises with faded edges. Pauses on hover. */
export function WhyUsStrip() {
  // The list is rendered twice so the track can loop seamlessly at -50%.
  const loop = [...WHY_US, ...WHY_US];

  return (
    <section aria-label="Why travel with us" className="marquee relative py-12 lg:py-14 overflow-hidden">
      <ul className="sr-only">
        {WHY_US.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-10"
      />

      <div aria-hidden="true" className="marquee-track flex w-max items-center text-[#141414]">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-2.5 whitespace-nowrap px-7 sm:px-10 text-[18px] sm:text-[24px] font-medium tracking-[-0.02em]"
          >
            <CheckCircle2 className="w-5 h-5 text-[#4694A4] shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
