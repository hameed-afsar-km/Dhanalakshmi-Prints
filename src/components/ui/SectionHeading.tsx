import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  action,
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        <span
          className={cn(
            'inline-flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.22em]',
            light ? 'text-white/60' : 'text-brand-primary/60'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
          {eyebrow}
        </span>
        <h2
          className={cn(
            'mt-3.5 font-nechlas text-[clamp(2.2rem,5vw,3.8rem)] uppercase leading-[0.94] tracking-[0.02em]',
            light ? 'text-white' : 'text-brand-navy'
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'mt-3.5 max-w-xl font-sans text-sm leading-relaxed',
              align === 'center' && 'mx-auto',
              light ? 'text-white/70' : 'text-brand-navy/65'
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
