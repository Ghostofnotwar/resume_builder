import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon, IconName } from './Icon';
import { cn } from '../../utils';

/* ─────────────── Button ─────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger' | 'dark';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName | string;
  iconRight?: IconName | string;
  loading?: boolean;
  full?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-[0_1px_2px_rgba(49,46,129,.4),0_8px_20px_-8px_rgba(79,70,229,.7)] hover:from-brand-400 hover:to-brand-500 active:from-brand-600 active:to-brand-600',
  secondary:
    'border border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-2 active:bg-surface-3',
  ghost: 'text-ink-soft hover:bg-surface-2 hover:text-ink',
  soft: 'bg-brand-500/10 text-brand-600 hover:bg-brand-500/15 dark:text-brand-300',
  danger: 'border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300',
  dark: 'bg-ink text-app hover:opacity-90',
};

const SIZES: Record<ButtonSize, string> = {
  xs: 'h-7 gap-1 rounded-lg px-2 text-[11.5px]',
  sm: 'h-8 gap-1.5 rounded-lg px-2.5 text-[12.5px]',
  md: 'h-9 gap-2 rounded-xl px-3.5 text-[13px]',
  lg: 'h-11 gap-2 rounded-xl px-5 text-sm',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  loading,
  full,
  className,
  children,
  disabled,
  ...rest
}) => (
  <button
    className={cn(
      'inline-flex select-none items-center justify-center font-semibold transition-all duration-150',
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20',
      'disabled:cursor-not-allowed disabled:opacity-50',
      VARIANTS[variant],
      SIZES[size],
      full && 'w-full',
      className
    )}
    disabled={disabled || loading}
    {...rest}
  >
    {loading ? (
      <Icon name="refresh" size={14} className="animate-spin" />
    ) : (
      icon && <Icon name={icon} size={size === 'xs' ? 12 : size === 'lg' ? 17 : 14} />
    )}
    {children}
    {iconRight && !loading && <Icon name={iconRight} size={14} />}
  </button>
);

/* ─────────────── IconButton ─────────────── */

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: IconName | string;
  size?: number;
  label: string;
  tone?: 'default' | 'danger';
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 16,
  label,
  tone = 'default',
  className,
  ...rest
}) => (
  <button
    title={label}
    aria-label={label}
    className={cn(
      'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition',
      tone === 'danger'
        ? 'text-ink-faint hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10'
        : 'text-ink-mute hover:bg-surface-2 hover:text-ink',
      'disabled:cursor-not-allowed disabled:opacity-40',
      className
    )}
    {...rest}
  >
    <Icon name={name} size={size} />
  </button>
);

/* ─────────────── Fields ─────────────── */

export const Field: React.FC<{
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ label, hint, error, htmlFor, className, children, action }) => (
  <div className={cn('min-w-0', className)}>
    {(label || action) && (
      <div className="mb-1 flex items-center justify-between gap-2">
        {label && (
          <label htmlFor={htmlFor} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
            {label}
          </label>
        )}
        {action}
      </div>
    )}
    {children}
    {error ? (
      <p className="mt-1 text-[11.5px] text-rose-500">{error}</p>
    ) : (
      hint && <p className="mt-1 text-[11.5px] leading-snug text-ink-faint">{hint}</p>
    )}
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => <input ref={ref} className={cn('field', className)} {...rest} />
);
Input.displayName = 'Input';

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...rest }, ref) => (
    <textarea ref={ref} className={cn('field resize-none leading-relaxed', className)} {...rest} />
  )
);
TextArea.displayName = 'TextArea';

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, children, ...rest }) => (
  <select className={cn('field cursor-pointer appearance-none bg-no-repeat pr-8', className)} {...rest}
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23767a8f' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      backgroundPosition: 'right 10px center',
      backgroundSize: '14px',
    }}
  >
    {children}
  </select>
);

/* ─────────────── Toggle ─────────────── */

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, description, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cn(
      'group flex w-full items-start justify-between gap-3 rounded-xl px-1 py-1.5 text-left transition',
      disabled && 'cursor-not-allowed opacity-50'
    )}
  >
    <span className="min-w-0">
      {label && <span className="block text-[13px] font-medium text-ink">{label}</span>}
      {description && <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-mute">{description}</span>}
    </span>
    <span
      className={cn(
        'relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors',
        checked ? 'bg-brand-500' : 'bg-line-strong group-hover:bg-ink-faint'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
          checked ? 'left-[18px]' : 'left-0.5'
        )}
      />
    </span>
  </button>
);

/* ─────────────── Segmented ─────────────── */

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = 'md',
  className,
}: {
  value: T;
  options: { value: T; label: string; icon?: IconName | string }[];
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <div className={cn('inline-flex gap-0.5 rounded-xl bg-surface-2 p-0.5', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'inline-flex flex-1 items-center justify-center gap-1.5 rounded-[10px] font-semibold transition-all',
            size === 'sm' ? 'h-7 px-2 text-[11.5px]' : 'h-8 px-3 text-[12.5px]',
            value === option.value
              ? 'bg-surface text-ink shadow-sm'
              : 'text-ink-mute hover:text-ink'
          )}
        >
          {option.icon && <Icon name={option.icon} size={13} />}
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────── Badge / Chip ─────────────── */

export const Badge: React.FC<{
  children: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'good' | 'warn' | 'bad';
  className?: string;
}> = ({ children, tone = 'neutral', className }) => {
  const tones = {
    neutral: 'border-line bg-surface-2 text-ink-mute',
    brand: 'border-transparent bg-brand-500/10 text-brand-600 dark:text-brand-300',
    good: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warn: 'border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400',
    bad: 'border-transparent bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
};

/* ─────────────── Modal ─────────────── */

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}> = ({ open, onClose, title, subtitle, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative my-auto w-full animate-pop-in overflow-hidden rounded-3xl border border-line bg-surface shadow-float',
          widths[size]
        )}
        role="dialog"
        aria-modal="true"
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              {title && <h2 className="font-display text-lg font-bold tracking-tight text-ink">{title}</h2>}
              {subtitle && <p className="mt-0.5 text-[12.5px] leading-snug text-ink-mute">{subtitle}</p>}
            </div>
            <IconButton name="x" label="Закрыть" onClick={onClose} />
          </div>
        )}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-line bg-surface-2 px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

/* ─────────────── Progress ring ─────────────── */

export const ProgressRing: React.FC<{
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  tone?: string;
}> = ({ value, size = 34, stroke = 3, label, tone = '#6366F1' }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-line" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tone}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset .5s cubic-bezier(.2,.8,.2,1)' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink">
          {Math.round(clamped)}
        </span>
      </div>
      {label && <span className="text-[11.5px] font-medium text-ink-mute">{label}</span>}
    </div>
  );
};

/* ─────────────── Empty state ─────────────── */

export const EmptyState: React.FC<{
  icon?: IconName | string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon = 'file', title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-4 py-8 text-center">
    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-2 text-ink-faint">
      <Icon name={icon} size={18} />
    </span>
    <p className="text-[13px] font-semibold text-ink-soft">{title}</p>
    {description && <p className="mt-1 max-w-[260px] text-[11.5px] leading-snug text-ink-faint">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

/* ─────────────── Collapsible card ─────────────── */

export const CollapseCard: React.FC<{
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  icon?: IconName | string;
}> = ({ title, subtitle, open, onToggle, actions, children, icon }) => (
  <div
    className={cn(
      'group overflow-hidden rounded-2xl border bg-surface transition-all',
      open ? 'border-line-strong shadow-panel' : 'border-line hover:border-line-strong'
    )}
  >
    <div className="flex items-center gap-2 px-3 py-2.5">
      {icon && (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-mute">
          <Icon name={icon} size={14} />
        </span>
      )}
      <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
        <p className="truncate text-[13px] font-semibold text-ink">{title || 'Без названия'}</p>
        {subtitle && <p className="truncate text-[11.5px] text-ink-mute">{subtitle}</p>}
      </button>
      <div className="flex shrink-0 items-center gap-0.5">
        {actions}
        <IconButton
          name={open ? 'chevron-up' : 'chevron-down'}
          label={open ? 'Свернуть' : 'Развернуть'}
          onClick={onToggle}
        />
      </div>
    </div>
    {open && <div className="border-t border-line bg-surface-2 px-3 py-3 animate-fade-in">{children}</div>}
  </div>
);
