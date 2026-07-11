/* إعدادات الحركة الموحدة (Motion Presets) - ديوان قبيلة السياحين */

const EASE_BRAND: [number, number, number, number] = [0.16, 1, 0.3, 1]; // --ease-brand

export const transitionFast = {
  duration: 0.15, // 150ms (--duration-fast)
  ease: EASE_BRAND,
};

export const transitionBase = {
  duration: 0.3, // 300ms (--duration-base)
  ease: EASE_BRAND,
};

export const transitionSlow = {
  duration: 0.5, // 500ms (--duration-slow)
  ease: EASE_BRAND,
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: transitionBase,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: transitionBase,
};

export const slideUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: transitionBase,
};

export const slideDown = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
  transition: transitionBase,
};
