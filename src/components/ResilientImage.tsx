import { useState } from 'react';
import { Compass } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  /** Above-the-fold image (hero): load first. Everything else loads lazily. */
  priority?: boolean;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
  priority = false,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#20343B] via-[#2C4C56] to-[#17262B] text-white/80 p-6 text-center ${className}`}
      >
        <Compass className="w-7 h-7 mb-2 opacity-75" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
