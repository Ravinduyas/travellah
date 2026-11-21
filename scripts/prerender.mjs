/**
 * Build-time prerender. Runs after `vite build` (client) and `vite build --ssr` (server bundle):
 *   - writes a real HTML file for every page, with its own title, description, canonical,
 *     social tags, structured data and the page content already in the HTML
 *   - writes sitemap.xml, robots.txt and llms.txt
 * Search engines and AI crawlers get full content without running JavaScript; in the
 * browser the app loads on top as usual.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const server = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href);
const { render, getSeo, indexablePaths, llmsTxt, SITE_URL, siteUrl } = server;

const template = await readFile(join(dist, 'index.html'), 'utf8');
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const ROOT_DIV = '<div id="root"></div>';
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('index.html is missing the <!--seo:start/end--> markers or <div id="root"></div>');
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function headFor(seo) {
  const indexable = seo.robots.startsWith('index');
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${esc(seo.robots)}" />`,
    `<link rel="canonical" href="${esc(seo.canonical)}" />`,
    `<meta property="og:type" content="${seo.ogType}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${esc(seo.canonical)}" />`,
    `<meta property="og:image" content="${esc(seo.image)}" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${esc(seo.image)}" />`,
  ];
  // the hero photo is the largest thing on screen: start loading it straight away
  if (indexable) {
    tags.push(`<link rel="preload" as="image" href="${esc(new URL(seo.image).pathname)}" fetchpriority="high" />`);
  }
  for (const block of seo.jsonLd) {
    tags.push(
      `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`,
    );
  }
  return tags.join('\n    ');
}

async function writePage(path, file) {
  const seo = getSeo(path);
  const html = template
    .replace(SEO_BLOCK, () => headFor(seo))
    .replace(ROOT_DIV, () => `<div id="root">${render(path)}</div>`);
  const out = join(dist, file);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  return html.length;
}

const pages = indexablePaths();
const written = [];
for (const { path } of pages) {
  const file = path === '/' ? 'index.html' : `${path.slice(1)}/index.html`;
  written.push([path, await writePage(path, file)]);
}
// utility pages: real files so direct links work on any static host, but not indexed
written.push(['/book', await writePage('/book', 'book/index.html')]);
written.push(['404', await writePage('/page-not-found', '404.html')]);

/* sitemap.xml */
const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map(
    (p) =>
      `  <url><loc>${esc(getSeo(p.path).canonical)}</loc><lastmod>${p.lastmod ?? today}</lastmod><priority>${p.priority.toFixed(1)}</priority></url>`,
  ),
  '</urlset>',
  '',
].join('\n');
await writeFile(join(dist, 'sitemap.xml'), sitemap);

/* robots.txt: everything is open, including AI search and assistant crawlers */
const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot'];
const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  '# AI search and assistant crawlers are welcome',
  ...aiBots.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']),
  `Sitemap: ${siteUrl('/sitemap.xml')}`,
  '',
].join('\n');
await writeFile(join(dist, 'robots.txt'), robots);

/* llms.txt: a plain-text summary of the business, prices and FAQs for AI assistants */
await writeFile(join(dist, 'llms.txt'), llmsTxt());

console.log(`Prerendered ${written.length} pages for ${SITE_URL}`);
for (const [path, size] of written) console.log(`  ${path.padEnd(42)} ${(size / 1024).toFixed(0)} kB`);
console.log('  + sitemap.xml, robots.txt, llms.txt');
