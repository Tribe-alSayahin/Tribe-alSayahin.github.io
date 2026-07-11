import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Compass, ChevronDown } from 'lucide-react';

interface ScrollFilmCanvasProps {
  framesCount?: number;
  framePathPattern?: string; // e.g., "/frames/f%03d.jpg"
}

interface Caption {
  text: string;
  sub: string;
  startProgress: number; // 0.0 to 1.0
  endProgress: number;   // 0.0 to 1.0
}

const CAPTIONS: Caption[] = [
  {
    text: "عالية نجد.. موطن الأمجاد والتاريخ",
    sub: "حيث نقشت قبيلة السياحين ملاحم الوفاء والكرم وسط هضاب نجد الشامخة",
    startProgress: 0.05,
    endProgress: 0.25,
  },
  {
    text: "معالم راسخة تشهد على العراقة",
    sub: "من هضبة كبش وجبل تيس إلى آبار المياه المورثة جيلاً بعد جيل",
    startProgress: 0.30,
    endProgress: 0.55,
  },
  {
    text: "المخطوطات والخرائط الجغرافية المعتمدة",
    sub: "توثيق تاريخي دقيق بإشراف وإدارة تضمن حفظ الإرث للأجيال القادمة",
    startProgress: 0.60,
    endProgress: 0.85,
  }
];

export const ScrollFilmCanvas: React.FC<ScrollFilmCanvasProps> = ({
  framesCount = 45,
  framePathPattern = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(() => !framePathPattern);
  const [useFallback, setUseFallback] = useState(true);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnFrameRef = useRef<number>(-1);

  // 1. Preload sequence with a safety timeout (9 seconds)
  useEffect(() => {
    // If no pattern is provided, we default to procedural fallback canvas (which is beautiful and custom styled)
    if (!framePathPattern) {
      setUseFallback(true);
      setLoadProgress(100);
      setIsReady(true);
      return;
    }

    let completedCount = 0;
    let successfulCount = 0;
    const readyThreshold = Math.ceil(framesCount * 0.6);
    const fallbackThreshold = Math.ceil(framesCount * 0.3);
    let didPromoteReady = false;

    const promoteReady = () => {
      if (didPromoteReady) return;
      didPromoteReady = true;
      if (successfulCount < fallbackThreshold) {
        setUseFallback(true);
      }
      setIsReady(true);
    };

    const markFrameCompleted = () => {
      completedCount++;
      const percent = Math.round((completedCount / framesCount) * 100);
      setLoadProgress(percent);

      // Exit loading state once enough frames are usable, or once all requests resolved.
      if (successfulCount >= readyThreshold || completedCount === framesCount) {
        promoteReady();
      }
    };

    const loadedImages: HTMLImageElement[] = [];
    const timeoutId = setTimeout(() => {
      // Safety timeout: If loading takes more than 9s, promote to ready with whatever we loaded, or fallback
      console.log("Scroll Film: Preload safety timeout reached.");
      promoteReady();
    }, 9000);

    for (let i = 0; i < framesCount; i++) {
      const img = new Image();
      // Format index like f000.jpg, f001.jpg
      const frameNum = String(i).padStart(3, '0');
      img.src = framePathPattern.replace('%03d', frameNum);
      img.referrerPolicy = "no-referrer";
      
      img.onload = () => {
        successfulCount++;
        markFrameCompleted();
      };

      img.onerror = () => {
        markFrameCompleted();
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
    return () => {
      clearTimeout(timeoutId);
    };
  }, [framesCount, framePathPattern]);

  // 2. Track Scroll Progress inside our component container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the component has been scrolled
      // Start tracking when top of container reaches top of viewport, and end when bottom reaches bottom
      const totalScrollableHeight = rect.height - windowHeight;
      if (totalScrollableHeight <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / totalScrollableHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // 3. Render and Draw onto Canvas with object-cover and high DPR support
  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get client dimensions
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Scale for high DPI displays
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.scale(dpr, dpr);

    // Frame Drawing logic
    if (!useFallback && imagesRef.current.length > 0 && isReady) {
      const frameIndex = Math.min(
        Math.max(Math.round(progress * (imagesRef.current.length - 1)), 0),
        imagesRef.current.length - 1
      );

      // Skip redundant draws
      if (lastDrawnFrameRef.current === frameIndex) return;
      lastDrawnFrameRef.current = frameIndex;

      const img = imagesRef.current[frameIndex];
      if (img && img.complete) {
        // Clear canvas with edge color matching our heritage background
        ctx.fillStyle = '#0c0804';
        ctx.fillRect(0, 0, width, height);

        // Object-cover math
        const imgWidth = img.width || 1280;
        const imgHeight = img.height || 720;
        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = width / height;
        
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawHeight = width / imgRatio;
          offsetY = (height - drawHeight) / 2;
        } else {
          drawWidth = height * imgRatio;
          offsetX = (width - drawWidth) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Add elegant overlay vignette to keep text readable
        const gradient = ctx.createRadialGradient(
          width / 2, height / 2, Math.min(width, height) * 0.2,
          width / 2, height / 2, Math.max(width, height) * 0.8
        );
        gradient.addColorStop(0, 'rgba(12, 8, 4, 0.15)');
        gradient.addColorStop(0.6, 'rgba(12, 8, 4, 0.6)');
        gradient.addColorStop(1, 'rgba(12, 8, 4, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        return;
      }
    }

    // Elegant Tonal Fallback: Draw high-end procedural vector graphics that animate beautifully with scroll!
    // Since "No Images" is a primary directive, this provides a mesmerizing, luxurious digital manuscript effect.
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = '#0c0804';
    ctx.fillRect(0, 0, width, height);

    // Grid System
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer Gold Borders
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.05)';
    ctx.strokeRect(25, 25, width - 50, height - 50);

    // Interactive Celestial Compass inside Canvas
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.35;

    // Draw rotating concentric rings driven by scroll progress!
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.1)';
    
    // Ring 1
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Ring 2 with dotted style
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.15)';
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rotating Ring 3 driven by progress
    const angle = progress * Math.PI * 2;
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.6, angle, angle + Math.PI * 1.5);
    ctx.stroke();

    // Draw Astrolabe ticks & directions
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.2)';
    ctx.fillStyle = '#edc978';
    ctx.font = '10px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const directions = [
      { name: 'الشمال', angle: -Math.PI / 2 },
      { name: 'الشرق', angle: 0 },
      { name: 'الجنوب', angle: Math.PI / 2 },
      { name: 'الغرب', angle: Math.PI }
    ];

    directions.forEach(dir => {
      const x = centerX + Math.cos(dir.angle) * (maxRadius * 0.9);
      const y = centerY + Math.sin(dir.angle) * (maxRadius * 0.9);
      ctx.fillText(dir.name, x, y);

      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(dir.angle) * (maxRadius * 0.75), centerY + Math.sin(dir.angle) * (maxRadius * 0.75));
      ctx.lineTo(centerX + Math.cos(dir.angle) * (maxRadius * 0.85), centerY + Math.sin(dir.angle) * (maxRadius * 0.85));
      ctx.stroke();
    });

    // Draw intricate central star
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle * 0.5);
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.5)';
    ctx.lineWidth = 1.5;
    
    for (let j = 0; j < 8; j++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -maxRadius * 0.45);
      ctx.lineTo(maxRadius * 0.08, -maxRadius * 0.1);
      ctx.closePath();
      
      const starGrad = ctx.createLinearGradient(0, 0, 0, -maxRadius * 0.45);
      starGrad.addColorStop(0, 'rgba(201, 162, 39, 0.1)');
      starGrad.addColorStop(0.7, 'rgba(237, 201, 120, 0.4)');
      starGrad.addColorStop(1, 'rgba(237, 201, 120, 0.8)');
      
      ctx.fillStyle = starGrad;
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Ambient floating dust particles driven by scroll
    ctx.fillStyle = 'rgba(237, 201, 120, 0.15)';
    for (let k = 1; k <= 20; k++) {
      const pX = centerX + Math.cos(k * 2.3 + progress * 2) * (maxRadius * (0.3 + (k % 5) * 0.15));
      const pY = centerY + Math.sin(k * 1.7 - progress * 1.5) * (maxRadius * (0.3 + (k % 5) * 0.15));
      ctx.beginPath();
      ctx.arc(pX, pY, 1.5 + (k % 3), 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Sadu tribal pattern overlays on the sides
    ctx.fillStyle = 'rgba(201, 162, 39, 0.04)';
    const saduHeight = 30;
    // Draw left trim
    for (let sY = 30; sY < height - 30; sY += saduHeight) {
      ctx.beginPath();
      ctx.moveTo(40, sY);
      ctx.lineTo(55, sY + saduHeight/2);
      ctx.lineTo(40, sY + saduHeight);
      ctx.lineTo(45, sY + saduHeight/2);
      ctx.closePath();
      ctx.fill();
    }
    // Draw right trim
    for (let sY = 30; sY < height - 30; sY += saduHeight) {
      ctx.beginPath();
      ctx.moveTo(width - 40, sY);
      ctx.lineTo(width - 55, sY + saduHeight/2);
      ctx.lineTo(width - 40, sY + saduHeight);
      ctx.lineTo(width - 45, sY + saduHeight/2);
      ctx.closePath();
      ctx.fill();
    }

    // Big title centered watermarked behind astrolabe
    ctx.save();
    ctx.globalAlpha = 0.02 + (progress * 0.03);
    ctx.fillStyle = '#ece1cb';
    ctx.font = 'bold 70px serif';
    ctx.textAlign = 'center';
    ctx.fillText('السياحين', centerX, centerY - 100);
    ctx.restore();
  }, [isReady, useFallback]);

  // Trigger draw on progress, readiness, or resize
  useEffect(() => {
    drawFrame(scrollProgress);
  }, [drawFrame, scrollProgress]);

  // Handle Resize correctly
  useEffect(() => {
    const handleResize = () => {
      drawFrame(scrollProgress);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, scrollProgress]);

  // Smoothstep function to map opacity based on progress ranges
  const getCaptionOpacity = (progress: number, start: number, end: number) => {
    // Elegant fade in, hold, and fade out
    const fadeInLength = 0.04;
    const fadeOutLength = 0.04;

    if (progress < start || progress > end) return 0;
    
    if (progress >= start && progress < start + fadeInLength) {
      // Fade in phase
      const t = (progress - start) / fadeInLength;
      return t * t * (3 - 2 * t); // Smoothstep
    }
    
    if (progress > end - fadeOutLength && progress <= end) {
      // Fade out phase
      const t = (end - progress) / fadeOutLength;
      return t * t * (3 - 2 * t); // Smoothstep
    }

    // Fully visible phase
    return 1;
  };

  return (
    <div 
      id="scroll-film-container"
      ref={containerRef} 
      className="relative w-full h-[300vh] bg-[#070503]"
    >
      {/* Sticky Canvas Viewport (100vh) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Loading Screen */}
        <AnimatePresence>
          {!isReady && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-50 bg-[#0c0804] flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border border-brass/20 flex items-center justify-center">
                  <Film className="w-8 h-8 text-brass animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-t-2 border-brass animate-spin" />
              </div>
              <h3 className="text-xl font-serif text-sand font-bold mb-2">جاري تهيئة العرض السينمائي التفاعلي</h3>
              <p className="text-xs text-sand-dim/70 max-w-xs mb-4">يتم تحميل الإطارات وعناصر التحكم التفاعلية لتقديم تجربة بصرية فائقة السلاسة</p>
              
              <div className="w-48 h-1.5 bg-ink border border-brass/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brass transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-brass-lt font-mono mt-2">{loadProgress}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Main High-Performance Canvas */}
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-cover block"
        />

        {/* Cinematic Scrolled Content Overlays (Captions - Off-center RTL style) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-end px-6 md:px-20 z-20">
          <div className="w-full max-w-xl text-right flex flex-col gap-6">
            {CAPTIONS.map((caption, idx) => {
              const opacity = getCaptionOpacity(scrollProgress, caption.startProgress, caption.endProgress);
              if (opacity <= 0.01) return null;

              return (
                <div 
                  key={idx}
                  style={{ opacity }}
                  className="transition-opacity duration-150 transform translate-y-0"
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brass/10 border border-brass/25 text-brass-lt text-[10px] font-kufi font-bold mb-3 tracking-wider">
                    <Compass className="w-3 h-3 text-brass-lt animate-spin-slow" /> مَعْلَمٌ وَتَارِيخ
                  </span>
                  <h3 className="text-2xl md:text-4xl font-serif font-bold text-sand drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] leading-tight">
                    {caption.text}
                  </h3>
                  <p className="text-sm md:text-base text-sand-dim/95 mt-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-sans leading-relaxed">
                    {caption.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar indicator along the right side */}
        <div className="absolute left-6 top-1/4 bottom-1/4 w-[2px] bg-brass/10 rounded-full z-20 flex flex-col justify-between items-center py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brass/30" />
          <div className="relative w-full flex-1 mx-2">
            <div 
              className="absolute top-0 bottom-0 left-0 right-0 bg-brass rounded-full transition-all duration-75 origin-top"
              style={{ transform: `scaleY(${scrollProgress})` }}
            />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-brass/30" />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 rotate-90 text-[9px] font-mono text-brass-lt tracking-wider uppercase whitespace-nowrap">
            Scroll Journey {Math.round(scrollProgress * 100)}%
          </span>
        </div>

        {/* Bottom indicator overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-20">
          {scrollProgress < 0.9 ? (
            <div className="flex flex-col items-center gap-1.5 animate-bounce">
              <span className="text-[10px] font-kufi text-brass-lt/80 font-bold uppercase tracking-widest">
                مرر للأسفل للمتابعة
              </span>
              <ChevronDown className="w-5 h-5 text-brass-lt" />
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-brass/20 text-[10px] font-kufi text-brass-lt">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>اكتملت الرحلة الجغرافية والتوثيقية للديار</span>
            </div>
          )}
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-8 right-8 border-t border-r border-brass/20 w-8 h-8 pointer-events-none" />
        <div className="absolute top-8 left-8 border-t border-l border-brass/20 w-8 h-8 pointer-events-none" />
        <div className="absolute bottom-8 right-8 border-b border-r border-brass/20 w-8 h-8 pointer-events-none" />
        <div className="absolute bottom-8 left-8 border-b border-l border-brass/20 w-8 h-8 pointer-events-none" />

      </div>
    </div>
  );
};

export default ScrollFilmCanvas;
