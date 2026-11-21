import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CONTACT, FOOTER_COLUMNS } from '../data/travelData';
import { Link } from '../router';
import { buildWhatsAppLink } from '../utils/travelLogic';

export function FooterSection() {
  const whatsapp = buildWhatsAppLink(CONTACT.whatsappDigits, 'Hi! I have a question.');

  return (
    <footer className="relative overflow-hidden bg-[#161616] text-white mt-2">
      <div className="max-w-[1180px] mx-auto px-6 md:px-10 pt-14 pb-10">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-[300px]">
            <Link
              to="/"
              className="inline-block text-[20px] font-medium tracking-[-0.02em] text-white mb-4"
            >
              {CONTACT.brand}
            </Link>
            <p className="text-[12px] text-neutral-400 leading-[1.65] mb-5">
              Private airport pick-up and drop-off between Colombo airport and
              Sri Lanka’s south coast, plus private tours around the island.
            </p>

            <ul className="space-y-2.5 text-[12px] text-neutral-300">
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  WhatsApp {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:+${CONTACT.whatsappDigits}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {CONTACT.base}
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-14 lg:gap-20">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="text-[12px] font-medium text-white mb-4">{col.heading}</h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-[12px] text-neutral-400 hover:text-white transition-colors whitespace-nowrap"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/15 mt-14 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-neutral-400">
          <p>
            © {new Date().getFullYear()} {CONTACT.brand}. All rights reserved
          </p>
          <p>{CONTACT.hours}</p>
        </div>
      </div>

      {/* oversized faded wordmark along the bottom edge */}
      <p aria-hidden="true" className="footer-wordmark select-none text-center font-medium -mb-[0.12em] px-4">
        {CONTACT.brand}
      </p>
    </footer>
  );
}
