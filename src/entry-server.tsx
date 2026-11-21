import { renderToString } from 'react-dom/server';
import App from './App';
import { BLOG_POSTS } from './data/blogData';
import { CONTACT, DAY_TOURS, PACKAGES, ROUTES, TOUR_FAQS, TRANSFER_FAQS, VEHICLES } from './data/travelData';
import { setServerLocation } from './router';
import { SITE_URL, getSeo, indexablePaths, siteUrl } from './seo/seo';
import { calculateTransferQuote } from './utils/travelLogic';

/**
 * Build-time entry used only by scripts/prerender.mjs. It renders each page to plain HTML
 * so search engines and AI crawlers (most of which do not run JavaScript) can read the
 * real content. In the browser the normal app (main.tsx) takes over.
 */
export function render(path: string): string {
  setServerLocation(path);
  return renderToString(<App />);
}

export { SITE_URL, getSeo, indexablePaths, siteUrl };

/** Plain-text site summary for AI assistants (served as /llms.txt). Built from the live data. */
export function llmsTxt(): string {
  const van = VEHICLES.find((v) => v.id === 'van') ?? VEHICLES[0];
  const lines = [
    `# ${CONTACT.brand}`,
    '',
    `> ${CONTACT.brand} is a local company based in ${CONTACT.base}. It runs private airport transfers between ${CONTACT.airport} and Sri Lanka's south coast, and private tours around Sri Lanka for international travellers.`,
    '',
    'Key facts:',
    '- Prices are fixed, in USD, per vehicle (not per person), and include expressway tolls and fuel.',
    '- Airport pick-ups include flight tracking and 60 minutes of free waiting; the driver meets guests at the arrivals exit with a name board.',
    '- Booking is by WhatsApp or the website booking form; nothing is paid in advance for one-way transfers.',
    `- Contact: WhatsApp / phone ${CONTACT.phoneDisplay}, email ${CONTACT.email}. ${CONTACT.hours}.`,
    '',
    '## Pages',
    `- [Airport transfers: prices and routes](${siteUrl('/transfers')}): fixed prices from Colombo Airport (CMB) to ${ROUTES.length} towns, vehicles, how it works, FAQ`,
    `- [Tour packages and day trips](${siteUrl('/tours')}): multi-day private tours and day trips from the south coast`,
    `- [Travel blog](${siteUrl('/blog')}): practical Sri Lanka travel guides`,
    `- [Contact](${siteUrl('/contact')})`,
    '',
    '## Airport transfer prices (one way, from Colombo Airport CMB)',
    `| Town | Distance | Drive time | Sedan (up to ${VEHICLES[0].seats}) | Van (up to ${van.seats}) |`,
    '|---|---|---|---|---|',
    ...ROUTES.map(
      (r) =>
        `| ${r.town} | ~${r.distanceKm} km | ${r.duration} | $${r.carPrice} | $${calculateTransferQuote(r.carPrice, van.multiplier, 'one-way').total} |`,
    ),
    '',
    '## Tours',
    ...[...PACKAGES, ...DAY_TOURS].map(
      (t) => `- ${t.title} (${t.duration}, from $${t.pricePerGuest} per person): ${t.subtitle}`,
    ),
    '',
    '## Frequently asked questions',
    ...[...TRANSFER_FAQS, ...TOUR_FAQS].flatMap((f) => [`### ${f.question}`, f.answer, '']),
    '## Blog articles',
    ...BLOG_POSTS.map((p) => `- [${p.title}](${siteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`),
    '',
  ];
  return lines.join('\n');
}
