import { BOOKING_PATH } from '../booking';
import { withBase } from '../router';
import { BLOG_POSTS, getPostBySlug } from '../data/blogData';
import {
  CONTACT,
  DAY_TOURS,
  IMAGES,
  PACKAGES,
  ROUTES,
  TOUR_FAQS,
  TRANSFER_FAQS,
  VEHICLES,
  type FaqItem,
  type TravelPackage,
} from '../data/travelData';
import { calculateTransferQuote } from '../utils/travelLogic';

/**
 * One source of truth for search (SEO), AI answers (GEO) and answer boxes (AEO).
 * Used twice: by the build-time prerender (scripts/prerender.mjs) to write real HTML
 * for every page, and in the browser to keep the tags right while navigating.
 *
 * The live address is SITE_ORIGIN + the build's base path (set by BASE_PATH, see
 * vite.config.ts). With a custom domain later, set VITE_SITE_ORIGIN and BASE_PATH=/.
 */
export const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN || 'https://ravinduyas.github.io').replace(/\/+$/, '');

/** Full public URL of an app path: '/tours' → 'https://ravinduyas.github.io/travellah/tours/'. */
export const siteUrl = (path: string) => `${SITE_ORIGIN}${withBase(path)}`;
/** Full public URL of a file path that already includes the base (images). */
const assetUrl = (src: string) => `${SITE_ORIGIN}${src}`;
/** The site's home URL. */
export const SITE_URL = siteUrl('/');

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: 'website' | 'article';
  image: string;
  jsonLd: Record<string, unknown>[];
}

type JsonLd = Record<string, unknown>;

const abs = siteUrl;
const BUSINESS_ID = `${SITE_URL}#business`;
const WEBSITE_ID = `${SITE_URL}#website`;

const route = (id: string) => ROUTES.find((r) => r.id === id);
const WELIGAMA = route('weligama');
const cheapestSouth = Math.min(...ROUTES.map((r) => r.carPrice));

/* ---------------------------- shared entities ---------------------------- */

/** The business itself. No ratings or reviews are marked up: only real, verifiable ones may be. */
function business(): JsonLd {
  return {
    '@type': 'TravelAgency',
    '@id': BUSINESS_ID,
    name: CONTACT.brand,
    url: abs('/'),
    image: assetUrl(IMAGES.homeHero),
    description:
      'Private airport transfers between Bandaranaike International Airport (CMB) and Sri Lanka’s south coast, and private tours around Sri Lanka.',
    telephone: `+${CONTACT.whatsappDigits}`,
    email: CONTACT.email,
    priceRange: '$$',
    currenciesAccepted: 'USD, LKR, EUR',
    paymentAccepted: 'Cash, Credit Card',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Weligama',
      addressRegion: 'Southern Province',
      addressCountry: 'LK',
    },
    areaServed: [
      { '@type': 'Country', name: 'Sri Lanka' },
      ...ROUTES.map((r) => ({ '@type': 'City', name: r.town })),
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'reservations',
      telephone: `+${CONTACT.whatsappDigits}`,
      availableLanguage: ['English'],
    },
  };
}

function website(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: abs('/'),
    name: CONTACT.brand,
    inLanguage: 'en',
    publisher: { '@id': BUSINESS_ID },
  };
}

function breadcrumbs(items: { name: string; path: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

function faqPage(items: FaqItem[]): JsonLd {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

function trip(pkg: TravelPackage): JsonLd {
  return {
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.subtitle,
    touristType: 'International travellers',
    itinerary: {
      '@type': 'ItemList',
      itemListElement: pkg.itinerary.map((step, i) => ({ '@type': 'ListItem', position: i + 1, name: step })),
    },
    offers: {
      '@type': 'Offer',
      price: pkg.pricePerGuest,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: abs('/tours'),
    },
    provider: { '@id': BUSINESS_ID },
  };
}

/** The airport transfer service with one priced offer per town (sedan, one way). */
function transferService(): JsonLd {
  return {
    '@type': 'TaxiService',
    '@id': `${siteUrl('/transfers')}#service`,
    name: 'Colombo Airport (CMB) private transfers to the south coast',
    serviceType: 'Airport transfer',
    description:
      'Private, air-conditioned airport pick-up and drop-off between Bandaranaike International Airport (CMB) and south coast towns. Fixed prices per vehicle with tolls, flight tracking and 60 minutes of waiting included.',
    provider: { '@id': BUSINESS_ID },
    areaServed: ROUTES.map((r) => ({ '@type': 'City', name: r.town })),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: Math.min(...ROUTES.map((r) => r.carPrice)),
      highPrice: Math.max(
        ...ROUTES.map((r) => calculateTransferQuote(r.carPrice, VEHICLES[VEHICLES.length - 1].multiplier, 'one-way').total),
      ),
      offerCount: ROUTES.length * VEHICLES.length,
      offers: ROUTES.map((r) => ({
        '@type': 'Offer',
        name: `Colombo Airport to ${r.town} (sedan, one way)`,
        price: r.carPrice,
        priceCurrency: 'USD',
        description: `About ${r.distanceKm} km, ${r.duration} drive. Up to ${VEHICLES[0].seats} passengers.`,
        url: abs('/transfers'),
      })),
    },
  };
}

const graph = (...nodes: JsonLd[]): JsonLd[] => [{ '@context': 'https://schema.org', '@graph': nodes }];

/* ------------------------------ per page ------------------------------ */

function page(
  path: string,
  title: string,
  description: string,
  jsonLd: JsonLd[],
  extra: Partial<PageSeo> = {},
): PageSeo {
  return {
    path,
    title,
    description,
    canonical: abs(path),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
    ogType: 'website',
    image: assetUrl(IMAGES.homeHero),
    jsonLd,
    ...extra,
  };
}

export function getSeo(rawPath: string): PageSeo {
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;
  const brand = CONTACT.brand;

  if (path === '/') {
    return page(
      '/',
      `Colombo Airport Transfers to the South Coast | ${brand}`,
      `Private airport pick-up and drop-off between Colombo Airport (CMB) and Ahangama, Weligama, Mirissa and Tangalle. Fixed prices from $${cheapestSouth}, tolls included.`,
      graph(business(), website(), transferService()),
    );
  }

  if (path === '/transfers') {
    return page(
      path,
      `Colombo Airport Taxi: Weligama, Mirissa & Tangalle | ${brand}`,
      `Colombo Airport (CMB) to Weligama from $${WELIGAMA?.carPrice} (${WELIGAMA?.duration}). Fixed prices to ${ROUTES.length} towns, private car or van, flight tracking and tolls included.`,
      graph(
        business(),
        transferService(),
        faqPage(TRANSFER_FAQS),
        breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Airport Transfers', path }]),
      ),
      { image: assetUrl(IMAGES.transfersHero) },
    );
  }

  if (path === '/tours') {
    const all = [...PACKAGES, ...DAY_TOURS];
    return page(
      path,
      `Sri Lanka Private Tours & Day Trips | ${brand}`,
      `Private Sri Lanka tours with your own driver-guide: South Coast, Cultural Triangle, Hill Country and Yala safari. Day trips from $${Math.min(...DAY_TOURS.map((t) => t.pricePerGuest))} per person.`,
      graph(
        business(),
        {
          '@type': 'ItemList',
          name: 'Sri Lanka tour packages and day trips',
          itemListElement: all.map((pkg, i) => ({ '@type': 'ListItem', position: i + 1, item: trip(pkg) })),
        },
        faqPage(TOUR_FAQS),
        breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Tour Packages', path }]),
      ),
      { image: assetUrl(IMAGES.toursHero) },
    );
  }

  if (path === '/blog') {
    return page(
      path,
      `Sri Lanka Travel Blog: Airport & South Coast Tips | ${brand}`,
      'Practical Sri Lanka travel tips from local drivers and guides: getting from Colombo Airport, the best time to visit the south coast, and what to see and do.',
      graph(
        business(),
        {
          '@type': 'Blog',
          '@id': `${abs(path)}#blog`,
          name: `${brand} travel blog`,
          publisher: { '@id': BUSINESS_ID },
          blogPost: BLOG_POSTS.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: abs(`/blog/${p.slug}`),
            datePublished: p.date,
          })),
        },
        breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Blog', path }]),
      ),
      { image: assetUrl(IMAGES.blogHero) },
    );
  }

  if (path.startsWith('/blog/')) {
    const post = getPostBySlug(path.slice('/blog/'.length));
    if (post) {
      return page(
        path,
        `${post.title} | ${brand}`,
        post.excerpt,
        graph(
          business(),
          {
            '@type': 'BlogPosting',
            '@id': `${abs(path)}#article`,
            headline: post.title,
            description: post.excerpt,
            image: assetUrl(post.image),
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: 'en',
            articleSection: post.category,
            wordCount: post.body
              .map((b) => (b.type === 'list' ? b.items.join(' ') : b.text))
              .join(' ')
              .split(/\s+/).length,
            mainEntityOfPage: abs(path),
            author: { '@id': BUSINESS_ID },
            publisher: { '@id': BUSINESS_ID },
          },
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path },
          ]),
        ),
        { ogType: 'article', image: assetUrl(post.image) },
      );
    }
  }

  if (path === '/contact') {
    return page(
      path,
      `Contact ${brand}: WhatsApp, Phone & Email`,
      `Talk to a local team in Weligama about your airport transfer or Sri Lanka tour. WhatsApp ${CONTACT.phoneDisplay}, 24/7 for airport transfers.`,
      graph(
        business(),
        { '@type': 'ContactPage', url: abs(path), name: `Contact ${brand}`, about: { '@id': BUSINESS_ID } },
        breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Contact', path }]),
      ),
      { image: assetUrl(IMAGES.contactHero) },
    );
  }

  if (path === BOOKING_PATH) {
    // A form, not content: keep it out of search results but let links be followed.
    return page(path, `Book Your Airport Transfer | ${brand}`, 'Book your private Colombo Airport transfer in five quick steps. Fixed price, nothing to pay now.', [], {
      robots: 'noindex, follow',
    });
  }

  return page(path, `Page not found | ${brand}`, 'This page could not be found.', [], {
    robots: 'noindex, follow',
    canonical: abs('/'),
  });
}

/** Every page that should be prerendered and listed in the sitemap. */
export function indexablePaths(): { path: string; lastmod?: string; priority: number }[] {
  const newestPost = BLOG_POSTS.map((p) => p.date).sort().at(-1);
  return [
    { path: '/', priority: 1 },
    { path: '/transfers', priority: 0.9 },
    { path: '/tours', priority: 0.8 },
    { path: '/blog', priority: 0.6, lastmod: newestPost },
    { path: '/contact', priority: 0.5 },
    ...BLOG_POSTS.map((p) => ({ path: `/blog/${p.slug}`, priority: 0.6, lastmod: p.date })),
  ];
}

/* --------------------------- browser: keep tags in sync --------------------------- */

function setMeta(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key: 'name' | 'property', id: string) => () => {
  const el = document.createElement('meta');
  el.setAttribute(key, id);
  return el;
};

/** Updates title, description, canonical, social tags and structured data after in-app navigation. */
export function applySeo(path: string) {
  const seo = getSeo(path);
  document.title = seo.title;
  setMeta('meta[name="description"]', meta('name', 'description'), 'content', seo.description);
  setMeta('meta[name="robots"]', meta('name', 'robots'), 'content', seo.robots);
  setMeta('meta[property="og:title"]', meta('property', 'og:title'), 'content', seo.title);
  setMeta('meta[property="og:description"]', meta('property', 'og:description'), 'content', seo.description);
  setMeta('meta[property="og:type"]', meta('property', 'og:type'), 'content', seo.ogType);
  setMeta('meta[property="og:url"]', meta('property', 'og:url'), 'content', seo.canonical);
  setMeta('meta[property="og:image"]', meta('property', 'og:image'), 'content', seo.image);
  setMeta(
    'link[rel="canonical"]',
    () => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      return el;
    },
    'href',
    seo.canonical,
  );

  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
  for (const block of seo.jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-jsonld', '');
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  }
}
