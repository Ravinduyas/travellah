import { ArrowUpRight } from 'lucide-react';
import { SERVICES, type ServiceItem } from '../data/travelData';
import { Link } from '../router';
import { ResilientImage } from './ResilientImage';
import { Eyebrow, SplitWords, Unmask } from './motion/effects';

function ServiceCard({ service, tall }: { service: ServiceItem; tall?: boolean }) {
  return (
    <Link
      to={service.href}
      className={`group relative block overflow-hidden rounded-[22px] text-left w-full focus-visible:outline-2 focus-visible:outline-[#4694A4] focus-visible:outline-offset-2 ${
        tall ? 'h-[380px] sm:h-[440px] md:h-[520px]' : 'h-[240px] sm:h-[250px]'
      }`}
    >
      <ResilientImage
        src={service.image}
        alt={service.imageAlt}
        fallbackLabel={service.title}
        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
      />
      <span
        aria-hidden="true"
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm border border-white/45 text-white inline-flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-[#171717]"
      >
        <ArrowUpRight className="w-4 h-4" />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <h3 className="text-[20px] sm:text-[22px] font-medium text-white tracking-[-0.01em] mb-1.5">
          {service.title}
        </h3>
        <p className="text-[12px] sm:text-[13px] text-white/82 leading-relaxed max-w-[400px]">
          {service.subtitle}
        </p>
      </div>
    </Link>
  );
}

export function ServicesSection() {
  const [tallService, ...stackedServices] = SERVICES;

  return (
    <section id="services" className="max-w-[1180px] mx-auto px-6 md:px-10 py-10 lg:py-14">
      <div className="mb-10">
        <Eyebrow className="mb-3">OUR SERVICE</Eyebrow>
        <h2 className="text-[32px] sm:text-[40px] lg:text-[44px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] mb-3.5 text-balance">
            <SplitWords text="From the airport to the beach, and *beyond*" />
          </h2>
        <p className="text-[13px] sm:text-[14px] text-[#737373] max-w-[520px] leading-relaxed">
          Private airport transfers are what we do every day. When you want to
          explore, the same trusted drivers take you around the island.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        <Unmask>
          <ServiceCard service={tallService} tall />
        </Unmask>
        <div className="flex flex-col gap-5">
          {stackedServices.map((service, i) => (
            <Unmask key={service.id} delay={0.12 * (i + 1)}>
              <ServiceCard service={service} />
            </Unmask>
          ))}
        </div>
      </div>
    </section>
  );
}
