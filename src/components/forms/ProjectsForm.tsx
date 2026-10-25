import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Button, CollapseCard, EmptyState, Field, IconButton, Input, TextArea } from '../ui';
import { AddButton, Grid2, TipRow } from './FormKit';

export const ProjectsForm: React.FC = () => {
  const projects = useResumeStore((s) => s.data.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);
  const moveProject = useResumeStore((s) => s.moveProject);
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] leading-snug text-ink-mute">Пет-проекты и кейсы — особенно для джунов и дизайнеров.</p>
        <AddButton label="Проект" onClick={() => addProject()} />
      </div>

      {!projects.length && (
        <EmptyState
          icon="folder"
          title="Проектов пока нет"
          description="Добавьте 1–3 проекта с ролью, ссылкой и результатом."
          action={<Button size="sm" variant="primary" icon="plus" onClick={() => addProject()}>Добавить проект</Button>}
        />
      )}

      {projects.map((project, index) => (
        <CollapseCard
          key={project.id}
          open={openIds.includes(project.id)}
          onToggle={() => toggle(project.id)}
          icon="folder"
          title={project.name || 'Новый проект'}
          subtitle={project.role || project.url || 'Роль и ссылка'}
          actions={
            <>
              <IconButton name="arrow-up" label="Выше" disabled={index === 0} onClick={() => moveProject(project.id, -1)} />
              <IconButton
                name="arrow-down"
                label="Ниже"
                disabled={index === projects.length - 1}
                onClick={() => moveProject(project.id, 1)}
              />
              <IconButton name="trash" label="Удалить" tone="danger" onClick={() => removeProject(project.id)} />
            </>
          }
        >
          <div className="space-y-2.5">
            <Grid2>
              <Field label="Название">
                <Input
                  value={project.name}
                  placeholder="Resume Studio"
                  onChange={(event) => updateProject(project.id, { name: event.target.value })}
                />
              </Field>
              <Field label="Ваша роль">
                <Input
                  value={project.role}
                  placeholder="Автор и мейнтейнер"
                  onChange={(event) => updateProject(project.id, { role: event.target.value })}
                />
              </Field>
            </Grid2>
            <div className="grid grid-cols-3 gap-2.5">
              <Field label="Ссылка" className="col-span-2">
                <Input
                  value={project.url}
                  placeholder="github.com/you/project"
                  onChange={(event) => updateProject(project.id, { url: event.target.value })}
                />
              </Field>
              <Field label="Период">
                <Input
                  value={project.startDate}
                  placeholder="2024"
                  onChange={(event) => updateProject(project.id, { startDate: event.target.value })}
                />
              </Field>
            </div>
            <Field label="Описание">
              <TextArea
                rows={2}
                value={project.description}
                placeholder="Что это за продукт и какую задачу решает"
                onChange={(event) => updateProject(project.id, { description: event.target.value })}
              />
            </Field>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">Результаты</span>
                <button
                  type="button"
                  onClick={() => updateProject(project.id, { highlights: [...project.highlights, ''] })}
                  className="text-[11.5px] font-semibold text-brand-600 dark:text-brand-300"
                >
                  + пункт
                </button>
              </div>
              {project.highlights.length === 0 && <TipRow>Например: «1.2k звёзд на GitHub» или «окупился за 3 месяца».</TipRow>}
              <div className="space-y-1.5">
                {project.highlights.map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="flex items-center gap-1.5">
                    <Input
                      className="field-sm"
                      value={highlight}
                      placeholder="Результат проекта"
                      onChange={(event) => {
                        const next = [...project.highlights];
                        next[highlightIndex] = event.target.value;
                        updateProject(project.id, { highlights: next });
                      }}
                    />
                    <IconButton
                      name="x"
                      label="Удалить"
                      size={13}
                      onClick={() =>
                        updateProject(project.id, {
                          highlights: project.highlights.filter((_, i) => i !== highlightIndex),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapseCard>
      ))}
    </div>
  );
};
