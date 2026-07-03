import { useState, useEffect, useRef } from 'react';

export default function DuneSilhouette() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate scroll offset relative to when the component is entering/visible
        const offset = window.innerHeight - rect.top;
        if (offset > 0) {
          setScrollY(offset);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax multipliers for each layer (representing depth)
  // Back dunes move slowest, front dunes move fastest
  const backY = Math.min(scrollY * 0.08, 120);
  const midY = Math.min(scrollY * 0.18, 160);
  const frontY = Math.min(scrollY * 0.28, 200);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden h-[220px] md:h-[300px] bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none select-none z-10"
      style={{ marginBottom: '-1px' }} // prevent pixel-gaps with next section
    >
      {/* Background Star Dust / Fire Sparks */}
      <div className="absolute inset-x-0 bottom-0 h-full bg-[radial-gradient(ellipse_at_bottom,rgba(201,151,62,0.08),transparent_60%)]" />

      {/* 1. BACK DUNE (Deep Olive / Indigo Silhouette) */}
      <div
        className="absolute inset-x-0 bottom-[-60px] h-[180px] md:h-[240px] transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${60 - backY}px) scaleY(1.05)` }}
      >
        <svg
          className="w-full h-full text-olive/35"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,120 C360,180 720,60 1080,110 C1260,135 1380,165 1440,180 L1440,200 L0,200 Z" />
        </svg>
      </div>

      {/* 2. MIDDLE DUNE (Warm Olive / Faint Brass Horizon) */}
      <div
        className="absolute inset-x-0 bottom-[-40px] h-[160px] md:h-[210px] transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${40 - midY}px)` }}
      >
        <svg
          className="w-full h-full text-[#1d2316]" // very dark warm olive-drab
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,80 C240,40 580,160 920,100 C1160,58 1320,110 1440,130 L1440,200 L0,200 Z" />
        </svg>
      </div>

      {/* 3. FRONT DUNE (Deep Ink / Coffee Black Dune Top) */}
      <div
        className="absolute inset-x-0 bottom-[-20px] h-[130px] md:h-[180px] transition-transform duration-75 ease-out"
        style={{ transform: `translateY(${20 - frontY}px)` }}
      >
        <svg
          className="w-full h-full text-ink" // primary ink black
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          {/* Detailed front dune curve with a razor-thin golden ridge highlighting the brass palette */}
          <path d="M0,40 C420,120 860,20 1200,70 C1320,87 1400,95 1440,100 L1440,200 L0,200 Z" />
        </svg>

        {/* Dune Ridge Golden Highlight Edge */}
        <div className="absolute inset-x-0 top-0 h-[2px] opacity-25 bg-gradient-to-r from-transparent via-brass to-transparent blur-[1px]" />
      </div>

      {/* Archival Folio Number Watermark overlay */}
      <div className="absolute left-10 bottom-6 text-7xl font-mono font-extrabold text-[#edc978]/3 tracking-wider select-none">
        F.09
      </div>
    </div>
  );
}
