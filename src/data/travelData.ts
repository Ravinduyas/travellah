/**
 * All site content lives here. Edit prices, routes, tours and contact details in this file.
 *
 * BEFORE LAUNCH, replace:
 *  - CONTACT (phone, WhatsApp, email) — currently placeholders
 *  - IMAGES — currently placeholder photos from the original template (not Sri Lanka)
 *  - prices in ROUTES / VEHICLES / PACKAGES / DAY_TOURS — starting estimates in USD
 *  - REVIEWS — sample text; swap in real guest reviews
 */

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  href: string;
}

export interface TransferRoute {
  id: string;
  town: string;
  area: string;
  distanceKm: number;
  duration: string;
  carPrice: number;
  popular?: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  example: string;
  seats: number;
  multiplier: number;
  features: string[];
}

export interface TravelPackage {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  destinations: string[];
  pricePerGuest: number;
  image: string;
  imageAlt: string;
  highlights: string[];
  itinerary: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  quote: string;
  faded?: boolean;
}

export const CONTACT = {
  brand: 'travellah',
  phoneDisplay: '+94 77 000 0000',
  whatsappDigits: '94770000000',
  email: 'hello@travellah.lk',
  base: 'Weligama, Southern Province, Sri Lanka',
  hours: 'Airport transfers 24/7 · Office 8am – 8pm (GMT+5:30)',
  airport: 'Bandaranaike International Airport (CMB), Katunayake',
};

const IMG = `${import.meta.env.BASE_URL}src/assets/images`;
export const IMAGES = {
  homeHero: `${IMG}/package_adventure_coast_1795093865954.jpg`,
  transfersHero: `${IMG}/service_kelingking_cliff_1795093789654.jpg`,
  toursHero: `${IMG}/hero_bali_temple_1795093790068.jpg`,
  blogHero: `${IMG}/package_all_inclusive_1795093790575.jpg`,
  contactHero: `${IMG}/service_mount_bromo_1795093791466.jpg`,
  cta: `${IMG}/cta_bali_gate_1795093791531.jpg`,
  coast: `${IMG}/package_adventure_coast_1795093865954.jpg`,
  cliff: `${IMG}/service_kelingking_cliff_1795093789654.jpg`,
  temple: `${IMG}/hero_bali_temple_1795093790068.jpg`,
  stairs: `${IMG}/package_all_inclusive_1795093790575.jpg`,
  dancers: `${IMG}/package_cultural_dancers_1795093901534.jpg`,
  mountain: `${IMG}/service_mount_bromo_1795093791466.jpg`,
  gate: `${IMG}/cta_bali_gate_1795093791531.jpg`,
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Airport Transfers', href: '/transfers' },
  { label: 'Tour Packages', href: '/tours' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const ABOUT_STATS = [
  { value: '24/7', label: 'Airport pick-ups' },
  { value: '7', label: 'South coast routes' },
  { value: '~2.5h', label: 'Airport to Weligama' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'airport-pickup',
    title: 'Airport Pick-up',
    subtitle:
      'Your driver waits at Colombo airport arrivals with your name board and takes you straight to your south coast stay',
    image: IMAGES.cliff,
    imageAlt: 'Coastal road above a turquoise bay',
    href: '/transfers?direction=pickup',
  },
  {
    id: 'airport-drop',
    title: 'Airport Drop-off',
    subtitle: 'On-time pick-up from your hotel, villa or surf camp to catch your flight home',
    image: IMAGES.coast,
    imageAlt: 'Ocean cliffs and surf along a tropical coastline',
    href: '/transfers?direction=drop',
  },
  {
    id: 'tours',
    title: 'Tour Packages & Day Trips',
    subtitle: 'Private tours from the south coast: Galle Fort, whale watching, safaris and the hill country',
    image: IMAGES.temple,
    imageAlt: 'Temple beside a calm misty lake',
    href: '/tours',
  },
];

export const WHY_US = [
  'Flight tracking',
  'Fixed prices, tolls included',
  'English-speaking drivers',
  'Name board at arrivals',
  'Child seats on request',
  '24/7 WhatsApp support',
];

export const TRANSFER_STEPS = [
  {
    title: 'Send your details',
    text: 'Pick your town, date, flight number and group size. You see the price before you book.',
  },
  {
    title: 'We confirm on WhatsApp',
    text: 'You get your driver’s name, photo, car number and phone number before you fly.',
  },
  {
    title: 'Meet your driver',
    text: 'Your driver waits at the arrivals exit with a name board, even if your flight is late.',
  },
  {
    title: 'Relax on the expressway',
    text: 'Air-conditioned car, water on board, and stops for a SIM card, cash or food when you need them.',
  },
];

/** Approximate distances and drive times from CMB airport via the expressways. Prices are one way, sedan car, USD. */
export const ROUTES: TransferRoute[] = [
  { id: 'ahangama', town: 'Ahangama & Midigama', area: 'South', distanceKm: 175, duration: '2h 30m', carPrice: 78, popular: true },
  { id: 'weligama', town: 'Weligama', area: 'South', distanceKm: 180, duration: '2h 30m', carPrice: 80, popular: true },
  { id: 'mirissa', town: 'Mirissa', area: 'South', distanceKm: 188, duration: '2h 40m', carPrice: 85, popular: true },
  { id: 'matara', town: 'Matara', area: 'South', distanceKm: 195, duration: '2h 45m', carPrice: 88 },
  { id: 'hiriketiya', town: 'Dikwella & Hiriketiya', area: 'South', distanceKm: 215, duration: '3h', carPrice: 95 },
  { id: 'tangalle', town: 'Tangalle', area: 'South-east', distanceKm: 225, duration: '3h 15m', carPrice: 100 },
  { id: 'yala', town: 'Tissamaharama (Yala)', area: 'South-east', distanceKm: 270, duration: '4h', carPrice: 120 },
];

export const VEHICLES: Vehicle[] = [
  {
    id: 'car',
    name: 'Sedan car',
    example: 'Toyota Axio / Prius or similar',
    seats: 3,
    multiplier: 1,
    features: ['Air conditioning', 'Bottled water', 'Ideal for couples'],
  },
  {
    id: 'van',
    name: 'Family van',
    example: 'Toyota KDH or similar',
    seats: 8,
    multiplier: 1.4,
    features: ['Air conditioning', 'Room for surfboards', 'Families & groups'],
  },
  {
    id: 'coach',
    name: 'Mini coach',
    example: 'Toyota Coaster or similar',
    seats: 14,
    multiplier: 2.2,
    features: ['Air conditioning', 'Large luggage space', 'Retreats & big groups'],
  },
];

export const PACKAGES: TravelPackage[] = [
  {
    id: 'south-coast',
    title: 'South Coast Escape',
    subtitle: 'Galle Fort, whale watching, turtle beaches and quiet bays, at an easy pace.',
    duration: '3 day, 2 night',
    destinations: ['Galle', 'Mirissa', 'Hiriketiya'],
    pricePerGuest: 290,
    image: IMAGES.coast,
    imageAlt: 'Ocean cliffs along a tropical coastline',
    highlights: [
      'Private air-conditioned car and English-speaking driver-guide',
      'Morning whale-watching boat from Mirissa (November to April)',
      'Galle Fort walking tour and Koggala stilt fishermen',
    ],
    itinerary: [
      'Day 1: Galle Fort walk, lighthouse and ramparts at sunset',
      'Day 2: Early whale watching from Mirissa, afternoon at Coconut Tree Hill',
      'Day 3: Turtle hatchery, Hiriketiya bay swim and drop-off at your hotel',
    ],
  },
  {
    id: 'cultural',
    title: 'Cultural Triangle',
    subtitle: 'Ancient kingdoms, cave temples and Kandy, with hotel-to-hotel transport.',
    duration: '5 day, 4 night',
    destinations: ['Sigiriya', 'Dambulla', 'Polonnaruwa', 'Kandy'],
    pricePerGuest: 640,
    image: IMAGES.dancers,
    imageAlt: 'Traditional dancers in ornate costumes',
    highlights: [
      'Sigiriya Rock Fortress climb at sunrise',
      'Dambulla cave temple and the ancient city of Polonnaruwa',
      'Temple of the Tooth and a Kandyan dance show',
    ],
    itinerary: [
      'Day 1: Pick-up from the south coast or airport, drive to Sigiriya',
      'Day 2: Sunrise Sigiriya climb, village lunch, Dambulla cave temple',
      'Day 3: Polonnaruwa by bicycle and an evening jeep safari',
      'Day 4: Spice garden on the way to Kandy, Temple of the Tooth',
      'Day 5: Peradeniya botanical gardens and return to the coast',
    ],
  },
  {
    id: 'hills-safari',
    title: 'Hill Country & Safari',
    subtitle: 'The famous train ride, tea country, Ella’s viewpoints and a Yala leopard safari.',
    duration: '6 day, 5 night',
    destinations: ['Kandy', 'Nuwara Eliya', 'Ella', 'Yala'],
    pricePerGuest: 720,
    image: IMAGES.mountain,
    imageAlt: 'Green mountains rising above the clouds at sunrise',
    highlights: [
      'Scenic Kandy to Ella train ride (reserved seats when available)',
      'Tea factory visit and tasting in Nuwara Eliya',
      'Half-day jeep safari in Yala National Park',
    ],
    itinerary: [
      'Day 1: Drive to Kandy, Temple of the Tooth in the evening',
      'Day 2: Tea estates and Nuwara Eliya town',
      'Day 3: Train through the hills to Ella',
      'Day 4: Nine Arch Bridge, Little Adam’s Peak and Ravana Falls',
      'Day 5: Drive to Tissamaharama, afternoon Yala safari',
      'Day 6: Return to the south coast or the airport',
    ],
  },
];

export const DAY_TOURS: TravelPackage[] = [
  {
    id: 'galle-day',
    title: 'Galle Fort & Unawatuna',
    subtitle: 'Walk the Dutch fort, then swim and lunch on Unawatuna beach.',
    duration: 'Full day',
    destinations: ['Galle', 'Unawatuna'],
    pricePerGuest: 45,
    image: IMAGES.stairs,
    imageAlt: 'Old stone stairs in a tropical garden',
    highlights: ['Hotel pick-up and drop-off', 'Galle Fort guided walk', 'Free time at Jungle Beach'],
    itinerary: ['Morning: Galle Fort walk', 'Midday: Lunch in Unawatuna', 'Afternoon: Jungle Beach and Japanese Peace Pagoda'],
  },
  {
    id: 'whale-day',
    title: 'Mirissa Whale Watching',
    subtitle: 'Early boat out to spot blue whales and dolphins (November to April).',
    duration: 'Half day',
    destinations: ['Mirissa'],
    pricePerGuest: 60,
    image: IMAGES.cliff,
    imageAlt: 'Turquoise sea below a green headland',
    highlights: ['Hotel pick-up before sunrise', 'Boat ticket and breakfast on board', 'Back by early afternoon'],
    itinerary: ['6:00am: Pick-up and boat check-in', '7:00am – 12:00pm: Whale and dolphin watching', 'Afternoon: Drop-off at your hotel'],
  },
  {
    id: 'yala-day',
    title: 'Yala Safari Day Trip',
    subtitle: 'Leopards, elephants and birds in Sri Lanka’s best-known national park.',
    duration: 'Full day',
    destinations: ['Yala'],
    pricePerGuest: 120,
    image: IMAGES.mountain,
    imageAlt: 'Wild landscape at dawn',
    highlights: ['Private car from the south coast', 'Jeep with tracker', 'Park entry help on arrival'],
    itinerary: ['3:30am: Pick-up from your hotel', 'Morning: Jeep safari in Yala', 'Afternoon: Lunch and return drive'],
  },
  {
    id: 'turtle-day',
    title: 'Turtles & Madu River',
    subtitle: 'A turtle conservation project and a boat ride through mangrove islands.',
    duration: 'Half day',
    destinations: ['Kosgoda', 'Balapitiya'],
    pricePerGuest: 40,
    image: IMAGES.gate,
    imageAlt: 'Couple walking toward green hills',
    highlights: ['Turtle hatchery visit', 'Madu River mangrove boat ride', 'Cinnamon island stop'],
    itinerary: ['Morning: Turtle hatchery', 'Midday: Madu River boat safari', 'Afternoon: Return to your hotel'],
  },
];

export const TRANSFER_FAQS: FaqItem[] = [
  {
    id: 'faq-delay',
    question: 'What if my flight is delayed?',
    answer:
      'We track your flight number, so your driver arrives when you actually land. Delays never cost you extra, and the first 60 minutes after landing are free waiting time for immigration and baggage.',
  },
  {
    id: 'faq-meet',
    question: 'Where will my driver meet me at the airport?',
    answer:
      'At the arrivals exit of Bandaranaike International Airport (CMB), holding a board with your name. We send the driver’s photo and phone number on WhatsApp before you fly.',
  },
  {
    id: 'faq-time',
    question: 'How long is the drive from the airport to Weligama or Mirissa?',
    answer:
      'About 2.5 to 3 hours using the Katunayake, Outer Circular and Southern expressways. Expressway tolls are already included in our prices.',
  },
  {
    id: 'faq-pay',
    question: 'How do I pay?',
    answer:
      'Pay your driver in cash (Sri Lankan rupees, US dollars or euros), or ask us for a card payment link before your trip. No deposit is needed for one-way transfers.',
  },
  {
    id: 'faq-child',
    question: 'Do you have child seats and space for surfboards?',
    answer:
      'Yes. Child seats are free on request, and our vans carry surfboards and bikes. Just tell us when you book.',
  },
  {
    id: 'faq-stop',
    question: 'Can we stop on the way?',
    answer:
      'Of course. A short stop for a local SIM card, an ATM, food or the restroom is included. Longer sightseeing stops can be added for a small fee.',
  },
];

export const TOUR_FAQS: FaqItem[] = [
  {
    id: 'tour-private',
    question: 'Are the tours private?',
    answer:
      'Yes. Every tour is private for your group, with your own car and English-speaking driver-guide. You choose the start time and the pace.',
  },
  {
    id: 'tour-included',
    question: 'What is included in the price?',
    answer:
      'Transport, driver-guide, fuel, tolls and parking. Multi-day packages include hotels with breakfast. Entrance tickets and safari jeeps are listed in each tour and we can book them for you.',
  },
  {
    id: 'tour-custom',
    question: 'Can you change a package for us?',
    answer:
      'Every package can be changed. Add days, swap hotels, or combine a tour with your airport pick-up or drop-off.',
  },
  {
    id: 'tour-season',
    question: 'When is the best time to visit the south coast?',
    answer:
      'December to April brings the calmest seas and sunniest days on the south coast. Whale watching from Mirissa runs from about November to April.',
  },
];

// SAMPLE REVIEWS — replace with real guest reviews before launch.
export const REVIEWS_ROW_1: ReviewItem[] = [
  {
    id: 'rev-rex',
    name: 'Rex',
    avatar: `${IMG}/avatar_alex_1795093920121.jpg`,
    quote: 'Our flight landed at 2am and the driver was waiting with a sign. We were in Weligama before sunrise.',
    faded: true,
  },
  {
    id: 'rev-alex',
    name: 'Alex Buckmaster',
    avatar: `${IMG}/avatar_alex_1795093920121.jpg`,
    quote: 'Clear price up front, a clean car and a friendly driver who stopped so we could get a SIM card and cash.',
  },
  {
    id: 'rev-dennis',
    name: 'Dennis Callis',
    avatar: `${IMG}/avatar_dennis_1795093787899.jpg`,
    quote: 'They fitted three surfboards in the van with no fuss. Booking on WhatsApp took two minutes.',
  },
  {
    id: 'rev-maya',
    name: 'Maya Lin',
    avatar: `${IMG}/avatar_corina_1795093904263.jpg`,
    quote: 'The whale-watching day from Mirissa was the highlight of our holiday. Great guide.',
    faded: true,
  },
];

export const REVIEWS_ROW_2: ReviewItem[] = [
  {
    id: 'rev-rafi',
    name: 'Rafi',
    avatar: `${IMG}/avatar_dennis_1795093787899.jpg`,
    quote: 'Our driver for the hill country tour knew every viewpoint and every good place to eat.',
    faded: true,
  },
  {
    id: 'rev-judith',
    name: 'Judith Rodriguez',
    avatar: `${IMG}/avatar_judith_1795093788559.jpg`,
    quote: 'They picked us up at our villa in Mirissa right on time for our evening flight. Very relaxed ride.',
  },
  {
    id: 'rev-corina',
    name: 'Corina McCoy',
    avatar: `${IMG}/avatar_corina_1795093904263.jpg`,
    quote: 'We booked the airport pick-up and the Cultural Triangle tour together. Everything ran smoothly.',
  },
  {
    id: 'rev-daniel',
    name: 'Daniel Park',
    avatar: `${IMG}/avatar_alex_1795093920121.jpg`,
    quote: 'Child seats were ready for our kids and the driver drove carefully all the way to Tangalle.',
    faded: true,
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: 'Transfers',
    links: [
      { label: 'Airport pick-up', href: '/transfers?direction=pickup' },
      { label: 'Airport drop-off', href: '/transfers?direction=drop' },
      { label: 'Prices & routes', href: '/transfers' },
    ],
  },
  {
    heading: 'Tours',
    links: [
      { label: 'Tour packages', href: '/tours' },
      { label: 'Day tours', href: '/tours' },
      { label: 'Travel blog', href: '/blog' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', href: '/' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQs', href: '/transfers' },
    ],
  },
];
