import React from 'react';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils';

export const Group: React.FC<{
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tone?: 'default' | 'brand';
}> = ({ title, description, action, children, className, tone = 'default' }) => (
  <section
    className={cn(
      'rounded-2xl border p-3.5',
      tone === 'brand' ? 'border-brand-500/20 bg-brand-500/[0.04]' : 'border-line bg-surface',
      className
    )}
  >
    {(title || action) && (
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div>
          {title && <h3 className="text-[12.5px] font-bold text-ink">{title}</h3>}
          {description && <p className="mt-0.5 text-[11.5px] leading-snug text-ink-mute">{description}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </section>
);

export const Grid2: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('grid grid-cols-2 gap-2.5', className)}>{children}</div>
);

export const InlineActions: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('flex items-center gap-1', className)}>{children}</div>
);

export const AiChip: React.FC<{
  onClick: () => void;
  loading?: boolean;
  label: string;
  disabled?: boolean;
  title?: string;
}> = ({ onClick, loading, label, disabled, title }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    title={title}
    className={cn(
      'inline-flex h-7 items-center gap-1.5 rounded-lg border border-brand-500/20 bg-brand-500/[0.08] px-2 text-[11.5px] font-semibold text-brand-600 transition',
      'hover:border-brand-500/40 hover:bg-brand-500/15 disabled:cursor-not-allowed disabled:opacity-50',
      'dark:text-brand-300'
    )}
  >
    <Icon name={loading ? 'refresh' : 'sparkles'} size={12} className={loading ? 'animate-spin' : undefined} />
    {label}
  </button>
);

export const AddButton: React.FC<{ onClick: () => void; label: string; icon?: string }> = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-7 items-center gap-1 rounded-lg bg-brand-500/10 px-2.5 text-[11.5px] font-semibold text-brand-600 transition hover:bg-brand-500/20 dark:text-brand-300"
  >
    <Icon name="plus" size={12} strokeWidth={2.4} />
    {label}
  </button>
);

export const Counter: React.FC<{ value: number; min?: number; max?: number }> = ({ value, min = 0, max = 900 }) => {
  const tone = value > max ? 'text-amber-500' : value < min ? 'text-ink-faint' : 'text-emerald-500';
  return (
    <span className={cn('text-[11px] font-medium tabular-nums', tone)}>
      {value} / {max}
    </span>
  );
};

export const TipRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-start gap-2 rounded-xl bg-surface-2 px-2.5 py-2 text-[11.5px] leading-snug text-ink-mute">
    <Icon name="info" size={13} className="mt-0.5 shrink-0 text-brand-400" />
    <span>{children}</span>
  </div>
);
