import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'brass' | 'muted';
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brass',
  showDot = true,
  className = '',
  ...props
}) => {
  // Base styling for badges with small Cairo/Kufi fonts
  const baseClasses = 'inline-flex items-center gap-space-1.5 px-space-2.5 py-space-0.5 rounded-full text-[10px] font-semibold font-kufi border transition-all duration-base ease-brand';

  const variantClasses = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.05)]',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.05)]',
    brass: 'bg-brass/10 text-brass-lt border-brass/20 shadow-[0_0_8px_rgba(212,175,55,0.05)]',
    muted: 'bg-white/5 text-sand-dim border-white/10',
  };

  const dotClasses = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    brass: 'bg-brass',
    muted: 'bg-sand-dim',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClasses[variant]}`} aria-hidden="true" />
      )}
      {children}
    </span>
  );
};
