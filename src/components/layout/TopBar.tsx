import React, { RefObject, useMemo } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { analyzeResume } from '../../lib/ai/quality';
import { Icon } from '../ui/Icon';
import { IconButton, ProgressRing } from '../ui';
import { ExportMenu } from '../ExportMenu';
import { cn } from '../../utils';

export type ViewMode = 'edit' | 'split' | 'preview';

interface Props {
  viewMode: ViewMode;
  onViewMode: (mode: ViewMode) => void;
  theme: 'light' | 'dark';
  onTheme: () => void;
  captureRef: RefObject<HTMLDivElement>;
  onNavigate: (tab: 'quality') => void;
  onSave: () => void;
}

export const TopBar: React.FC<Props> = ({ viewMode, onViewMode, theme, onTheme, captureRef, onNavigate, onSave }) => {
  const docName = useResumeStore((s) => s.docName);
  const setDocName = useResumeStore((s) => s.setDocName);
  const data = useResumeStore((s) => s.data);
  const past = useResumeStore((s) => s.past);
  const future = useResumeStore((s) => s.future);
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const saveToLibrary = useResumeStore((s) => s.saveToLibrary);

  const score = useMemo(() => analyzeResume(data).score, [data]);

  return (
    <header className="z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface px-3 backdrop-blur-xl sm:px-4">
      {/* brand */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-fuchsia-600 shadow-[0_6px_18px_-8px_rgba(99,102,241,.9)]">
          <Icon name="file" size={17} className="text-white" strokeWidth={1.9} />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-surface">
            <Icon name="check" size={7} className="text-white" strokeWidth={4} />
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="font-display text-[13.5px] font-extrabold leading-tight tracking-tight text-ink">Resume Studio</p>
          <p className="text-[10px] leading-tight text-ink-faint">умный конструктор резюме</p>
        </div>
      </div>

      <div className="mx-1 hidden h-7 w-px bg-line md:block" />

      {/* doc name */}
      <div className="hidden min-w-0 flex-col md:flex">
        <input
          value={docName}
          onChange={(event) => setDocName(event.target.value)}
          onBlur={() => undefined}
          className="w-[190px] truncate rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12.5px] font-semibold text-ink outline-none transition hover:border-line focus:border-brand-400 focus:bg-surface-2"
          aria-label="Название документа"
        />
        <span className="flex items-center gap-1 px-1 text-[10px] text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          сохранено локально
        </span>
      </div>

      <div className="flex-1" />

      {/* view switch */}
      <div className="hidden items-center gap-0.5 rounded-xl bg-surface-2 p-0.5 md:flex">
        {(
          [
            { id: 'edit', label: 'Форма', icon: 'edit' },
            { id: 'split', label: 'Сплит', icon: 'layout' },
            { id: 'preview', label: 'Превью', icon: 'eye' },
          ] as { id: ViewMode; label: string; icon: string }[]
        ).map((mode) => (
          <button
            key={mode.id}
            onClick={() => onViewMode(mode.id)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-[10px] px-2.5 text-[12px] font-semibold transition',
              viewMode === mode.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-mute hover:text-ink'
            )}
            title={mode.label}
          >
            <Icon name={mode.icon} size={14} />
            <span className="hidden xl:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      <div className="mx-1 hidden h-7 w-px bg-line sm:block" />

      <button
        onClick={() => onNavigate('quality')}
        className="hidden items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-surface-2 sm:flex"
        title="Открыть проверку резюме"
      >
        <ProgressRing value={score} size={30} stroke={3} tone={score >= 80 ? '#10B981' : score >= 55 ? '#F59E0B' : '#F43F5E'} />
        <div className="text-left">
          <p className="text-[11px] font-bold leading-tight text-ink">{score}/100</p>
          <p className="text-[9.5px] leading-tight text-ink-faint">качество</p>
        </div>
      </button>

      <div className="flex items-center gap-0.5">
        <IconButton name="undo" label="Отменить (Ctrl+Z)" onClick={undo} disabled={!past.length} />
        <IconButton name="redo" label="Повторить (Ctrl+Shift+Z)" onClick={redo} disabled={!future.length} />
        <IconButton name={theme === 'dark' ? 'sun' : 'moon'} label="Сменить тему" onClick={onTheme} />
        <IconButton
          name="save"
          label="Сохранить версию в библиотеку"
          onClick={() => {
            saveToLibrary();
            onSave();
          }}
        />
      </div>

      <ExportMenu captureRef={captureRef} />
    </header>
  );
};
