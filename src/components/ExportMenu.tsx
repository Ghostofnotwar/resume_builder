import React, { RefObject, useEffect, useRef, useState } from 'react';
import { useResumeExport } from '../hooks/useResumeExport';
import { useResumeStore } from '../store/resumeStore';
import { exportResumeJson, exportMarkdown } from '../lib/export';
import { Icon, IconName } from './ui/Icon';
import { cn } from '../utils';
import { toast } from './ui/Toast';

interface Props {
  captureRef: RefObject<HTMLDivElement>;
  variant?: 'full' | 'compact';
}

interface MenuAction {
  id: string;
  label: string;
  description: string;
  icon: IconName;
  action: () => void | Promise<void>;
  recommended?: boolean;
}

export const ExportMenu: React.FC<Props> = ({ captureRef, variant = 'full' }) => {
  const { pdf, png, print, busy } = useResumeExport(captureRef);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const actions: MenuAction[] = [
    {
      id: 'print',
      label: 'PDF с текстовым слоем',
      description: 'Открывается печать — выберите «Сохранить как PDF». Текст выделяется.',
      icon: 'print',
      action: print,
      recommended: true,
    },
    {
      id: 'pdf',
      label: 'PDF (изображение)',
      description: 'Точная копия вёрстки, A4, много страниц.',
      icon: 'download',
      action: pdf,
    },
    {
      id: 'png',
      label: 'PNG',
      description: 'Картинка высокого разрешения для портфолио.',
      icon: 'image',
      action: png,
    },
    {
      id: 'json',
      label: 'JSON — бэкап',
      description: 'Все данные и настройки для переноса.',
      icon: 'file',
      action: () => {
        const { data, config, docName } = useResumeStore.getState();
        exportResumeJson(data, config, docName);
        toast('JSON скачан');
      },
    },
    {
      id: 'md',
      label: 'Markdown',
      description: 'Для GitHub, Notion и hh.ru.',
      icon: 'clipboard',
      action: () => {
        exportMarkdown(useResumeStore.getState().data);
        toast('Markdown скачан');
      },
    },
  ];

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 font-semibold text-white shadow-[0_1px_2px_rgba(49,46,129,.4),0_8px_20px_-8px_rgba(79,70,229,.7)] transition hover:from-brand-400 hover:to-brand-500',
          variant === 'full' ? 'px-3.5 text-[13px]' : 'w-9 justify-center px-0'
        )}
      >
        <Icon name={busy ? 'refresh' : 'download'} size={15} className={busy ? 'animate-spin' : undefined} />
        {variant === 'full' && <span>Скачать</span>}
        {variant === 'full' && <Icon name="chevron-down" size={13} className={cn('transition', open && 'rotate-180')} />}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[320px] animate-pop-in overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
          <div className="border-b border-line px-3.5 py-2.5">
            <p className="text-[12px] font-bold text-ink">Экспорт резюме</p>
            <p className="text-[11px] text-ink-mute">Выберите формат — файл сохранится сразу</p>
          </div>
          <div className="p-1.5">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={async () => {
                  setOpen(false);
                  await action.action();
                }}
                className="flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-surface-2"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <Icon name={action.icon} size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-ink">{action.label}</span>
                    {action.recommended && (
                      <span className="rounded-full bg-emerald-500/12 px-1.5 py-[1px] text-[9.5px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                        советуем
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-ink-mute">{action.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
