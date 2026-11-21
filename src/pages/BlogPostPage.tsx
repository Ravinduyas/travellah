import { ArrowLeft } from 'lucide-react';
import { BlogCard } from '../components/BlogCard';
import { CtaBannerSection } from '../components/CtaBannerSection';
import { PageHero } from '../components/PageHero';
import { BLOG_POSTS, formatPostDate, getPostBySlug } from '../data/blogData';
import { Link } from '../router';
import { NotFoundPage } from './NotFoundPage';
import { ReadingProgress, SplitWords } from '../components/motion/effects';
import { BookingLink } from '../booking';

export function BlogPostPage({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);

  if (!post) return <NotFoundPage />;

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main>
      <ReadingProgress />
      <PageHero
        eyebrow={post.category.toUpperCase()}
        title={post.title}
        intro={`${formatPostDate(post.date)} · ${post.readMinutes} min read`}
        image={post.image}
        imageAlt={post.imageAlt}
      />

      <article className="max-w-[720px] mx-auto px-6 py-14 lg:py-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-neutral-500 hover:text-[#171717] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" /> All articles
        </Link>

        <p className="text-[17px] sm:text-[18px] text-[#404040] leading-[1.7] mb-8">{post.excerpt}</p>

        <div className="space-y-5 text-[15px] text-[#404040] leading-[1.75]">
          {post.body.map((block, i) => {
            if (block.type === 'h2') {
              return (
                <h2 key={i} className="pt-4 text-[24px] font-medium text-[#171717] tracking-[-0.01em] leading-snug">
                  {block.text}
                </h2>
              );
            }
            if (block.type === 'list') {
              return (
                <ul key={i} className="list-disc pl-5 space-y-1.5 marker:text-[#4694A4]">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{block.text}</p>;
          })}
        </div>

        <div className="mt-12 rounded-[22px] bg-neutral-50 border border-neutral-200 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[16px] font-medium text-[#171717]">Need a ride from Colombo airport?</p>
            <p className="text-[13px] text-[#737373] mt-1">Fixed prices to every south coast town, driver waiting at arrivals.</p>
          </div>
          <BookingLink
            
            className="shrink-0 rounded-full bg-[#171717] hover:bg-neutral-800 text-white px-6 py-2.5 text-[13px] font-medium transition-colors text-center"
          >
            Book a transfer
          </BookingLink>
        </div>
      </article>

      <section className="max-w-[1180px] mx-auto px-6 md:px-10 pb-14">
        <h2 className="text-[26px] sm:text-[30px] font-normal tracking-[-0.02em] text-[#171717] mb-8">
            <SplitWords text="Keep *reading*" />
          </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((p, i) => (
            <BlogCard key={p.slug} post={p} delay={i * 0.1} />
          ))}
        </div>
      </section>

      <CtaBannerSection />
    </main>
  );
}
