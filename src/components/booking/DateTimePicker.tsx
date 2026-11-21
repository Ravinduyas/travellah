import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { EASE_OUT, FieldError, labelClass } from './BookingParts';

/* ------------------------------------------------------------------ */
/* date helpers (local time, ISO yyyy-mm-dd strings)                    */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'));
const MINUTES = ['00', '10', '20', '30', '40', '50'];
const MONTHS_AHEAD = 12;

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fromIso(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function todayIso() {
  return toIso(new Date());
}
function formatLong(iso: string) {
  return fromIso(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

/* ------------------------------------------------------------------ */
/* one month grid                                                       */
/* ------------------------------------------------------------------ */

function MonthGrid({
  month,
  value,
  minIso,
  maxIso,
  onPick,
}: {
  month: Date;
  value: string;
  minIso: string;
  maxIso: string;
  onPick: (iso: string) => void;
}) {
  const first = startOfMonth(month);
  const offset = (first.getDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toIso(new Date(first.getFullYear(), first.getMonth(), i + 1))),
  ];
  const today = todayIso();

  return (
    <div className="min-w-0">
      <p className="text-center text-[13px] font-medium text-[#171717] mb-3">
        {first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
      </p>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[10.5px] font-medium uppercase tracking-[0.04em] text-neutral-400 pb-1">
            {w}
          </span>
        ))}
        {cells.map((iso, i) => {
          if (!iso) return <span key={`blank-${i}`} />;
          const disabled = iso < minIso || iso > maxIso;
          const selected = iso === value;
          const isToday = iso === today;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onPick(iso)}
              aria-pressed={selected}
              aria-label={fromIso(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              className={`relative mx-auto w-9 h-9 rounded-full text-[12.5px] tabular-nums transition-colors ${
                selected
                  ? 'bg-[#171717] text-white font-medium'
                  : disabled
                    ? 'text-neutral-300 cursor-not-allowed'
                    : 'text-[#171717] hover:bg-[#4694A4]/12 cursor-pointer'
              }`}
            >
              {Number(iso.slice(8))}
              {isToday && !selected && (
                <span aria-hidden="true" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4694A4]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* the date + time fields with a shared, full-width picker panel         */
/* ------------------------------------------------------------------ */

type Panel = 'date' | 'time' | null;

interface DateTimeFieldsProps {
  date: string;
  time: string;
  onDateChange: (iso: string) => void;
  onTimeChange: (hhmm: string) => void;
  dateLabel: string;
  timeLabel: string;
  dateError?: string;
  timeError?: string;
}

const fieldButton =
  'w-full flex items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left text-[13px] transition-[border-color,box-shadow] duration-200 focus:outline-none focus-visible:border-[#4694A4] focus-visible:shadow-[0_0_0_4px_rgba(70,148,164,0.12)] cursor-pointer';

export function DateTimeFields({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateLabel,
  timeLabel,
  dateError,
  timeError,
}: DateTimeFieldsProps) {
  const id = useId();
  // Open straight away on whatever is still missing: the calendar first, then the time.
  const [panel, setPanel] = useState<Panel>(() => (!date ? 'date' : !time ? 'time' : null));
  const minIso = todayIso();
  const maxIso = toIso(addMonths(new Date(), MONTHS_AHEAD));
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(date ? fromIso(date) : new Date()));
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [hour, minute] = time ? time.split(':') : ['', ''];
  const firstMonth = startOfMonth(new Date());
  const canGoBack = viewMonth > firstMonth;
  const canGoForward = addMonths(viewMonth, 1) < addMonths(firstMonth, MONTHS_AHEAD);

  // Close with Escape or a click outside the fields and panel.
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanel(null);
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && wrapRef.current.contains(e.target as Node)) return;
      // a click elsewhere closes a panel only once its value is chosen, so it never vanishes unfinished
      const done = panel === 'date' ? Boolean(date) : Boolean(time);
      if (done) setPanel(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [panel, date, time]);

  const toggle = (which: Exclude<Panel, null>) => {
    if (which === 'date' && date) setViewMonth(startOfMonth(fromIso(date)));
    setPanel((p) => (p === which ? null : which));
  };

  const pickDate = (iso: string) => {
    onDateChange(iso);
    // keep the flow moving: choose the time next
    setPanel(time ? null : 'time');
  };

  const pickHour = (h: string) => onTimeChange(`${h}:${minute || '00'}`);
  const pickMinute = (m: string) => {
    onTimeChange(`${hour || '12'}:${m}`);
    setPanel(null);
  };

  return (
    <div ref={wrapRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span id={`${id}-date-label`} className={labelClass}>
            {dateLabel}
          </span>
          <button
            id="tr-date"
            type="button"
            onClick={() => toggle('date')}
            aria-haspopup="dialog"
            aria-expanded={panel === 'date'}
            aria-controls={`${id}-panel`}
            aria-labelledby={`${id}-date-label tr-date`}
            className={`${fieldButton} ${panel === 'date' ? 'border-[#4694A4] shadow-[0_0_0_4px_rgba(70,148,164,0.12)]' : 'border-neutral-200'}`}
          >
            <span className={date ? 'text-[#171717]' : 'text-neutral-400'}>{date ? formatLong(date) : 'Choose a date'}</span>
            <CalendarDays className="w-4 h-4 text-neutral-500 shrink-0" aria-hidden="true" />
          </button>
          <FieldError message={dateError} />
        </div>
        <div>
          <span id={`${id}-time-label`} className={labelClass}>
            {timeLabel}
          </span>
          <button
            id="tr-time"
            type="button"
            onClick={() => toggle('time')}
            aria-haspopup="dialog"
            aria-expanded={panel === 'time'}
            aria-controls={`${id}-panel`}
            aria-labelledby={`${id}-time-label tr-time`}
            className={`${fieldButton} ${panel === 'time' ? 'border-[#4694A4] shadow-[0_0_0_4px_rgba(70,148,164,0.12)]' : 'border-neutral-200'}`}
          >
            <span className={`tabular-nums ${time ? 'text-[#171717]' : 'text-neutral-400'}`}>{time || 'Choose a time'}</span>
            <Clock className="w-4 h-4 text-neutral-500 shrink-0" aria-hidden="true" />
          </button>
          <FieldError message={timeError} />
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {panel && (
          <motion.div
            key={panel}
            ref={panelRef}
            id={`${id}-panel`}
            role="dialog"
            aria-label={panel === 'date' ? 'Choose a date' : 'Choose a time'}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            // once open, make sure the whole picker is on screen (clear of the phone bottom bar)
            onAnimationComplete={(definition) => {
              const opened = typeof definition === 'object' && definition !== null && 'height' in definition && definition.height === 'auto';
              if (opened) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }}
            className="overflow-hidden scroll-mb-28 lg:scroll-mb-6 scroll-mt-24"
          >
            <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
              {panel === 'date' ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setViewMonth((m) => addMonths(m, -1))}
                    disabled={!canGoBack}
                    aria-label="Previous month"
                    className="absolute left-0 top-0 w-8 h-8 rounded-full inline-flex items-center justify-center text-[#171717] hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMonth((m) => addMonths(m, 1))}
                    disabled={!canGoForward}
                    aria-label="Next month"
                    className="absolute right-0 top-0 w-8 h-8 rounded-full inline-flex items-center justify-center text-[#171717] hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  {/* two months side by side; one on phones */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-1.5">
                    <MonthGrid month={viewMonth} value={date} minIso={minIso} maxIso={maxIso} onPick={pickDate} />
                    <div className="hidden sm:block">
                      <MonthGrid month={addMonths(viewMonth, 1)} value={date} minIso={minIso} maxIso={maxIso} onPick={pickDate} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-5 sm:gap-8">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-neutral-500 mb-2.5">Hour</p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {HOURS.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => pickHour(h)}
                          aria-pressed={h === hour}
                          className={`h-9 rounded-lg text-[12.5px] tabular-nums transition-colors cursor-pointer ${
                            h === hour ? 'bg-[#171717] text-white font-medium' : 'text-[#171717] bg-neutral-50 hover:bg-[#4694A4]/12'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-neutral-500 mb-2.5">Minutes</p>
                    <div className="grid grid-cols-6 sm:grid-cols-2 gap-1.5 sm:w-[132px]">
                      {MINUTES.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => pickMinute(m)}
                          aria-pressed={m === minute}
                          className={`h-9 rounded-lg text-[12.5px] tabular-nums transition-colors cursor-pointer ${
                            m === minute ? 'bg-[#171717] text-white font-medium' : 'text-[#171717] bg-neutral-50 hover:bg-[#4694A4]/12'
                          }`}
                        >
                          :{m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
