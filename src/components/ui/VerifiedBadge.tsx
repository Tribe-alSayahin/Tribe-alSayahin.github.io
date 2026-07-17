import { BadgeCheck, Check } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES: Record<NonNullable<VerifiedBadgeProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const ICON_CLASSES: Record<NonNullable<VerifiedBadgeProps['size']>, string> = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3.5 w-3.5',
  lg: 'h-5 w-5',
};

export function VerifiedBadge({ size = 'md' }: VerifiedBadgeProps) {
  return (
    <span
      aria-label="موثق"
      title="موثق"
      className={`relative inline-flex shrink-0 items-center justify-center drop-shadow-sm ${SIZE_CLASSES[size]}`}
    >
      <BadgeCheck className="absolute inset-0 h-full w-full fill-azure text-azure" strokeWidth={1.5} aria-hidden="true" />
      <Check className={`relative z-10 text-white ${ICON_CLASSES[size]}`} strokeWidth={3.5} aria-hidden="true" />
    </span>
  );
}
