import React, { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { useAiStore } from '../../../store/aiStore';
import { Button, TextArea } from '../../ui';
import { Group } from '../FormKit';
import { toast } from '../../ui/Toast';
import {
  aiCoverLetter,
  aiGenerateSummary,
  aiTranslateResume,
  TranslatedResumePayload,
} from '../../../lib/ai/llm';
import { generateSummary } from '../../../lib/ai/suggest';

export const AiWriteTab: React.FC = () => {
  const data = useResumeStore((s) => s.data);
  const config = useResumeStore((s) => s.config);
  const updateSummary = useResumeStore((s) => s.updateSummary);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const updateSkill = useResumeStore((s) => s.updateSkill);
  const setLocale = useResumeStore((s) => s.setLocale);

  const settings = useAiStore((s) => s.settings);
  const hasKey = Boolean(settings.apiKey.trim() && settings.baseUrl.trim() && settings.model.trim());

  const [vacancy, setVacancy] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const handleSummary = async () => {
    setBusy('summary');
    try {
      if (hasKey) {
        updateSummary(await aiGenerateSummary(settings, data, vacancy));
        toast('Профиль обновлён');
      } else {
        updateSummary(generateSummary(data));
        toast('Профиль собран офлайн', { description: 'Подключите модель для более точного текста.', tone: 'info' });
      }
    } catch (error) {
      toast('Ошибка модели', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setBusy(null);
    }
  };

  const handleCoverLetter = async () => {
    if (!hasKey) {
      toast('Нужна подключённая модель', { description: 'Письмо генерирует LLM — добавьте ключ в разделе «Модель».', tone: 'info' });
      return;
    }
    if (!vacancy.trim()) {
      toast('Вставьте описание вакансии', { tone: 'error' });
      return;
    }
    setBusy('cover');
    try {
      setCoverLetter(await aiCoverLetter(settings, data, vacancy));
      toast('Письмо готово');
    } catch (error) {
      toast('Ошибка модели', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setBusy(null);
    }
  };

  const handleTranslate = async () => {
    if (!hasKey) {
      toast('Нужна подключённая модель', { tone: 'info' });
      return;
    }
    setBusy('translate');
    try {
      const raw = await aiTranslateResume(settings, data, config.locale === 'en' ? 'ru' : 'en');
      const json = raw.replace(/^```json/i, '').replace(/```$/, '').trim();
      const payload = JSON.parse(json) as TranslatedResumePayload;
      if (payload.summary) updateSummary(payload.summary);
      payload.experience?.forEach((translated, index) => {
        const target = data.experience[index];
        if (!target) return;
        updateExperience(target.id, {
          position: translated.position || target.position,
          description: translated.description || target.description,
          highlights: Array.isArray(translated.highlights) ? translated.highlights : target.highlights,
        });
      });
      payload.education?.forEach((translated, index) => {
        const target = data.education[index];
        if (!target) return;
        updateEducation(target.id, { degree: translated.degree || target.degree, field: translated.field || target.field });
      });
      payload.skills?.forEach((name, index) => {
        const target = data.skills[index];
        if (target) updateSkill(target.id, { name });
      });
      setLocale(config.locale === 'en' ? 'ru' : 'en');
      toast('Резюме переведено', { description: 'Проверьте заголовки разделов и формулировки.' });
    } catch (error) {
      toast('Не удалось перевести', {
        description: `${String((error as Error).message)}. Модель должна вернуть JSON.`,
        tone: 'error',
      });
    } finally {
      setBusy(null);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Скопировано');
    } catch {
      toast('Не удалось скопировать', { tone: 'error' });
    }
  };

  return (
    <div className="space-y-3">
      <Group title="Профиль и перевод" description="Модель переписывает «О себе» на основе опыта и навыков.">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="primary" icon="sparkles" loading={busy === 'summary'} onClick={() => void handleSummary()}>
            {hasKey ? 'Сгенерировать профиль' : 'Профиль офлайн'}
          </Button>
          <Button size="sm" variant="secondary" icon="translate" loading={busy === 'translate'} onClick={() => void handleTranslate()}>
            Перевести на {config.locale === 'en' ? 'русский' : 'английский'}
          </Button>
        </div>
        {!hasKey && (
          <p className="mt-2 text-[11px] leading-snug text-ink-faint">
            Без ключа доступны офлайн-генерация профиля, подсказки навыков и улучшение формулировок.
          </p>
        )}
      </Group>

      <Group title="Вакансия" description="Вставьте описание — учтём ключевые слова в текстах.">
        <TextArea
          rows={4}
          value={vacancy}
          onChange={(event) => setVacancy(event.target.value)}
          placeholder="Ищем Product Designer с опытом B2B SaaS, Figma, дизайн-системами..."
        />
      </Group>

      <Group
        title="Сопроводительное письмо"
        description="Короткое письмо под вакансию — 120–180 слов."
        action={
          <Button size="xs" variant="soft" icon="sparkles" loading={busy === 'cover'} onClick={() => void handleCoverLetter()}>
            Написать
          </Button>
        }
      >
        {coverLetter ? (
          <>
            <TextArea rows={9} value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} className="text-[12px]" />
            <div className="mt-2 flex items-center gap-2">
              <Button size="xs" variant="secondary" icon="copy" onClick={() => void copy(coverLetter)}>
                Скопировать
              </Button>
              <Button size="xs" variant="ghost" icon="refresh" onClick={() => void handleCoverLetter()}>
                Переписать
              </Button>
            </div>
          </>
        ) : (
          <p className="text-[11.5px] leading-snug text-ink-mute">
            Вставьте вакансию и нажмите «Написать». Письмо появится здесь — его можно отредактировать перед отправкой.
          </p>
        )}
      </Group>
    </div>
  );
};
