import React, { useEffect } from 'react';
import { create } from 'zustand';
import { Icon } from './Icon';
import { cn } from '../../utils';

type Tone = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  tone: Tone;
}

interface ToastStore {
  items: ToastItem[];
  push: (item: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  items: [],
  push: (item) =>
    set((s) => ({
      items: [...s.items.slice(-3), { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }],
    })),
  dismiss: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));

export function toast(title: string, options: { description?: string; tone?: Tone } = {}): void {
  useToastStore.getState().push({
    title,
    description: options.description,
    tone: options.tone ?? 'success',
  });
}

const TONE_STYLES: Record<Tone, { icon: 'check' | 'alert' | 'info'; className: string }> = {
  success: { icon: 'check', className: 'text-emerald-500' },
  error: { icon: 'alert', className: 'text-rose-500' },
  info: { icon: 'info', className: 'text-brand-500' },
};

const ToastRow: React.FC<{ item: ToastItem }> = ({ item }) => {
  const dismiss = useToastStore((s) => s.dismiss);
  useEffect(() => {
    const timer = setTimeout(() => dismiss(item.id), 4200);
    return () => clearTimeout(timer);
  }, [item.id, dismiss]);

  const tone = TONE_STYLES[item.tone];
  return (
    <div
      className="pointer-events-auto flex w-[340px] items-start gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-float animate-slide-up"
      role="status"
    >
      <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2', tone.className)}>
        <Icon name={tone.icon} size={14} strokeWidth={2.4} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-ink">{item.title}</p>
        {item.description && <p className="mt-0.5 text-[12px] leading-snug text-ink-mute">{item.description}</p>}
      </div>
      <button
        onClick={() => dismiss(item.id)}
        className="rounded-md p-1 text-ink-faint transition hover:bg-surface-2 hover:text-ink"
        aria-label="Закрыть"
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
};

export const ToastHost: React.FC = () => {
  const items = useToastStore((s) => s.items);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {items.map((item) => (
        <ToastRow key={item.id} item={item} />
      ))}
    </div>
  );
};
