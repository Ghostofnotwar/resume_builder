import React, { useMemo, useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Button, EmptyState, IconButton, Input } from '../ui';
import { Group, TipRow } from './FormKit';
import { skillSuggestions } from '../../lib/ai/suggest';
import { cn } from '../../utils';
import { toast } from '../ui/Toast';

const LEVELS = ['', 'Базовый', 'Начальный', 'Средний', 'Продвинутый', 'Эксперт'];

export const SkillsForm: React.FC = () => {
  const skills = useResumeStore((s) => s.data.skills);
  const jobTitle = useResumeStore((s) => s.data.personal.jobTitle);
  const addSkillsBulk = useResumeStore((s) => s.addSkillsBulk);
  const updateSkill = useResumeStore((s) => s.updateSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);
  const moveSkill = useResumeStore((s) => s.moveSkill);
  const [draft, setDraft] = useState('');

  const suggestions = useMemo(() => {
    const existing = new Set(skills.map((skill) => skill.name.toLowerCase()));
    return skillSuggestions(jobTitle)
      .filter((name) => !existing.has(name.toLowerCase()))
      .slice(0, 10);
  }, [jobTitle, skills]);

  const addFromDraft = () => {
    const names = draft
      .split(/[,;\n]+/)
      .map((name) => name.trim())
      .filter(Boolean);
    if (!names.length) return;
    addSkillsBulk(names);
    setDraft('');
    toast(`Добавлено: ${names.length}`, { description: 'Уровень можно настроить точками.' });
  };

  return (
    <div className="space-y-3">
      <Group
        title="Добавить навыки"
        description="Через запятую — можно вставить целый список из вакансии."
        tone="brand"
      >
        <div className="flex items-center gap-1.5">
          <Input
            value={draft}
            placeholder="React, TypeScript, Figma..."
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addFromDraft();
              }
            }}
          />
          <Button variant="primary" size="md" icon="plus" onClick={addFromDraft}>
            Добавить
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-2.5">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
              Подходящие под «{jobTitle || 'вашу роль'}»
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((name) => (
                <button
                  key={name}
                  onClick={() => addSkillsBulk([name])}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-500/25 bg-brand-500/[0.06] px-2.5 py-1 text-[11.5px] font-medium text-brand-600 transition hover:bg-brand-500/15 dark:text-brand-300"
                >
                  <span className="text-[13px] leading-none">+</span>
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </Group>

      {!skills.length ? (
        <EmptyState
          icon="zap"
          title="Навыков пока нет"
          description="6–12 навыков — оптимум. Ставьте вперёд те, что важны в вакансии."
        />
      ) : (
        <div className="space-y-1.5">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className="group flex items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 py-1.5"
            >
              <span className="w-4 shrink-0 text-center text-[10px] font-semibold tabular-nums text-ink-faint">
                {index + 1}
              </span>
              <Input
                className="field-sm min-w-0 flex-1 border-transparent bg-transparent px-1.5 hover:border-line"
                value={skill.name}
                placeholder="Название навыка"
                onChange={(event) => updateSkill(skill.id, { name: event.target.value })}
              />
              <div className="flex shrink-0 items-center gap-1" title={LEVELS[skill.level]}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateSkill(skill.id, { level })}
                    className={cn(
                      'h-3 w-3 rounded-full transition',
                      level <= skill.level ? 'bg-brand-500' : 'bg-line-strong hover:bg-brand-300'
                    )}
                    aria-label={`Уровень ${level}`}
                  />
                ))}
              </div>
              <div className="flex shrink-0 items-center opacity-0 transition group-hover:opacity-100">
                <IconButton name="arrow-up" label="Выше" size={13} disabled={index === 0} onClick={() => moveSkill(skill.id, -1)} />
                <IconButton
                  name="arrow-down"
                  label="Ниже"
                  size={13}
                  disabled={index === skills.length - 1}
                  onClick={() => moveSkill(skill.id, 1)}
                />
                <IconButton name="x" label="Удалить" size={13} tone="danger" onClick={() => removeSkill(skill.id)} />
              </div>
            </div>
          ))}
          <TipRow>
            Уровни отображаются полосками в шаблонах. Для ATS-версии их можно отключить в разделе «Дизайн».
          </TipRow>
        </div>
      )}
    </div>
  );
};
