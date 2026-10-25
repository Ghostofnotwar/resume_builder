import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { ResumePreview } from '../ResumePreview';
import { useResumeStore } from '../../store/resumeStore';
import { TEMPLATES } from '../../constants';
import { Icon } from '../ui/Icon';
import { IconButton } from '../ui';
import { cn } from '../../utils';
import { ExportMenu } from '../ExportMenu';

interface Props {
  captureRef: RefObject<HTMLDivElement>;
  onOpenTemplates: () => void;
}

export const PreviewPane: React.FC<Props> = ({ captureRef, onOpenTemplates }) => {
  const config = useResumeStore((s) => s.config);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const template = TEMPLATES.find((item) => item.id === config.templateId) ?? TEMPLATES[0];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.7);
  const [autoFit, setAutoFit] = useState(true);
  const [pages, setPages] = useState(1);

  const fit = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const available = el.clientWidth - (el.clientWidth < 720 ? 32 : 96);
    setZoom(Math.min(1.05, Math.max(0.3, available / 794)));
  }, []);

  useEffect(() => {
    if (!autoFit) return;
    fit();
    const observer = new ResizeObserver(fit);
    if (scrollRef.current) observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [autoFit, fit]);

  const handlePages = useCallback((count: number) => setPages(count), []);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line bg-surface px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2 py-1 text-[11px] font-semibold text-ink-soft">
            <Icon name="layout" size={12} />
            A4
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2 py-1 text-[11px] font-semibold text-ink-soft">
            <Icon name="file" size={12} />
            {pages} {pages === 1 ? 'страница' : pages < 5 ? 'страницы' : 'страниц'}
          </span>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <div className="mx-1 h-5 w-px bg-line" />
          <div className="flex max-w-[46vw] items-center gap-1 overflow-x-auto">
            {TEMPLATES.map((item) => (
              <button
                key={item.id}
                onClick={() => setTemplate(item.id)}
                title={item.description}
                className={cn(
                  'whitespace-nowrap rounded-lg px-2 py-1 text-[11px] font-semibold transition',
                  config.templateId === item.id
                    ? 'bg-brand-500/12 text-brand-600 dark:text-brand-300'
                    : 'text-ink-mute hover:bg-surface-2 hover:text-ink'
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
          <IconButton name="sliders" label="Настройки дизайна" onClick={onOpenTemplates} />
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-0.5 rounded-xl bg-surface-2 p-0.5">
          <IconButton name="zoom-out" label="Уменьшить" onClick={() => { setAutoFit(false); setZoom((value) => Math.max(0.3, +(value - 0.05).toFixed(2))); }} />
          <button
            onClick={() => setAutoFit(true)}
            className="min-w-[42px] rounded-lg px-1 py-1 text-[11px] font-bold tabular-nums text-ink-soft transition hover:text-ink"
            title="По размеру окна"
          >
            {Math.round(zoom * 100)}%
          </button>
          <IconButton name="zoom-in" label="Увеличить" onClick={() => { setAutoFit(false); setZoom((value) => Math.min(1.3, +(value + 0.05).toFixed(2))); }} />
          <IconButton name="maximize" label="Вписать в окно" onClick={() => setAutoFit(true)} />
        </div>

        <div className="hidden sm:block">
          <ExportMenu captureRef={captureRef} />
        </div>
      </div>

      {/* canvas */}
      <div ref={scrollRef} className="preview-bg relative min-h-0 flex-1 overflow-auto">
        <div className="flex min-h-full w-full items-start justify-center px-4 py-6 sm:px-8 sm:py-8">
          <div className="animate-float-in">
            <ResumePreview ref={captureRef} scale={zoom} onPagesChange={handlePages} />
            <div className="mt-4 flex items-center justify-between text-[10.5px] font-medium text-ink-mute">
              <span>
                {template.name} · {Math.round(zoom * 100)}%
              </span>
              <span className="tabular-nums">794 × 1123 px · 96 dpi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
