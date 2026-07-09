import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  // Base classes with accessible focus ring and smooth transitions
  const baseClasses = 'relative isolate overflow-hidden inline-flex items-center justify-center font-kufi font-medium rounded-xl transition-all duration-base ease-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 disabled:pointer-events-none cursor-pointer group';

  // Variants mapping
  const variantClasses = {
    primary: 'bg-gradient-to-b from-brass-lt to-brass text-ink font-bold ring-1 ring-inset ring-sand/30 shadow-glow-sm hover:shadow-glow-md hover:brightness-105 hover:-translate-y-0.5 active:scale-95',
    secondary: 'border border-brass/40 bg-brass/5 hover:bg-brass/12 text-brass-lt hover:border-brass/70 hover:-translate-y-0.5',
    ghost: 'bg-transparent text-sand hover:bg-brass/10 hover:text-brass-lt',
  };

  // Sizes mapping using our unified spacing scale
  const sizeClasses = {
    sm: 'text-xs py-space-1.5 px-space-4 gap-space-1.5',
    md: 'text-sm py-space-2 px-space-6 gap-space-2',
    lg: 'text-base py-space-3 px-space-8 gap-space-3',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {variant === 'primary' && (
        <span
          className="pointer-events-none absolute inset-y-0 -inset-x-full -z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-brand group-hover:translate-x-[200%]"
          aria-hidden="true"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-[inherit]">{children}</span>
    </button>
  );
};
