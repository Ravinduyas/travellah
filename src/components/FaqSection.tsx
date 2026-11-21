import { useState } from 'react';
import { motion } from 'motion/react';
import type { FaqItem } from '../data/travelData';
import { Eyebrow, SplitWords } from './motion/effects';

interface FaqSectionProps {
  items: FaqItem[];
  intro?: string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** The answer: words fade in quickly in sequence while a light sweep passes over them. */
function AnswerText({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <motion.p
      className="relative"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.012, delayChildren: 0.12 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 6, filter: 'blur(4px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: EASE_OUT } },
          }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
      {/* loading-style shimmer that sweeps once across the answer */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#4694A4]/15 to-transparent"
        initial={{ x: '0%' }}
        animate={{ x: '420%' }}
        transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.05 }}
      />
    </motion.p>
  );
}

export function FaqSection({
  items,
  intro = 'Clear answers to the questions travellers ask us most before they land in Sri Lanka.',
}: FaqSectionProps) {
  const [openId, setOpenId] = useState<string>(items[0]?.id ?? '');

  return (
    <section id="faqs" className="max-w-[1180px] mx-auto px-6 md:px-10 py-16 lg:py-22">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-start">
        <div className="md:col-span-5 md:sticky md:top-24">
          <Eyebrow className="mb-3">FAQs</Eyebrow>
          <h2 className="text-[36px] sm:text-[42px] lg:text-[46px] font-normal tracking-[-0.02em] text-[#171717] leading-[1.12] mb-5 text-balance">
            <SplitWords text="Frequently Asked *Questions*" />
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#737373] leading-relaxed max-w-[360px]">
            {intro}
          </p>
        </div>

        <div className="md:col-span-7 flex flex-col gap-3">
          {items.map((item, index) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;

            return (
              // each question slides in from the right, one after another
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 40, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: index * 0.08 }}
                className={`relative overflow-hidden rounded-[14px] border transition-colors duration-300 ${
                  isOpen
                    ? 'border-neutral-200 bg-neutral-50/70'
                    : 'border-neutral-200/85 bg-white hover:border-neutral-300'
                }`}
              >
                {/* teal line drawn down the left edge of the open question */}
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#4694A4] origin-top"
                  initial={false}
                  animate={{ scaleY: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                />

                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpenId((prev) => (prev === item.id ? '' : item.id))}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group w-full text-left px-6 py-4 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4694A4] focus-visible:outline-offset-[-2px] rounded-[14px]"
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className={`text-[11px] font-medium tabular-nums transition-colors duration-300 ${
                        isOpen ? 'text-[#4694A4]' : 'text-neutral-400'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[14px] sm:text-[15px] font-medium text-[#171717] leading-snug transition-transform duration-300 group-hover:translate-x-1">
                      {item.question}
                    </span>
                  </span>

                  {/* plus that turns into a cross inside a circle that fills when open */}
                  <motion.span
                    aria-hidden="true"
                    className="relative w-7 h-7 shrink-0 rounded-full border inline-flex items-center justify-center"
                    initial={false}
                    animate={{
                      rotate: isOpen ? 135 : 0,
                      backgroundColor: isOpen ? '#171717' : 'rgba(255,255,255,0)',
                      borderColor: isOpen ? '#171717' : '#D4D4D4',
                      color: isOpen ? '#FFFFFF' : '#737373',
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    <span className="absolute w-3 h-[1.5px] rounded-full bg-current" />
                    <span className="absolute w-[1.5px] h-3 rounded-full bg-current" />
                  </motion.span>
                </button>

                {/* Every answer is always in the HTML (closed ones are just collapsed),
                    so search engines and AI assistants can read all of them. */}
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ height: { duration: 0.45, ease: EASE_OUT }, opacity: { duration: 0.25 } }}
                  className="overflow-hidden"
                >
                  <div className="pl-[54px] pr-6 pb-5 -mt-1 text-[13px] text-[#737373] leading-[1.65]">
                    {/* the word-by-word reveal replays each time the answer opens */}
                    {isOpen ? <AnswerText text={item.answer} /> : <p>{item.answer}</p>}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
