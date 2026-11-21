# travellah

Website for a private airport transfer and tour business on Sri Lanka's south coast:
Colombo Airport (CMB) pick-ups and drop-offs to Galle, Weligama, Mirissa, Tangalle and more,
plus private tour packages for international travellers.

Live: https://ravinduyas.github.io/travellah/

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build      # client build + prerendered HTML for every page, sitemap.xml, robots.txt, llms.txt
```

Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Where things live

- `src/data/travelData.ts`: contact details, routes and prices, vehicles, tours, FAQs, reviews
- `src/data/blogData.ts`: blog articles
- `src/seo/seo.ts`: page titles, descriptions and structured data
- `src/components/TransferBookingSection.tsx`: the 5-step booking flow (bookings are sent by WhatsApp)

Before launch, replace the placeholder phone/WhatsApp/email, photos, prices and sample reviews.
