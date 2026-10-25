import React, { useEffect, useRef, useState } from 'react';
import { EditorTab } from './types';
import { TopBar, ViewMode } from './components/layout/TopBar';
import { SideRail } from './components/layout/SideRail';
import { PreviewPane } from './components/layout/PreviewPane';
import { EditorPanel } from './components/EditorPanel';
import { PrintRoot } from './components/PrintRoot';
import { ToastHost, toast } from './components/ui/Toast';
import { Icon } from './components/ui/Icon';
import { useResumeStore } from './store/resumeStore';
import { useShortcuts } from './hooks/useShortcuts';
import { cn } from './utils';

const THEME_KEY = 'resume-studio-theme';

function initialTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const captureRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024 ? 'edit' : 'split'
  );
  const [tab, setTab] = useState<EditorTab>('personal');
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const saveToLibrary = useResumeStore((s) => s.saveToLibrary);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useShortcuts({
    onUndo: () => {
      undo();
      toast('Изменение отменено', { tone: 'info' });
    },
    onRedo: redo,
    onPrint: () => window.print(),
    onSave: () => {
      saveToLibrary();
      toast('Версия сохранена в библиотеку');
    },
  });

  const mobileItems: { id: ViewMode | 'ai' | 'quality'; label: string; icon: string }[] = [
    { id: 'edit', label: 'Форма', icon: 'edit' },
    { id: 'preview', label: 'Превью', icon: 'eye' },
    { id: 'ai', label: 'ИИ', icon: 'sparkles' },
    { id: 'quality', label: 'Проверка', icon: 'gauge' },
  ];

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-app text-ink">
      <TopBar
        viewMode={viewMode}
        onViewMode={setViewMode}
        theme={theme}
        onTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
        captureRef={captureRef}
        onNavigate={(target) => {
          setTab(target);
          setViewMode('edit');
        }}
        onSave={() => toast('Версия сохранена', { description: 'Открыть — раздел «Библиотека».' })}
      />

      <main className="flex min-h-0 flex-1 overflow-hidden">
        {viewMode !== 'preview' && <SideRail activeTab={tab} onTab={setTab} />}

        {viewMode !== 'preview' && (
          <div
            className={cn(
              'flex min-h-0 flex-col border-line',
              viewMode === 'split'
                ? 'w-full shrink-0 border-r lg:w-[404px] xl:w-[440px]'
                : 'min-w-0 flex-1'
            )}
          >
            <EditorPanel activeTab={tab} onTab={setTab} wide={viewMode === 'edit'} />
          </div>
        )}

        {viewMode !== 'edit' && (
          <div className={cn('min-h-0 min-w-0 flex-1', viewMode === 'split' && 'hidden lg:flex')}>
            <PreviewPane
              captureRef={captureRef}
              onOpenTemplates={() => {
                setTab('design');
                setViewMode((mode) => (mode === 'preview' ? 'split' : mode));
              }}
            />
          </div>
        )}
      </main>

      {/* mobile navigation */}
      <nav className="flex shrink-0 items-center justify-around border-t border-line bg-surface px-2 py-1.5 md:hidden">
        {mobileItems.map((item) => {
          const active =
            item.id === 'ai' || item.id === 'quality'
              ? tab === item.id && viewMode === 'edit'
              : viewMode === item.id && !(item.id === 'edit' && (tab === 'ai' || tab === 'quality'));
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'ai' || item.id === 'quality') {
                  setTab(item.id);
                  setViewMode('edit');
                } else {
                  setViewMode(item.id as ViewMode);
                }
              }}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold transition',
                active ? 'text-brand-600 dark:text-brand-300' : 'text-ink-mute'
              )}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <PrintRoot />
      <ToastHost />
    </div>
  );
}
