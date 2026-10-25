import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Language } from '../../types';
import { PROFICIENCY_LABELS } from '../../constants';
import { EmptyState, Field, IconButton, Input, Select } from '../ui';
import { AddButton, TipRow } from './FormKit';

const LEVELS: Language['proficiency'][] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'];

export const LanguagesForm: React.FC = () => {
  const languages = useResumeStore((s) => s.data.languages);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] leading-snug text-ink-mute">Уровень по CEFR или «родной».</p>
        <AddButton label="Язык" onClick={() => addLanguage()} />
      </div>

      {!languages.length && (
        <EmptyState icon="globe" title="Языков пока нет" description="Добавьте родной и иностранные языки с уровнем." />
      )}

      <div className="space-y-2">
        {languages.map((language) => (
          <div key={language.id} className="flex items-end gap-2 rounded-xl border border-line bg-surface p-2.5">
            <Field label="Язык" className="flex-1">
              <Input
                value={language.name}
                placeholder="Английский"
                onChange={(event) => updateLanguage(language.id, { name: event.target.value })}
              />
            </Field>
            <Field label="Уровень" className="w-[150px]">
              <Select
                value={language.proficiency}
                onChange={(event) =>
                  updateLanguage(language.id, { proficiency: event.target.value as Language['proficiency'] })
                }
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {PROFICIENCY_LABELS[level]}
                  </option>
                ))}
              </Select>
            </Field>
            <IconButton name="trash" label="Удалить" tone="danger" className="mb-0.5" onClick={() => removeLanguage(language.id)} />
          </div>
        ))}
      </div>

      {languages.length > 0 && <TipRow>Для международных компаний указывайте уровень по CEFR: B2, C1, C2.</TipRow>}
    </div>
  );
};
