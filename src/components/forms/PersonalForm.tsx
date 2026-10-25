import React, { useRef, useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useAiStore } from '../../store/aiStore';
import { fileToBase64, cn } from '../../utils';
import { Button, Field, IconButton, Input, TextArea } from '../ui';
import { AddButton, AiChip, Counter, Grid2, Group, TipRow } from './FormKit';
import { Icon } from '../ui/Icon';
import { toast } from '../ui/Toast';
import { generateSummary } from '../../lib/ai/suggest';
import { aiImproveText } from '../../lib/ai/llm';

export const PersonalForm: React.FC = () => {
  const personal = useResumeStore((s) => s.data.personal);
  const summary = useResumeStore((s) => s.data.summary);
  const data = useResumeStore((s) => s.data);
  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const updateSummary = useResumeStore((s) => s.updateSummary);
  const addLink = useResumeStore((s) => s.addLink);
  const updateLink = useResumeStore((s) => s.updateLink);
  const removeLink = useResumeStore((s) => s.removeLink);
  const aiSettings = useAiStore((s) => s.settings);
  const hasKey = Boolean(aiSettings.apiKey.trim() && aiSettings.baseUrl.trim() && aiSettings.model.trim());

  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Нужен файл изображения', { description: 'JPG, PNG или WebP.', tone: 'error' });
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      toast('Фото слишком большое', { description: 'Максимум 6 МБ — сожмите изображение.', tone: 'error' });
      return;
    }
    updatePersonal({ photo: await fileToBase64(file) });
    toast('Фото добавлено');
  };

  const handleAiSummary = async () => {
    if (!hasKey) {
      updateSummary(generateSummary(data));
      toast('Профиль сгенерирован офлайн', {
        description: 'Подключите модель в разделе «ИИ», чтобы получить персональный текст.',
        tone: 'info',
      });
      return;
    }
    setSummaryLoading(true);
    try {
      const result = await aiImproveText(
        aiSettings,
        summary || generateSummary(data),
        `${personal.jobTitle}, опыт: ${data.experience.map((e) => e.position).join(', ')}`
      );
      updateSummary(result);
      toast('Профиль улучшен моделью');
    } catch (error) {
      toast('Не удалось обратиться к модели', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* photo */}
      <div
        className={cn(
          'flex items-center gap-3.5 rounded-2xl border p-3.5 transition',
          dragging ? 'border-brand-400 bg-brand-500/[0.06]' : 'border-line bg-surface'
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFile(event.dataTransfer.files?.[0]);
        }}
      >
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl border border-line bg-surface-2"
          title="Загрузить фото"
        >
          {personal.photo ? (
            <img src={personal.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-ink-faint">
              <Icon name="user" size={24} />
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-white opacity-0 transition group-hover:opacity-100">
            <Icon name="upload" size={16} />
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-ink">Фотография</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-ink-mute">
            Перетащите файл сюда или выберите. Работает офлайн — фото хранится в браузере.
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <Button size="xs" variant="secondary" icon="upload" onClick={() => fileRef.current?.click()}>
              {personal.photo ? 'Заменить' : 'Загрузить'}
            </Button>
            {personal.photo && (
              <button
                onClick={() => updatePersonal({ photo: '' })}
                className="text-[11.5px] font-medium text-rose-500 transition hover:text-rose-600"
              >
                Удалить
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
      </div>

      <Group title="Как вас представить">
        <div className="space-y-2.5">
          <Grid2>
            <Field label="Имя и фамилия">
              <Input
                value={personal.fullName}
                placeholder="Александр Иванов"
                onChange={(event) => updatePersonal({ fullName: event.target.value })}
              />
            </Field>
            <Field label="Должность">
              <Input
                value={personal.jobTitle}
                placeholder="Product Designer"
                onChange={(event) => updatePersonal({ jobTitle: event.target.value })}
              />
            </Field>
          </Grid2>
          <Grid2>
            <Field label="Email">
              <Input
                type="email"
                value={personal.email}
                placeholder="you@email.com"
                onChange={(event) => updatePersonal({ email: event.target.value })}
              />
            </Field>
            <Field label="Телефон">
              <Input
                value={personal.phone}
                placeholder="+7 (999) 000-00-00"
                onChange={(event) => updatePersonal({ phone: event.target.value })}
              />
            </Field>
          </Grid2>
          <Field label="Город / формат работы">
            <Input
              value={personal.location}
              placeholder="Москва · удалённо"
              onChange={(event) => updatePersonal({ location: event.target.value })}
            />
          </Field>
        </div>
      </Group>

      <Group
        title="Профиль / о себе"
        description="3–5 строк: роль, опыт, сильные стороны и результат."
        action={<AiChip label="Улучшить" onClick={handleAiSummary} loading={summaryLoading} />}
      >
        <TextArea
          rows={6}
          value={summary}
          placeholder="Например: Продуктовый дизайнер с 5 годами опыта в B2B SaaS. Сократил время онбординга на 30%..."
          onChange={(event) => updateSummary(event.target.value)}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <Counter value={summary.length} min={180} max={700} />
          <button
            type="button"
            onClick={() => updateSummary(generateSummary(data))}
            className="text-[11.5px] font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-300"
          >
            Сгенерировать из данных
          </button>
        </div>
      </Group>

      <Group
        title="Ссылки"
        description="LinkedIn, GitHub, портфолио, Telegram — до 4 штук."
        action={<AddButton label="Добавить" onClick={() => addLink()} />}
      >
        {personal.links.length === 0 ? (
          <TipRow>Пока нет ссылок. Добавьте хотя бы одну — это повышает доверие рекрутера.</TipRow>
        ) : (
          <div className="space-y-2">
            {personal.links.map((link) => (
              <div key={link.id} className="flex items-center gap-1.5">
                <Input
                  className="field-sm w-[104px] shrink-0"
                  placeholder="LinkedIn"
                  value={link.label}
                  onChange={(event) => updateLink(link.id, { label: event.target.value })}
                />
                <Input
                  className="field-sm min-w-0 flex-1"
                  placeholder="linkedin.com/in/you"
                  value={link.url}
                  onChange={(event) => updateLink(link.id, { url: event.target.value })}
                />
                <IconButton name="trash" label="Удалить ссылку" tone="danger" onClick={() => removeLink(link.id)} />
              </div>
            ))}
          </div>
        )}
      </Group>
    </div>
  );
};
