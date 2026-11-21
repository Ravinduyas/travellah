import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CONTACT, NAV_LINKS } from '../data/travelData';
import { Link, useLocation } from '../router';

function isActive(current: string, href: string) {
  if (href === '/') return current === '/';
  return current === href || current.startsWith(`${href}/`);
}

/** Transparent nav bar that sits on top of the page's photo hero. */
export function SiteHeader() {
  const { path } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="relative z-20 flex items-center justify-between gap-8 px-6 sm:px-10 lg:px-12 pt-7">
        <Link
          to="/"
          className="text-[20px] font-medium tracking-[-0.02em] text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 rounded"
        >
          {CONTACT.brand}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 lg:gap-9 text-[13px] text-white/85"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(path, link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap shrink-0 transition-colors pb-1 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 rounded-sm ${
                  active
                    ? 'text-white font-medium border-b-[1.5px] border-white'
                    : 'hover:text-white border-b-[1.5px] border-transparent hover:border-white/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/25 text-white cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </header>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="relative z-20 md:hidden mx-6 mt-3 rounded-2xl bg-[#141E22]/95 backdrop-blur-md border border-white/15 p-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive(path, link.href) ? 'page' : undefined}
              className={`px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive(path, link.href)
                  ? 'bg-white/12 text-white font-medium'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
