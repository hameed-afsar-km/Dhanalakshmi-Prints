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
        'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center sm:text-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        <span
          className={cn(
            'inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.2em]',
            light ? 'text-white/65' : 'text-brand-primary/65'
          )}
        >
          <span className="h-2 w-2 rounded-full bg-brand-pink" />
          {eyebrow}
        </span>
        <h2
          className={cn(
            'mt-2.5 font-heading text-[clamp(1.75rem,4.5vw,3.4rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.025em]',
            light ? 'text-white' : 'text-brand-navy'
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'mt-2.5 max-w-xl font-sans text-[13px] leading-[1.65] sm:text-sm sm:leading-relaxed',
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
