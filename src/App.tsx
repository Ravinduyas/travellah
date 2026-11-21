import { useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { FooterSection } from './components/FooterSection';
import { Preloader } from './components/motion/Preloader';
import { TideTransition } from './components/motion/TideTransition';
import { FloatingActions } from './components/premium/FloatingActions';
import { FloatingNav } from './components/premium/FloatingNav';
import { BOOKING_PATH } from './booking';
import { BlogPage } from './pages/BlogPage';
import { BookPage } from './pages/BookPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ToursPage } from './pages/ToursPage';
import { TransfersPage } from './pages/TransfersPage';
import { useLocation } from './router';
import { applySeo } from './seo/seo';
import { pageZoom } from './utils/pageZoom';

function CurrentPage({ path }: { path: string }) {
  switch (path) {
    case '/':
      return <HomePage />;
    case '/transfers':
      return <TransfersPage />;
    case '/tours':
      return <ToursPage />;
    case '/blog':
      return <BlogPage />;
    case '/contact':
      return <ContactPage />;
    case BOOKING_PATH:
      return <BookPage />;
  }
  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) return <BlogPostPage key={blogMatch[1]} slug={blogMatch[1]} />;
  return <NotFoundPage />;
}

/** One listener feeds the cursor position to every `.spotlight` card (used by its CSS glow). */
function useSpotlightCards() {
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest?.('.spotlight') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const zoom = pageZoom(); // screen px → CSS px on scaled-up large screens
      card.style.setProperty('--mx', `${(event.clientX - rect.left) / zoom}px`);
      card.style.setProperty('--my', `${(event.clientY - rect.top) / zoom}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
}

export default function App() {
  const { path } = useLocation();
  useSpotlightCards();
  // keep title, description, canonical and structured data right while navigating in the app
  useEffect(() => applySeo(path), [path]);
  // the booking page opens in its own tab and stays focused: no site footer or floating menu
  const isBooking = path === BOOKING_PATH;

  return (
    // reducedMotion="user": visitors who ask for less motion get fades only, no movement
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-[#171717]">
        {/* keyed by path so every page's entrance animations replay on navigation */}
        <CurrentPage key={path} path={path} />
        {!isBooking && <FooterSection />}
      </div>
      {!isBooking && <FloatingNav />}
      {!isBooking && <FloatingActions />}
      <TideTransition path={path} />
      <Preloader />
    </MotionConfig>
  );
}
