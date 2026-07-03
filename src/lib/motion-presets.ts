/* إعدادات الحركة الموحدة (Motion Presets) - ديوان قبيلة السياحين */

export const transitionFast = {
  duration: 0.15, // 150ms (--duration-fast)
  ease: [0.16, 1, 0.3, 1], // --ease-brand
};

export const transitionBase = {
  duration: 0.3, // 300ms (--duration-base)
  ease: [0.16, 1, 0.3, 1], // --ease-brand
};

export const transitionSlow = {
  duration: 0.5, // 500ms (--duration-slow)
  ease: [0.16, 1, 0.3, 1], // --ease-brand
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
