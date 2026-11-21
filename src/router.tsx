import {
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from 'react';

/**
 * Tiny dependency-free router using the History API.
 * App paths: /, /transfers, /tours, /blog, /blog/:slug, /contact, /book
 * The build prerenders a real HTML file for each page, so no host rewrites are needed.
 *
 * The site can live in a sub-folder (GitHub Pages: /travellah/). App code always uses
 * plain paths like '/tours'; withBase() turns them into real URLs and stripBase() back.
 */

/** Where the site is served from: '' at a domain root, '/travellah' on GitHub Pages. */
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** App path → real URL: '/tours?x#y' → '/travellah/tours/?x#y'. Pages get a trailing slash
 *  because static hosts serve them as folders (and would redirect otherwise). */
export function withBase(to: string): string {
  if (!to.startsWith('/')) return to;
  const [, pathname, rest] = to.match(/^([^?#]*)(.*)$/) ?? ['', to, ''];
  let path = pathname || '/';
  if (path !== '/' && !path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) path += '/';
  return `${BASE}${path}${rest}`;
}

/** Real pathname → app path: '/travellah/tours/' → '/tours'. */
export function stripBase(pathname: string): string {
  const path = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname;
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

const listeners = new Set<() => void>();

/** Path used when rendering on the server (build-time prerender). */
let serverLocation = '/';
export function setServerLocation(path: string) {
  serverLocation = path;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

/** The current location as an app path (base removed). */
function getLocation() {
  return stripBase(window.location.pathname) + window.location.search + window.location.hash;
}

/** Scroll to the #hash target if there is one, otherwise to the top. */
function scrollForHash() {
  const id = window.location.hash.slice(1);
  const target = id ? document.getElementById(id) : null;
  if (target) target.scrollIntoView({ behavior: 'smooth' });
  // 'instant' overrides the site-wide `scroll-behavior: smooth` for page changes.
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

export function navigate(to: string) {
  if (to === getLocation()) {
    scrollForHash();
    return;
  }
  window.history.pushState(null, '', withBase(to));
  listeners.forEach((l) => l());
  // Wait for React to render the new page before scrolling.
  setTimeout(scrollForHash, 0);
}

export function useLocation() {
  const full = useSyncExternalStore(subscribe, getLocation, () => serverLocation);
  const [beforeHash] = full.split('#');
  const [path, search = ''] = beforeHash.split('?');
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return { path: normalized, params: new URLSearchParams(search) };
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={withBase(to)} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
