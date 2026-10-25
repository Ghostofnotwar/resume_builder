import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Button, CollapseCard, EmptyState, Field, IconButton, Input } from '../ui';
import { AddButton, Grid2 } from './FormKit';

export const EducationForm: React.FC = () => {
  const education = useResumeStore((s) => s.data.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);
  const moveEducation = useResumeStore((s) => s.moveEducation);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] leading-snug text-ink-mute">Вуз, курсы и программы — от новых к старым.</p>
        <AddButton label="Место учёбы" onClick={() => addEducation()} />
      </div>

      {!education.length && (
        <EmptyState
          icon="graduation"
          title="Образование не добавлено"
          description="Одно-два места учёбы достаточно. Курсы лучше вынести в «Сертификаты»."
          action={<Button size="sm" variant="primary" icon="plus" onClick={() => addEducation()}>Добавить</Button>}
        />
      )}

      {education.map((edu, index) => (
        <div key={edu.id} className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center gap-2 px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-mute">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                <path d="M22 9 12 4 2 9l10 5 10-5Z" />
                <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">{edu.institution || 'Учебное заведение'}</p>
              <p className="truncate text-[11.5px] text-ink-mute">
                {[edu.degree, edu.field].filter(Boolean).join(', ') || 'Степень и специальность'}
                {edu.startYear ? ` · ${edu.startYear}${edu.endYear ? `–${edu.endYear}` : ''}` : ''}
              </p>
            </div>
            <IconButton name="arrow-up" label="Выше" disabled={index === 0} onClick={() => moveEducation(edu.id, -1)} />
            <IconButton
              name="arrow-down"
              label="Ниже"
              disabled={index === education.length - 1}
              onClick={() => moveEducation(edu.id, 1)}
            />
            <IconButton name="trash" label="Удалить" tone="danger" onClick={() => removeEducation(edu.id)} />
          </div>

          <div className="space-y-2.5 border-t border-line bg-surface-2 px-3 py-3">
            <Field label="Учебное заведение">
              <Input
                value={edu.institution}
                placeholder="МГУ им. М. В. Ломоносова"
                onChange={(event) => updateEducation(edu.id, { institution: event.target.value })}
              />
            </Field>
            <Grid2>
              <Field label="Степень">
                <Input
                  value={edu.degree}
                  placeholder="Бакалавр / Магистр"
                  onChange={(event) => updateEducation(edu.id, { degree: event.target.value })}
                />
              </Field>
              <Field label="Специальность">
                <Input
                  value={edu.field}
                  placeholder="Прикладная информатика"
                  onChange={(event) => updateEducation(edu.id, { field: event.target.value })}
                />
              </Field>
            </Grid2>
            <div className="grid grid-cols-3 gap-2.5">
              <Field label="Год начала">
                <Input
                  inputMode="numeric"
                  value={edu.startYear}
                  placeholder="2015"
                  onChange={(event) => updateEducation(edu.id, { startYear: event.target.value })}
                />
              </Field>
              <Field label="Год выпуска">
                <Input
                  inputMode="numeric"
                  value={edu.endYear}
                  placeholder="2019"
                  onChange={(event) => updateEducation(edu.id, { endYear: event.target.value })}
                />
              </Field>
              <Field label="Город">
                <Input
                  value={edu.location ?? ''}
                  placeholder="Москва"
                  onChange={(event) => updateEducation(edu.id, { location: event.target.value })}
                />
              </Field>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
