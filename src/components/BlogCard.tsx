import { formatPostDate, type BlogPost } from '../data/blogData';
import { Link } from '../router';
import { Reveal, Unmask } from './motion/effects';
import { ResilientImage } from './ResilientImage';

export function BlogCard({ post, delay = 0 }: { post: BlogPost; delay?: number }) {
  return (
    <article className="group flex flex-col">
      <Unmask delay={delay}>
        <Link
          to={`/blog/${post.slug}`}
          className="block overflow-hidden rounded-[22px] h-[230px] focus-visible:outline-2 focus-visible:outline-[#4694A4] focus-visible:outline-offset-2"
          tabIndex={-1}
          aria-hidden="true"
        >
          <ResilientImage
            src={post.image}
            alt=""
            fallbackLabel={post.category}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:rotate-[0.6deg]"
          />
        </Link>
      </Unmask>
      <Reveal delay={delay + 0.15} y={16} className="pt-4 flex flex-col flex-1">
        <p className="text-[11.5px] text-neutral-500">
          <span className="text-[#3E8E9E] font-medium">{post.category}</span> ·{' '}
          {formatPostDate(post.date)} · {post.readMinutes} min read
        </p>
        <h3 className="mt-2 text-[18px] font-medium text-[#171717] leading-snug tracking-[-0.01em]">
          <Link to={`/blog/${post.slug}`} className="hover:text-[#3E8E9E] transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-[13px] text-[#737373] leading-relaxed">{post.excerpt}</p>
      </Reveal>
    </article>
  );
}
