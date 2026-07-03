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
  const baseClasses = 'inline-flex items-center justify-center font-kufi font-medium rounded-full transition-all duration-base ease-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  // Variants mapping
  const variantClasses = {
    primary: 'bg-brass hover:bg-brass-lt text-ink font-bold shadow-glow-sm hover:shadow-glow-md active:scale-95',
    secondary: 'border border-brass/30 bg-brass/5 hover:bg-brass/10 text-brass-lt hover:border-brass/60',
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
      {children}
    </button>
  );
};
