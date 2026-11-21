import { useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { CtaBannerSection } from '../components/CtaBannerSection';
import { PageHero } from '../components/PageHero';
import { BLOG_POSTS, type BlogPost } from '../data/blogData';
import { IMAGES } from '../data/travelData';

const CATEGORIES: Array<'All' | BlogPost['category']> = ['All', 'Transfers', 'Travel tips', 'Things to do'];

export function BlogPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const posts = category === 'All' ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === category);

  return (
    <main>
      <PageHero
        eyebrow="BLOG"
        title="Travel tips for Sri Lanka’s *south* coast"
        intro="Getting from the airport, the best time to visit, and what to see and do. Written by our local drivers and guides."
        image={IMAGES.blogHero}
        imageAlt="Old stone stairs in a tropical garden"
      />

      <section className="max-w-[1180px] mx-auto px-6 md:px-10 py-14 lg:py-20">
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter articles by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-[12.5px] font-medium transition-colors cursor-pointer ${
                category === c
                  ? 'bg-[#171717] text-white'
                  : 'border border-neutral-200 text-[#404040] hover:border-neutral-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} delay={(i % 3) * 0.1} />
          ))}
        </div>
      </section>

      <CtaBannerSection />
    </main>
  );
}
