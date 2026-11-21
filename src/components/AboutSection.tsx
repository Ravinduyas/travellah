import { ABOUT_STATS } from '../data/travelData';
import { CountUp, Eyebrow } from './motion/effects';

export function AboutSection() {
  return (
    <section
      id="about"
      className="max-w-[1180px] mx-auto px-6 md:px-10 pt-20 pb-16 lg:pt-24 lg:pb-20"
    >
      <Eyebrow className="mb-4">ABOUT US</Eyebrow>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
        <div className="lg:col-span-7">
          <h2 className="text-[26px] sm:text-[31px] lg:text-[34px] font-normal leading-[1.3] tracking-[-0.015em]">
            <span className="text-[#171717]">
              We are a local team from Sri Lanka’s south coast, getting
              travellers safely between Colombo airport and the beach.{' '}
            </span>
            <span className="text-[#9E9E9E]">
              When you are settled in, we show you the rest of the island on
              private tours.
            </span>
          </h2>
        </div>

        <div className="lg:col-span-5 flex items-center lg:justify-end">
          <div className="grid grid-cols-3 w-full sm:w-auto">
            {ABOUT_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center px-3 sm:px-6 ${
                  index < ABOUT_STATS.length - 1 ? 'border-r border-neutral-200' : ''
                }`}
              >
                <span className="text-[26px] sm:text-[30px] font-medium tracking-[-0.02em] text-[#171717] tabular-nums leading-none mb-2">
                  <CountUp value={stat.value} />
                </span>
                <span className="text-[12px] text-[#7A7A7A] sm:whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
