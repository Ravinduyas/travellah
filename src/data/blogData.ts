import { IMAGES } from './travelData';

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Transfers' | 'Travel tips' | 'Things to do';
  date: string; // ISO
  readMinutes: number;
  image: string;
  imageAlt: string;
  body: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'colombo-airport-to-weligama',
    title: 'How to get from Colombo Airport to Weligama and Mirissa',
    excerpt:
      'Private car, taxi app, bus or train? Here is how each option compares when you land at Bandaranaike International Airport.',
    category: 'Transfers',
    date: '2026-11-18',
    readMinutes: 5,
    image: IMAGES.coast,
    imageAlt: 'Ocean cliffs along a tropical coastline',
    body: [
      {
        type: 'p',
        text: 'Almost every international flight to Sri Lanka lands at Bandaranaike International Airport (CMB) in Katunayake, about 35 km north of Colombo. Weligama and Mirissa are roughly 180 to 190 km further south. Thanks to the expressways, the drive now takes around two and a half hours.',
      },
      { type: 'h2', text: 'Option 1: Private transfer (fastest)' },
      {
        type: 'p',
        text: 'A pre-booked driver meets you at arrivals and drives you door to door using the Katunayake Expressway, the Outer Circular Highway and the Southern Expressway. It is the easiest option after a long flight, especially with luggage, surfboards or children.',
      },
      {
        type: 'list',
        items: [
          'Time: about 2h 30m to Weligama, 2h 40m to Mirissa',
          'Works at any hour, including night arrivals',
          'Fixed price agreed before you fly, tolls included',
        ],
      },
      { type: 'h2', text: 'Option 2: Taxi apps' },
      {
        type: 'p',
        text: 'Ride-hailing apps work in Sri Lanka, but you need mobile data the moment you land, and long-distance rides can be cancelled or re-priced. Fine if you travel light and arrive in the daytime.',
      },
      { type: 'h2', text: 'Option 3: Bus and train' },
      {
        type: 'p',
        text: 'The cheapest way is a bus to Colombo, then an expressway bus or the coastal train south. Expect five to seven hours and several changes. Great for backpackers with time, hard work with big bags.',
      },
      { type: 'h2', text: 'Our tip' },
      {
        type: 'p',
        text: 'Book your airport pick-up before you fly and share your flight number. Your driver will track the flight and wait for you, so a delay never becomes a problem.',
      },
    ],
  },
  {
    slug: 'best-time-to-visit-south-coast',
    title: 'Best time to visit Sri Lanka’s south coast',
    excerpt:
      'Sri Lanka has two monsoons. Here is when the beaches of Galle, Weligama and Mirissa are at their best.',
    category: 'Travel tips',
    date: '2026-11-10',
    readMinutes: 4,
    image: IMAGES.cliff,
    imageAlt: 'Turquoise sea below a green headland',
    body: [
      {
        type: 'p',
        text: 'The south and west coasts are driest from December to April. Seas are calm, skies are mostly blue, and it is the main season for swimming, beginner surfing and whale watching.',
      },
      { type: 'h2', text: 'December to April: high season' },
      {
        type: 'list',
        items: [
          'Calm seas and sunny days',
          'Whale watching from Mirissa (about November to April)',
          'Book transfers and hotels early around Christmas and New Year',
        ],
      },
      { type: 'h2', text: 'May to October: green season' },
      {
        type: 'p',
        text: 'The south-west monsoon brings rain showers and bigger waves. It rarely rains all day, prices drop and the coast is quieter. Experienced surfers enjoy the swell, and the east coast is at its best at this time.',
      },
      { type: 'h2', text: 'Our tip' },
      {
        type: 'p',
        text: 'Visiting in the green season? Combine the south coast with the Cultural Triangle or the hill country, which are good all year round.',
      },
    ],
  },
  {
    slug: 'whale-watching-mirissa',
    title: 'Whale watching in Mirissa: what to expect',
    excerpt:
      'Blue whales, spinner dolphins and an early start. A simple guide to planning your morning at sea.',
    category: 'Things to do',
    date: '2026-11-02',
    readMinutes: 4,
    image: IMAGES.stairs,
    imageAlt: 'Old stone stairs in a tropical garden',
    body: [
      {
        type: 'p',
        text: 'Mirissa is one of the best places in the world to see blue whales. Boats leave the harbour around 6:30 to 7:00am and spend four to five hours at sea.',
      },
      { type: 'h2', text: 'When to go' },
      {
        type: 'p',
        text: 'The season runs from about November to April, when the sea is calmest. Outside these months the sea is rough and most boats do not run.',
      },
      { type: 'h2', text: 'What to bring' },
      {
        type: 'list',
        items: [
          'Sun cream, a hat and sunglasses',
          'A light jacket for the early morning',
          'Seasickness tablets, taken before you board',
          'A camera with a zoom lens',
        ],
      },
      { type: 'h2', text: 'Choosing a boat' },
      {
        type: 'p',
        text: 'Pick an operator that keeps a respectful distance from the whales and limits the number of boats around them. We only work with responsible operators, and our day tour includes a hotel pick-up before sunrise.',
      },
    ],
  },
  {
    slug: 'galle-fort-walking-guide',
    title: 'A half-day walking guide to Galle Fort',
    excerpt:
      'Ramparts, the lighthouse, cafés and the best place to watch the sunset inside this UNESCO World Heritage site.',
    category: 'Things to do',
    date: '2026-10-25',
    readMinutes: 5,
    image: IMAGES.temple,
    imageAlt: 'Temple beside a calm misty lake',
    body: [
      {
        type: 'p',
        text: 'Galle Fort was first built by the Portuguese and later expanded by the Dutch in the 17th century. Today it is a UNESCO World Heritage site full of old streets, boutiques and cafés, and it is small enough to explore on foot in an afternoon.',
      },
      { type: 'h2', text: 'A simple route' },
      {
        type: 'list',
        items: [
          'Enter through the Main Gate and walk the ramparts towards the clock tower',
          'Follow the walls to the lighthouse and Flag Rock',
          'Wander Church Street and Pedlar Street for shops and cafés',
          'Finish on the western ramparts for sunset',
        ],
      },
      { type: 'h2', text: 'Good to know' },
      {
        type: 'p',
        text: 'Wear comfortable shoes and cover your shoulders and knees if you visit the churches or the mosque. Late afternoon is cooler and the light is beautiful.',
      },
    ],
  },
  {
    slug: 'first-time-sri-lanka-checklist',
    title: 'First time in Sri Lanka? A practical arrival checklist',
    excerpt:
      'Visa, SIM card, cash and getting to your hotel: everything to sort out in your first hour after landing.',
    category: 'Travel tips',
    date: '2026-10-15',
    readMinutes: 6,
    image: IMAGES.gate,
    imageAlt: 'Couple walking toward green hills',
    body: [
      {
        type: 'p',
        text: 'Landing in a new country after a long flight is easier with a plan. Here is what to do between the plane and your hotel.',
      },
      { type: 'h2', text: 'Before you fly' },
      {
        type: 'list',
        items: [
          'Check the current visa / ETA rules on the official Sri Lanka immigration website',
          'Book your airport transfer and share your flight number',
          'Save your hotel address and your driver’s WhatsApp number offline',
        ],
      },
      { type: 'h2', text: 'At the airport' },
      {
        type: 'list',
        items: [
          'Mobile network counters in the arrivals hall sell tourist SIM cards',
          'ATMs and currency exchange are available after baggage claim',
          'Your driver waits at the arrivals exit with a name board',
        ],
      },
      { type: 'h2', text: 'On the road' },
      {
        type: 'p',
        text: 'The drive south is mostly expressway. Ask your driver for a short stop if you need food or a break. Sri Lankans drive on the left, and seat belts should always be worn.',
      },
    ],
  },
  {
    slug: 'tuk-tuk-or-private-car',
    title: 'Tuk-tuk, train or private car? Getting around the south coast',
    excerpt:
      'Short hops between beaches, day trips and longer journeys. Which way of travelling suits which trip.',
    category: 'Transfers',
    date: '2026-10-05',
    readMinutes: 4,
    image: IMAGES.mountain,
    imageAlt: 'Green mountains rising above the clouds at sunrise',
    body: [
      {
        type: 'p',
        text: 'The south coast towns sit close together along the coastal road. How you travel depends on the distance and how much luggage you have.',
      },
      { type: 'h2', text: 'Tuk-tuks for short trips' },
      {
        type: 'p',
        text: 'Perfect for 5 to 20 minute rides between beaches, restaurants and surf spots. Use a metered tuk-tuk or a ride app, or agree the price before you get in.',
      },
      { type: 'h2', text: 'The coastal train' },
      {
        type: 'p',
        text: 'The railway runs along the ocean from Colombo to Matara, passing Hikkaduwa, Galle and Weligama. It is cheap and scenic, but can be crowded and has little space for luggage.',
      },
      { type: 'h2', text: 'Private car for longer journeys' },
      {
        type: 'p',
        text: 'For the airport, safaris, the hill country or any trip with bags, a private car with a driver is the most comfortable and the safest choice. You leave when you want and stop where you like.',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
