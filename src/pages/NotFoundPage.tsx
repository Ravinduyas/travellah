import { PageHero } from '../components/PageHero';
import { IMAGES } from '../data/travelData';
import { Link } from '../router';

export function NotFoundPage() {

  return (
    <main>
      <PageHero
        eyebrow="404"
        title="We could not find that *page*"
        intro="The page may have moved. Head back home or book your airport transfer."
        image={IMAGES.contactHero}
        imageAlt="Green mountains above the clouds"
      >
        <div className="flex gap-3 self-start lg:self-end">
          <Link to="/" className="rounded-full bg-white text-[#171717] hover:bg-neutral-100 px-6 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors">
            Go home
          </Link>
          <Link to="/transfers" className="rounded-full border border-white/60 text-white hover:bg-white/15 px-6 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors">
            Airport transfers
          </Link>
        </div>
      </PageHero>
    </main>
  );
}
