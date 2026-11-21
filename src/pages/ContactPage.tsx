import { useState, type FormEvent } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { FaqSection } from '../components/FaqSection';
import { PageHero } from '../components/PageHero';
import { CONTACT, IMAGES, TRANSFER_FAQS } from '../data/travelData';
import { buildWhatsAppLink, validateEmail } from '../utils/travelLogic';
import { Eyebrow, Reveal, SplitWords } from '../components/motion/effects';
import { BookingLink } from '../booking';

const TOPICS = ['Airport pick-up', 'Airport drop-off', 'Tour package', 'Day tour', 'Something else'];

const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] text-[#171717] focus:outline-none focus:border-[#4694A4]';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [sentLink, setSentLink] = useState<string | null>(null);

  const composed = () =>
    [`Topic: ${topic}`, `Name: ${name.trim()}`, `Email: ${email.trim()}`, '', message.trim()].join('\n');

  const validate = () => {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Please enter your name.';
    if (!validateEmail(email)) next.email = 'Please enter a valid email address.';
    if (message.trim().length < 5) next.message = 'Please write a short message.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    const link = buildWhatsAppLink(CONTACT.whatsappDigits, composed());
    setSentLink(link);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    if (!validate()) return;
    const subject = encodeURIComponent(`${topic} enquiry from ${name.trim()}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(composed())}`;
  };

  const channels = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: CONTACT.phoneDisplay,
      href: buildWhatsAppLink(CONTACT.whatsappDigits, 'Hi! I have a question.'),
      note: 'Fastest reply, 24/7 for airport transfers',
    },
    { icon: Phone, label: 'Phone', value: CONTACT.phoneDisplay, href: `tel:+${CONTACT.whatsappDigits}`, note: 'Call or text' },
    { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, note: 'We reply within a day' },
    { icon: MapPin, label: 'Based in', value: CONTACT.base, note: 'Serving the whole south coast' },
  ];

  return (
    <main>
      <PageHero
        eyebrow="CONTACT"
        title="Talk to a *local*. We reply fast."
        intro="Questions about your airport transfer or a tour? Message us on WhatsApp, call, or send the form below."
        image={IMAGES.contactHero}
        imageAlt="Green mountains rising above the clouds at sunrise"
      />

      <section className="max-w-[1180px] mx-auto px-6 md:px-10 py-14 lg:py-20">
        <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {channels.map(({ icon: Icon, label, value, href, note }) => {
            const body = (
              <>
                <span className="w-10 h-10 rounded-full bg-[#4694A4]/10 text-[#3E8E9E] inline-flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-[12px] text-neutral-500">{label}</p>
                <p className="mt-0.5 text-[15px] font-medium text-[#171717] break-words">{value}</p>
                <p className="mt-1 text-[12px] text-[#737373]">{note}</p>
              </>
            );
            return href ? (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="spotlight rounded-[22px] border border-neutral-200 hover:border-[#171717] p-6 transition-colors"
              >
                {body}
              </a>
            ) : (
              <div key={label} className="rounded-[22px] border border-neutral-200 p-6">
                {body}
              </div>
            );
          })}
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-3">SEND A MESSAGE</Eyebrow>
            <h2 className="text-[32px] sm:text-[40px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.15] mb-4 text-balance">
            <SplitWords text="Tell us about your *trip*" />
          </h2>
            <p className="text-[13px] sm:text-[14px] text-[#737373] leading-relaxed max-w-[400px]">
              Share your dates, flight and where you are staying, and we will
              send a fixed quote. Booking a transfer? The{' '}
              <BookingLink className="text-[#3E8E9E] underline underline-offset-2">
                booking form
              </BookingLink>{' '}
              shows your price straight away.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-[12.5px] text-[#404040]">
              <Clock className="w-4 h-4 text-[#4694A4]" aria-hidden="true" />
              {CONTACT.hours}
            </p>

            <div className="mt-6 overflow-hidden rounded-[22px] border border-neutral-200 h-[220px] bg-neutral-100">
              <iframe
                title={`Map of ${CONTACT.base}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT.base)}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form onSubmit={handleWhatsApp} noValidate className="lg:col-span-7 rounded-[22px] border border-neutral-200 p-5 sm:p-7 space-y-4">
            {sentLink && (
              <p role="status" className="rounded-xl bg-[#4694A4]/8 border border-[#4694A4]/25 px-4 py-3 text-[12.5px] text-[#2C5F6A]">
                WhatsApp opened with your message. Didn’t open?{' '}
                <a href={sentLink} target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
                  Open it here
                </a>
                .
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ct-name" className="block text-[12px] font-medium text-[#171717] mb-1.5">Name</label>
                <input id="ct-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                {errors.name && <p role="alert" className="mt-1 text-[11.5px] text-red-600">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="ct-email" className="block text-[12px] font-medium text-[#171717] mb-1.5">Email</label>
                <input id="ct-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                {errors.email && <p role="alert" className="mt-1 text-[11.5px] text-red-600">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="ct-topic" className="block text-[12px] font-medium text-[#171717] mb-1.5">What is it about?</label>
              <select id="ct-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={inputClass}>
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ct-message" className="block text-[12px] font-medium text-[#171717] mb-1.5">Message</label>
              <textarea
                id="ct-message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dates, flight number, hotel, number of people…"
                className={`${inputClass} resize-y`}
              />
              {errors.message && <p role="alert" className="mt-1 text-[11.5px] text-red-600">{errors.message}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#171717] hover:bg-neutral-800 text-white py-3 text-[13px] font-medium transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                Send on WhatsApp
              </button>
              <button
                type="button"
                onClick={handleEmail}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 hover:bg-neutral-50 py-3 text-[13px] font-medium text-[#171717] transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                Send by email
              </button>
            </div>
          </form>
        </div>
      </section>

      <FaqSection items={TRANSFER_FAQS} />
    </main>
  );
}
