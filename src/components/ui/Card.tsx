import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverGlow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverGlow = true,
  ...props
}) => {
  const baseClasses = 'bg-ink-2/60 border border-brass/15 rounded-2xl p-space-6 transition-all duration-base ease-brand text-right';
  const glowClasses = hoverGlow ? 'shadow-glow-sm hover:shadow-glow-md hover:border-brass/40 hover:-translate-y-0.5' : '';
  
  return (
    <div className={`${baseClasses} ${glowClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-space-1.5 mb-space-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3 className={`text-lg font-serif text-sand font-bold tracking-wide ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p className={`text-xs text-sand-dim font-sans leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`text-sm text-sand-dim leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  );
};
