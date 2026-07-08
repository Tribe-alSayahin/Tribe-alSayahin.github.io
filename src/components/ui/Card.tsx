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
  const baseClasses = 'group relative bg-gradient-to-b from-coffee/70 to-ink-2/50 border border-brass/15 rounded-2xl p-space-6 transition-all duration-base ease-brand text-right';
  const glowClasses = hoverGlow ? 'shadow-glow-sm hover:shadow-glow-md hover:border-brass/45 hover:-translate-y-1' : '';

  return (
    <div className={`${baseClasses} ${glowClasses} ${className}`} {...props}>
      {hoverGlow && (
        <>
          {/* Decorative brass corner brackets, revealed on hover */}
          <span
            className="absolute top-2 right-2 w-4 h-4 border-t border-r border-brass/60 rounded-tr-md opacity-0 -translate-y-1 translate-x-1 transition-all duration-base ease-brand group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-brass/60 rounded-bl-md opacity-0 translate-y-1 -translate-x-1 transition-all duration-base ease-brand group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}
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
