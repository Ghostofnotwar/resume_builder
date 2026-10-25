import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useAiStore } from '../../store/aiStore';
import { Experience } from '../../types';
import { dateRange } from '../../utils';
import { CollapseCard, Field, IconButton, Input, TextArea, Button, EmptyState } from '../ui';
import { AiChip, AddButton, Grid2, TipRow } from './FormKit';
import { aiGenerateBullets, aiImproveText } from '../../lib/ai/llm';
import { improveBulletLocal, suggestBulletsFor } from '../../lib/ai/suggest';
import { toast } from '../ui/Toast';

export const ExperienceForm: React.FC = () => {
  const experiences = useResumeStore((s) => s.data.experience);
  const jobTitle = useResumeStore((s) => s.data.personal.jobTitle);
  const locale = useResumeStore((s) => s.config.locale);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const moveExperience = useResumeStore((s) => s.moveExperience);
  const aiSettings = useAiStore((s) => s.settings);
  const hasKey = Boolean(aiSettings.apiKey.trim() && aiSettings.baseUrl.trim() && aiSettings.model.trim());

  const [openIds, setOpenIds] = useState<string[]>(experiences.length ? [experiences[0].id] : []);
  const [busyId, setBusyId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));

  const addNew = () => {
    addExperience();
    // the store prepends the new item; open the first card on next tick
    setTimeout(() => {
      const fresh = useResumeStore.getState().data.experience[0];
      if (fresh) setOpenIds((ids) => [...ids, fresh.id]);
    }, 0);
  };

  const handleAiBullets = async (exp: Experience) => {
    setBusyId(exp.id);
    try {
      if (hasKey) {
        const bullets = await aiGenerateBullets(aiSettings, exp);
        updateExperience(exp.id, { highlights: [...exp.highlights.filter(Boolean), ...bullets] });
        toast('Достижения сгенерированы', { description: 'Проверьте цифры и факты перед отправкой.' });
      } else {
        const suggestions = suggestBulletsFor(exp.position || jobTitle);
        const next = suggestions.length ? suggestions : ['Сформулируйте результат: что изменилось и на сколько'];
        updateExperience(exp.id, { highlights: [...exp.highlights.filter(Boolean), ...next] });
        toast('Добавлены заготовки достижений', {
          description: hasKey ? '' : 'Без ключа модели — это шаблоны. Замените цифры на свои.',
          tone: 'info',
        });
      }
    } catch (error) {
      toast('Модель недоступна', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const improveHighlight = async (exp: Experience, index: number) => {
    const current = exp.highlights[index] ?? '';
    if (!current.trim()) return;
    const highlights = [...exp.highlights];
    if (!hasKey) {
      const suggestion = improveBulletLocal(current);
      highlights[index] = suggestion.improved;
      updateExperience(exp.id, { highlights });
      toast('Формулировка усилена', { description: suggestion.note });
      return;
    }
    setBusyId(exp.id);
    try {
      const improved = await aiImproveText(aiSettings, current, `${exp.position} в ${exp.company}`);
      highlights[index] = improved;
      updateExperience(exp.id, { highlights });
      toast('Переписано моделью');
    } catch (error) {
      toast('Модель недоступна', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] leading-snug text-ink-mute">
          Начинайте с последнего места. На каждое — 3–5 достижений с цифрами.
        </p>
        <AddButton label="Опыт" onClick={addNew} />
      </div>

      {!experiences.length && (
        <EmptyState
          icon="briefcase"
          title="Опыта пока нет"
          description="Добавьте первое место работы — или импортируйте готовое резюме текстом в разделе «ИИ»."
          action={<Button size="sm" variant="primary" icon="plus" onClick={addNew}>Добавить опыт</Button>}
        />
      )}

      {experiences.map((exp, index) => {
        const open = openIds.includes(exp.id);
        return (
          <CollapseCard
            key={exp.id}
            open={open}
            onToggle={() => toggle(exp.id)}
            icon="briefcase"
            title={exp.position || 'Новая позиция'}
            subtitle={[exp.company || 'Компания', dateRange(exp.startDate, exp.endDate, exp.current, locale)]
              .filter(Boolean)
              .join(' · ')}
            actions={
              <>
                <IconButton
                  name="arrow-up"
                  label="Выше"
                  disabled={index === 0}
                  onClick={() => moveExperience(exp.id, -1)}
                />
                <IconButton
                  name="arrow-down"
                  label="Ниже"
                  disabled={index === experiences.length - 1}
                  onClick={() => moveExperience(exp.id, 1)}
                />
                <IconButton name="trash" label="Удалить" tone="danger" onClick={() => removeExperience(exp.id)} />
              </>
            }
          >
            <div className="space-y-2.5">
              <Grid2>
                <Field label="Должность">
                  <Input
                    value={exp.position}
                    placeholder="Senior Developer"
                    onChange={(event) => updateExperience(exp.id, { position: event.target.value })}
                  />
                </Field>
                <Field label="Компания">
                  <Input
                    value={exp.company}
                    placeholder="TechCorp"
                    onChange={(event) => updateExperience(exp.id, { company: event.target.value })}
                  />
                </Field>
              </Grid2>

              <Grid2>
                <Field label="Начало">
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(event) => updateExperience(exp.id, { startDate: event.target.value })}
                  />
                </Field>
                <Field label="Окончание">
                  <Input
                    type="month"
                    value={exp.endDate}
                    disabled={exp.current}
                    onChange={(event) => updateExperience(exp.id, { endDate: event.target.value })}
                  />
                </Field>
              </Grid2>

              <div className="flex items-center justify-between gap-2">
                <label className="flex cursor-pointer items-center gap-2 text-[12px] text-ink-soft">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(event) => updateExperience(exp.id, { current: event.target.checked, endDate: '' })}
                    className="h-3.5 w-3.5 rounded border-line accent-brand-500"
                  />
                  Работаю здесь сейчас
                </label>
                <Input
                  className="field-sm w-[46%]"
                  placeholder="Город / удалённо"
                  value={exp.location ?? ''}
                  onChange={(event) => updateExperience(exp.id, { location: event.target.value })}
                />
              </div>

              <Field label="Контекст роли" hint="Продукт, команда, масштаб — одна строка.">
                <Input
                  value={exp.description}
                  placeholder="SaaS-платформа для аналитики, 200k+ пользователей"
                  onChange={(event) => updateExperience(exp.id, { description: event.target.value })}
                />
              </Field>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Достижения</span>
                  <div className="flex items-center gap-1.5">
                    <AiChip
                      label="ИИ"
                      onClick={() => void handleAiBullets(exp)}
                      loading={busyId === exp.id}
                      title="Сгенерировать достижения"
                    />
                    <button
                      type="button"
                      onClick={() => updateExperience(exp.id, { highlights: [...exp.highlights, ''] })}
                      className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11.5px] font-semibold text-ink-mute transition hover:bg-surface-3 hover:text-ink"
                    >
                      <PlusMini /> Пункт
                    </button>
                  </div>
                </div>

                {exp.highlights.length === 0 && (
                  <TipRow>Добавьте достижения: что сделали, с помощью чего и какой измеримый результат.</TipRow>
                )}

                <div className="space-y-1.5">
                  {exp.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="group flex items-start gap-1">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      <TextArea
                        rows={1}
                        className="field-sm min-h-[34px] flex-1 py-1.5"
                        value={highlight}
                        placeholder="Снизил время загрузки на 40% через code-splitting"
                        onChange={(event) => {
                          const next = [...exp.highlights];
                          next[highlightIndex] = event.target.value;
                          updateExperience(exp.id, { highlights: next });
                        }}
                      />
                      <button
                        type="button"
                        title="Улучшить формулировку"
                        onClick={() => void improveHighlight(exp, highlightIndex)}
                        className="mt-0.5 rounded-md p-1.5 text-ink-faint opacity-0 transition hover:bg-brand-500/10 hover:text-brand-500 group-hover:opacity-100"
                      >
                        <SparkMini />
                      </button>
                      <IconButton
                        name="x"
                        label="Удалить пункт"
                        size={13}
                        className="mt-0.5"
                        onClick={() =>
                          updateExperience(exp.id, {
                            highlights: exp.highlights.filter((_, i) => i !== highlightIndex),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapseCard>
        );
      })}
    </div>
  );
};

const PlusMini: React.FC = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SparkMini: React.FC = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
    <path d="M18.5 14.5l.9 2.2 2.1.8-2.1.8-.9 2.2-.9-2.2-2.1-.8 2.1-.8.9-2.2Z" />
  </svg>
);
