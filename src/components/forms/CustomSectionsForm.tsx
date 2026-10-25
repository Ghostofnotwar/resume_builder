import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { EmptyState, Field, IconButton, Input, TextArea } from '../ui';
import { AddButton, Grid2, TipRow } from './FormKit';
import { Icon } from '../ui/Icon';

export const CustomSectionsForm: React.FC = () => {
  const customSections = useResumeStore((s) => s.data.customSections);
  const addCustomSection = useResumeStore((s) => s.addCustomSection);
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection);
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection);
  const addCustomItem = useResumeStore((s) => s.addCustomItem);
  const updateCustomItem = useResumeStore((s) => s.updateCustomItem);
  const removeCustomItem = useResumeStore((s) => s.removeCustomItem);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] leading-snug text-ink-mute">
          Публикации, выступления, волонтёрство, патенты — любые разделы.
        </p>
        <AddButton label="Раздел" onClick={() => addCustomSection()} />
      </div>

      {!customSections.length && (
        <EmptyState
          icon="layers"
          title="Дополнительных разделов нет"
          description="Создайте свой блок: «Публикации», «Выступления», «Волонтёрство»."
        />
      )}

      {customSections.map((section) => (
        <div key={section.id} className="rounded-2xl border border-line bg-surface">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-2 text-ink-mute">
              <Icon name="layers" size={14} />
            </span>
            <Input
              className="field-sm flex-1 font-semibold"
              value={section.title}
              placeholder="Название раздела"
              onChange={(event) => updateCustomSection(section.id, { title: event.target.value })}
            />
            <button
              type="button"
              onClick={() => addCustomItem(section.id)}
              className="rounded-lg px-2 py-1 text-[11.5px] font-semibold text-brand-600 hover:bg-brand-500/10 dark:text-brand-300"
            >
              + пункт
            </button>
            <IconButton name="trash" label="Удалить раздел" tone="danger" onClick={() => removeCustomSection(section.id)} />
          </div>

          <div className="space-y-2.5 bg-surface-2 p-3">
            {section.items.map((item) => (
              <div key={item.id} className="rounded-xl border border-line bg-surface p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">Пункт</span>
                  <IconButton name="x" label="Удалить пункт" size={13} onClick={() => removeCustomItem(section.id, item.id)} />
                </div>
                <div className="space-y-2">
                  <Grid2>
                    <Field label="Заголовок">
                      <Input
                        className="field-sm"
                        value={item.title}
                        placeholder="Название публикации"
                        onChange={(event) => updateCustomItem(section.id, item.id, { title: event.target.value })}
                      />
                    </Field>
                    <Field label="Подпись / ссылка">
                      <Input
                        className="field-sm"
                        value={item.subtitle}
                        placeholder="Издание / роль"
                        onChange={(event) => updateCustomItem(section.id, item.id, { subtitle: event.target.value })}
                      />
                    </Field>
                  </Grid2>
                  <Grid2>
                    <Field label="Дата">
                      <Input
                        className="field-sm"
                        value={item.date}
                        placeholder="2024"
                        onChange={(event) => updateCustomItem(section.id, item.id, { date: event.target.value })}
                      />
                    </Field>
                    <Field label="Детали">
                      <Input
                        className="field-sm"
                        value={item.description}
                        placeholder="Одна строка о сути"
                        onChange={(event) => updateCustomItem(section.id, item.id, { description: event.target.value })}
                      />
                    </Field>
                  </Grid2>
                </div>
              </div>
            ))}
            {!section.items.length && (
              <TipRow>В разделе нет пунктов — добавьте хотя бы один, иначе он не появится в резюме.</TipRow>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
