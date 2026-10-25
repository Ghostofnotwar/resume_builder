import React, { useMemo } from 'react';
import { EditorTab } from '../../types';
import { NAV_GROUPS, tabMeta } from '../navigation';
import { Icon } from '../ui/Icon';
import { ProgressRing } from '../ui';
import { useResumeStore } from '../../store/resumeStore';
import { analyzeResume, scoreLabel } from '../../lib/ai/quality';
import { cn } from '../../utils';

interface Props {
  activeTab: EditorTab;
  onTab: (tab: EditorTab) => void;
}

export const SideRail: React.FC<Props> = ({ activeTab, onTab }) => {
  const data = useResumeStore((s) => s.data);
  const report = useMemo(() => analyzeResume(data), [data]);
  const label = scoreLabel(report.score);
  const tone = label.tone === 'good' ? '#10B981' : label.tone === 'ok' ? '#F59E0B' : '#F43F5E';

  return (
    <aside className="hidden w-[224px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((id) => {
                const meta = tabMeta(id);
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => onTab(id)}
                    className={cn('nav-item', active && 'nav-item-active')}
                  >
                    <Icon name={meta.icon} size={16} />
                    <span className="truncate">{meta.label}</span>
                    {id === 'ai' && (
                      <span className="ml-auto rounded-full bg-brand-500/12 px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                        new
                      </span>
                    )}
                    {id === 'quality' && (
                      <span className="ml-auto text-[10.5px] font-bold tabular-nums" style={{ color: tone }}>
                        {report.score}
                      </span>
                    )}
                    {active && (
                      <span className="absolute -left-2.5 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-2.5">
        <button
          onClick={() => onTab('quality')}
          className="w-full rounded-2xl border border-line bg-surface-2 p-2.5 text-left transition hover:border-brand-300 hover:bg-brand-500/[0.04]"
        >
          <div className="flex items-center gap-2.5">
            <ProgressRing value={report.score} size={38} stroke={3.5} tone={tone} />
            <div className="min-w-0">
              <p className="text-[11.5px] font-bold text-ink">Готовность</p>
              <p className="truncate text-[10.5px] text-ink-mute" style={{ color: tone }}>
                {label.label}
              </p>
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[10.5px] font-semibold text-ink-mute">
            Проверить резюме
            <Icon name="arrow-right" size={11} />
          </p>
        </button>
      </div>
    </aside>
  );
};
