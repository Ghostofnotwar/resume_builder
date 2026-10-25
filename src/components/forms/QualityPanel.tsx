import React, { useMemo } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useAiStore } from '../../store/aiStore';
import { analyzeResume, scoreLabel } from '../../lib/ai/quality';
import { TextArea } from '../ui';
import { Group, TipRow } from './FormKit';
import { Icon } from '../ui/Icon';
import { toast } from '../ui/Toast';
import { cn } from '../../utils';

const STATUS_META = {
  pass: { icon: 'check', className: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400' },
  warn: { icon: 'alert', className: 'bg-amber-500/12 text-amber-600 dark:text-amber-400' },
  fail: { icon: 'x', className: 'bg-rose-500/12 text-rose-600 dark:text-rose-400' },
} as const;

export const QualityPanel: React.FC = () => {
  const data = useResumeStore((s) => s.data);
  const addSkillsBulk = useResumeStore((s) => s.addSkillsBulk);
  const vacancy = useAiStore((s) => s.vacancy);
  const setVacancy = useAiStore((s) => s.setVacancy);

  const report = useMemo(() => analyzeResume(data, vacancy), [data, vacancy]);
  const label = scoreLabel(report.score);
  const tone = label.tone === 'good' ? '#10B981' : label.tone === 'ok' ? '#F59E0B' : '#F43F5E';

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (report.score / 100) * circumference;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
        <div className="relative h-[96px] w-[96px] shrink-0">
          <svg width="96" height="96" className="-rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="7" className="text-surface-3" />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke={tone}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-extrabold leading-none text-ink">{report.score}</span>
            <span className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-ink-faint">из 100</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold" style={{ color: tone }}>
            {label.label}
          </p>
          <p className="mt-1 text-[11.5px] leading-snug text-ink-mute">
            {report.score >= 80
              ? 'Резюме готово к отправке. Проверьте ключевые слова под конкретную вакансию.'
              : 'Исправьте подсвеченные пункты — это заметно повышает отклик.'}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="chip">{report.wordCount} слов</span>
            <span className="chip">
              {report.checks.filter((check) => check.status === 'pass').length}/{report.checks.length} пунктов ок
            </span>
          </div>
        </div>
      </div>

      <Group title="Вакансия для сверки" description="Вставьте текст вакансии — покажем недостающие ключевые слова.">
        <TextArea
          rows={4}
          value={vacancy}
          onChange={(event) => setVacancy(event.target.value)}
          placeholder="Требования: React, TypeScript, опыт с дизайн-системами, A/B-тесты..."
        />
        {!vacancy.trim() && <TipRow>Без вакансии проверяем структуру, метрики и контакты.</TipRow>}
      </Group>

      {report.hasVacancy && (
        <div className="rounded-2xl border border-line bg-surface p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[12.5px] font-bold text-ink">Ключевые слова</h3>
            <span className="text-[11px] text-ink-faint">
              {report.matchedKeywords.length} из {report.matchedKeywords.length + report.missingKeywords.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {report.matchedKeywords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Icon name="check" size={10} strokeWidth={3} />
                {word}
              </span>
            ))}
            {report.missingKeywords.map((word) => (
              <button
                key={word}
                onClick={() => {
                  addSkillsBulk([word]);
                  toast(`«${word}» добавлено в навыки`, { tone: 'info' });
                }}
                title="Добавить в навыки"
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-amber-500/40 bg-amber-500/[0.07] px-2 py-0.5 text-[11px] font-medium text-amber-600 transition hover:bg-amber-500/15 dark:text-amber-400"
              >
                <Icon name="plus" size={10} strokeWidth={3} />
                {word}
              </button>
            ))}
            {!report.missingKeywords.length && <span className="text-[11.5px] text-ink-mute">Все ключевые слова учтены 👌</span>}
          </div>
          <p className="mt-2 text-[10.5px] leading-snug text-ink-faint">
            Нажмите на пропущенное слово, чтобы добавить его в навыки. Используйте только те, которыми действительно владеете.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        {report.checks.map((check) => {
          const meta = STATUS_META[check.status];
          return (
            <div key={check.id} className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
              <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full', meta.className)}>
                <Icon name={meta.icon} size={11} strokeWidth={3} />
              </span>
              <div className="min-w-0">
                <p className={cn('text-[12.5px] font-semibold', check.status === 'pass' ? 'text-ink' : 'text-ink')}>
                  {check.label}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-ink-mute">{check.hint}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
