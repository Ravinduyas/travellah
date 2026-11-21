import { Briefcase, Users } from 'lucide-react';
import { CtaBannerSection } from '../components/CtaBannerSection';
import { FaqSection } from '../components/FaqSection';
import { PageHero } from '../components/PageHero';
import { BookingLauncher } from '../components/BookingLauncher';
import { CONTACT, IMAGES, ROUTES, TRANSFER_FAQS, TRANSFER_STEPS, VEHICLES } from '../data/travelData';
import { useLocation } from '../router';
import { MAX_TRANSFER_PASSENGERS, calculateTransferQuote } from '../utils/travelLogic';
import { motion } from 'motion/react';
import { Eyebrow, Reveal, SplitWords } from '../components/motion/effects';
import { BookingLink } from '../booking';

export function TransfersPage() {
  const { params } = useLocation();

  const direction = params.get('direction') === 'drop' ? 'drop' : 'pickup';
  const townParam = params.get('town') ?? '';
  const townId = ROUTES.some((r) => r.id === townParam) ? townParam : '';
  const paxParam = Number(params.get('pax'));
  const passengers =
    Number.isInteger(paxParam) && paxParam >= 1 && paxParam <= MAX_TRANSFER_PASSENGERS ? paxParam : 2;

  return (
    <main>
      <PageHero
        eyebrow="AIRPORT TRANSFERS"
        title="Colombo airport pick-up and drop-off for the *south coast*"
        intro={`Private, air-conditioned transfers between ${CONTACT.airport} and Galle, Weligama, Mirissa, Tangalle and every town in between. Fixed prices, tolls included.`}
        image={IMAGES.transfersHero}
        imageAlt="Coastal road above a turquoise bay"
      >
        <BookingLink
          prefill={{ direction }}
          className="self-start lg:self-end inline-flex items-center gap-2 rounded-full bg-white text-[#171717] hover:bg-neutral-100 px-6 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors"
        >
          Book your transfer
        </BookingLink>
      </PageHero>

      <BookingLauncher
        initialDirection={direction}
        initialTownId={townId}
        initialPassengers={passengers}
      />

      {/* Quick answers: question-shaped headings with one-sentence factual answers
          (for answer engines and AI assistants). Built from the same price data as the table. */}
      <section id="quick-answers" className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 lg:py-14">
        <Eyebrow className="mb-3">QUICK ANSWERS</Eyebrow>
        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] mb-8 text-balance">
          <SplitWords text="Colombo Airport to the south coast, in *numbers*" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROUTES.filter((r) => r.popular).map((r, i) => {
            const van = VEHICLES.find((v) => v.id === 'van') ?? VEHICLES[0];
            const vanPrice = calculateTransferQuote(r.carPrice, van.multiplier, 'one-way').total;
            return (
              <Reveal key={r.id} delay={i * 0.06} className="rounded-[22px] border border-neutral-200 p-6">
                <h3 className="text-[16px] font-medium text-[#171717] leading-snug">
                  How much is a taxi from Colombo Airport to {r.town}?
                </h3>
                <p className="mt-2 text-[13.5px] text-[#525252] leading-relaxed">
                  {`A private transfer from Colombo Airport (CMB) to ${r.town} costs $${r.carPrice} one way in a sedan for up to ${VEHICLES[0].seats} people, or $${vanPrice} in a van for up to ${van.seats}. The drive is about ${r.distanceKm} km and takes around ${r.duration} on the expressway. The price is per vehicle and includes tolls, flight tracking and 60 minutes of free waiting.`}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Prices by route */}
      <section id="prices" className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 lg:py-14">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Eyebrow className="mb-3">PRICES & ROUTES</Eyebrow>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] text-balance">
            <SplitWords text="*Fixed* prices from Colombo airport" />
          </h2>
          </div>
          <p className="text-[13px] text-[#737373] max-w-[380px] leading-relaxed">
            One-way prices in USD per vehicle. The same price applies in both
            directions and at any time of day or night.
          </p>
        </div>

        <div className="relative overflow-x-auto rounded-[22px] border border-neutral-200">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-neutral-50 text-[11.5px] uppercase tracking-[0.04em] text-neutral-500">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-medium">Town</th>
                <th scope="col" className="px-5 py-3.5 font-medium">Distance</th>
                <th scope="col" className="px-5 py-3.5 font-medium">Drive time</th>
                {VEHICLES.map((v) => (
                  <th key={v.id} scope="col" className="px-5 py-3.5 font-medium text-right">
                    {v.name}
                  </th>
                ))}
                <th scope="col" className="px-5 py-3.5"><span className="sr-only">Book</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {ROUTES.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/70">
                  <th scope="row" className="px-5 py-3.5 font-medium text-[#171717] whitespace-nowrap">
                    {r.town}
                    {r.popular && (
                      <span className="ml-2 rounded-full bg-[#4694A4]/10 text-[#3E8E9E] px-2 py-0.5 text-[10.5px] font-medium">
                        Popular
                      </span>
                    )}
                  </th>
                  <td className="px-5 py-3.5 text-neutral-600 tabular-nums whitespace-nowrap">~{r.distanceKm} km</td>
                  <td className="px-5 py-3.5 text-neutral-600 whitespace-nowrap">{r.duration}</td>
                  {VEHICLES.map((v) => (
                    <td key={v.id} className="px-5 py-3.5 text-right font-medium text-[#171717] tabular-nums">
                      ${calculateTransferQuote(r.carPrice, v.multiplier, 'one-way').total}
                    </td>
                  ))}
                  <td className="px-5 py-3.5 text-right">
                    <BookingLink
                      prefill={{ direction, town: r.id }}
                      className="rounded-full border border-neutral-300 hover:bg-[#171717] hover:text-white hover:border-[#171717] px-3.5 py-1.5 text-[12px] font-medium transition-colors whitespace-nowrap"
                    >
                      Book
                    </BookingLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-neutral-500">
          Town not listed? Message us. We go anywhere in Sri Lanka.
        </p>
      </section>

      {/* Vehicles */}
      <section id="vehicles" className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 lg:py-14">
        <Eyebrow className="mb-3">OUR VEHICLES</Eyebrow>
        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] mb-8 text-balance">
            <SplitWords text="A clean, air-conditioned ride for every *group*" />
          </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {VEHICLES.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.1} className="spotlight rounded-[22px] border border-neutral-200 p-6 flex flex-col">
              <h3 className="text-[20px] font-medium text-[#171717] tracking-[-0.01em]">{v.name}</h3>
              <p className="text-[12.5px] text-neutral-500 mt-1">{v.example}</p>
              <div className="flex gap-5 mt-5 text-[13px] text-[#404040]">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#4694A4]" aria-hidden="true" /> {v.seats} people
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#4694A4]" aria-hidden="true" /> {v.bags} bags
                </span>
              </div>
              <ul className="mt-5 space-y-1.5 text-[12.5px] text-[#666666] flex-1">
                {v.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-neutral-200 text-[12.5px] text-neutral-500">
                Weligama from{' '}
                <span className="text-[18px] font-medium text-[#171717] tabular-nums">
                  ${calculateTransferQuote(ROUTES.find((r) => r.id === 'weligama')?.carPrice ?? 0, v.multiplier, 'one-way').total}
                </span>
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 lg:py-14">
        <Eyebrow className="mb-3">HOW IT WORKS</Eyebrow>
        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] mb-8 text-balance">
            <SplitWords text="From landing to the beach in *four* steps" />
          </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRANSFER_STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
              className="rounded-[22px] bg-neutral-50 border border-neutral-200/80 p-6"
            >
              {/* step number draws in like a route marker */}
              <span className="inline-flex items-center gap-2 text-[13px] font-medium text-[#4694A4] tabular-nums">
                0{i + 1}
                <motion.span
                  aria-hidden="true"
                  className="block h-px w-10 bg-[#4694A4] origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.3 + i * 0.12 }}
                />
              </span>
              <h3 className="mt-3 text-[17px] font-medium text-[#171717]">{step.title}</h3>
              <p className="mt-2 text-[13px] text-[#737373] leading-relaxed">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <FaqSection items={TRANSFER_FAQS} />
      <CtaBannerSection />
    </main>
  );
}
