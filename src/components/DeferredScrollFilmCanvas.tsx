'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const ScrollFilmCanvas = dynamic(() => import('./ScrollFilmCanvas'), {
  ssr: false,
});

export default function DeferredScrollFilmCanvas() {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '0px' },
    );

    observer.observe(placeholder);
    return () => observer.disconnect();
  }, []);

  if (shouldLoad) return <ScrollFilmCanvas />;

  return (
    <div
      ref={placeholderRef}
      className="h-[300vh] w-full bg-ink"
      aria-hidden="true"
    />
  );
}
