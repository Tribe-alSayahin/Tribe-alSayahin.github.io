import React, { useRef, useCallback } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface Tilt3DProps extends React.HTMLAttributes<HTMLDivElement> {
  /** أقصى زاوية إمالة بالدرجات */
  maxTilt?: number;
  /** مقدار الارتفاع على محور Z عند التحويم (px) */
  lift?: number;
  /** إظهار البريق الزجاجي التابع للمؤشر */
  glare?: boolean;
}

/**
 * غلاف إمالة ثلاثي الأبعاد يتتبع المؤشر — يمنح أي محتوى
 * عمقاً مجسّماً مع بريق نحاسي يتبع حركة المؤشر.
 * يُعطَّل تلقائياً عند تفضيل تقليل الحركة.
 */
export const Tilt3D: React.FC<Tilt3DProps> = ({
  children,
  className = '',
  maxTilt = 7,
  lift = 22,
  glare = true,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const prefersReduced = useReducedMotion();

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReduced || e.pointerType === 'touch') return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.transform = `perspective(1200px) rotateX(${(0.5 - py) * maxTilt}deg) rotateY(${(px - 0.5) * maxTilt}deg) translateZ(${lift}px)`;
        el.style.setProperty('--glare-x', `${px * 100}%`);
        el.style.setProperty('--glare-y', `${py * 100}%`);
      });
    },
    [prefersReduced, maxTilt, lift]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.transform = '';
  }, []);

  return (
    <div
      ref={ref}
      className={`card-3d relative ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  );
};
