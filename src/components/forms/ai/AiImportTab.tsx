import React, { useRef, useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { Button, ProgressRing, TextArea } from '../../ui';
import { Group, TipRow } from '../FormKit';
import { Icon } from '../../ui/Icon';
import { toast } from '../../ui/Toast';
import { parseResumeText, ParseResult, SAMPLE_IMPORT_TEXT } from '../../../lib/ai/parse';

export const AiImportTab: React.FC = () => {
  const replaceData = useResumeStore((s) => s.replaceData);
  const current = useResumeStore((s) => s.data.personal);
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const runParse = (text = rawText) => {
    if (!text.trim()) {
      toast('Вставьте текст резюме', { tone: 'error' });
      return;
    }
    const result = parseResumeText(text);
    setParsed(result);
    toast('Текст разобран', {
      description: `Найдено: ${result.stats.experience} мест работы, ${result.stats.skills} навыков.`,
    });
  };

  const applyParsed = () => {
    if (!parsed) return;
    const next = {
      ...parsed.data,
      personal: {
        ...parsed.data.personal,
        fullName: parsed.data.personal.fullName || current.fullName,
        email: parsed.data.personal.email || current.email,
        phone: parsed.data.personal.phone || current.phone,
        photo: parsed.data.personal.photo || current.photo,
        links: parsed.data.personal.links.length ? parsed.data.personal.links : current.links,
      },
    };
    replaceData(next);
    setParsed(null);
    setRawText('');
    toast('Резюме заполнено из текста', { description: 'Проверьте даты и формулировки — Ctrl+Z отменит.' });
  };

  return (
    <div className="space-y-3">
      <Group
        title="Вставьте резюме как текст"
        description="Скопируйте с hh.ru, LinkedIn или из старого PDF. Разбор работает офлайн."
        action={
          <button
            onClick={() => setRawText(SAMPLE_IMPORT_TEXT)}
            className="text-[11.5px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
          >
            Пример
          </button>
        }
      >
        <TextArea
          rows={9}
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          placeholder={'Иван Петров\nProduct Designer\nМосква · ivan@mail.ru · +7 999 123-45-67\n\nОпыт работы\n...'}
          className="font-mono text-[11.5px]"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" icon="wand" onClick={() => runParse()}>
            Разобрать текст
          </Button>
          <Button size="sm" variant="secondary" icon="upload" onClick={() => fileRef.current?.click()}>
            Файл .txt
          </Button>
          <span className="ml-auto text-[11px] text-ink-faint">{rawText.length} символов</span>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,text/plain"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              setRawText(text);
              runParse(text);
              event.target.value = '';
            }}
          />
        </div>
      </Group>

      {parsed && (
        <div className="animate-slide-up rounded-2xl border border-brand-500/25 bg-brand-500/[0.04] p-3.5">
          <div className="flex items-center gap-3">
            <ProgressRing
              value={parsed.confidence}
              size={44}
              stroke={4}
              tone={parsed.confidence >= 70 ? '#10B981' : parsed.confidence >= 50 ? '#F59E0B' : '#EF4444'}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-ink">
                {parsed.data.personal.fullName || 'Имя не найдено'}
                {parsed.data.personal.jobTitle ? ` · ${parsed.data.personal.jobTitle}` : ''}
              </p>
              <p className="truncate text-[11.5px] text-ink-mute">
                {parsed.data.personal.email || 'нет email'} · {parsed.data.personal.phone || 'нет телефона'}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="chip">Опыт: {parsed.stats.experience}</span>
            <span className="chip">Образование: {parsed.stats.education}</span>
            <span className="chip">Навыки: {parsed.stats.skills}</span>
            <span className="chip">Ссылки: {parsed.data.personal.links.length}</span>
          </div>

          {parsed.data.experience.length > 0 && (
            <ul className="mt-2.5 space-y-1 text-[11.5px] text-ink-soft">
              {parsed.data.experience.slice(0, 3).map((exp) => (
                <li key={exp.id} className="flex gap-1.5">
                  <span className="text-brand-400">•</span>
                  <span className="min-w-0 truncate">
                    <strong>{exp.position || 'Позиция'}</strong> — {exp.company || 'компания'}
                    {exp.startDate ? ` (${exp.startDate})` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {parsed.warnings.length > 0 && (
            <div className="mt-2.5 space-y-1">
              {parsed.warnings.map((warning) => (
                <p key={warning} className="flex items-start gap-1.5 text-[11px] leading-snug text-amber-600 dark:text-amber-400">
                  <Icon name="alert" size={12} className="mt-0.5 shrink-0" />
                  {warning}
                </p>
              ))}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="primary" icon="check" onClick={applyParsed} full>
              Заполнить резюме
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setParsed(null)}>
              Отмена
            </Button>
          </div>
          <p className="mt-1.5 text-[10.5px] leading-snug text-ink-faint">
            Текущие данные заменятся. Отмена — Ctrl+Z или кнопка «Отменить» сверху.
          </p>
        </div>
      )}

      <TipRow>
        Лучше всего распознаются заголовки «Опыт работы», «Образование», «Навыки» и даты вида «Мар 2021 — настоящее время».
      </TipRow>
    </div>
  );
};
