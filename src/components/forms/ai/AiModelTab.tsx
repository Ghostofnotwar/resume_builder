import React, { useState } from 'react';
import { useAiStore } from '../../../store/aiStore';
import { Button, Field, Input, Select } from '../../ui';
import { Group, TipRow } from '../FormKit';
import { Icon } from '../../ui/Icon';
import { toast } from '../../ui/Toast';
import { AI_PRESETS } from '../../../constants';
import { aiPing } from '../../../lib/ai/llm';

export const AiModelTab: React.FC = () => {
  const settings = useAiStore((s) => s.settings);
  const setSettings = useAiStore((s) => s.setSettings);
  const hasKey = Boolean(settings.apiKey.trim() && settings.baseUrl.trim() && settings.model.trim());
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<'ok' | 'error' | null>(null);

  const testModel = async () => {
    setTesting(true);
    setResult(null);
    try {
      await aiPing(settings);
      setResult('ok');
      toast('Модель отвечает');
    } catch (error) {
      setResult('error');
      toast('Не удалось подключиться', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Group
        title="Подключение модели"
        description="Любой OpenAI-совместимый endpoint. Ключ хранится только в localStorage браузера и отправляется напрямую в API."
      >
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {AI_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() =>
                setSettings({
                  baseUrl: preset.baseUrl || settings.baseUrl,
                  model: preset.model || settings.model,
                })
              }
              className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11.5px] font-medium text-ink-soft transition hover:border-brand-400 hover:text-brand-600"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          <Field label="API key">
            <Input
              type="password"
              value={settings.apiKey}
              placeholder="sk-..."
              onChange={(event) => setSettings({ apiKey: event.target.value })}
              autoComplete="off"
            />
          </Field>
          <Field label="Base URL">
            <Input
              value={settings.baseUrl}
              placeholder="https://api.openai.com/v1"
              onChange={(event) => setSettings({ baseUrl: event.target.value })}
            />
          </Field>
          <Field label="Модель">
            <Input
              value={settings.model}
              placeholder="gpt-4o-mini"
              onChange={(event) => setSettings({ model: event.target.value })}
            />
          </Field>
          <Select
            value=""
            onChange={(event) => {
              const preset = AI_PRESETS.find((item) => item.id === event.target.value);
              if (preset) setSettings({ baseUrl: preset.baseUrl, model: preset.model });
            }}
          >
            <option value="">Быстрый выбор провайдера…</option>
            {AI_PRESETS.filter((preset) => preset.id !== 'custom').map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label} · {preset.model}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <Button size="sm" variant="secondary" icon="zap" loading={testing} onClick={() => void testModel()} disabled={!hasKey}>
            Проверить связь
          </Button>
          {result === 'ok' && (
            <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-emerald-500">
              <Icon name="check" size={13} /> работает
            </span>
          )}
          {result === 'error' && <span className="text-[11.5px] font-semibold text-rose-500">не отвечает</span>}
        </div>
      </Group>

      <TipRow>
        Подойдёт OpenRouter, Groq, Together или локальный сервер (Ollama, LM Studio) — главное, чтобы у него был
        OpenAI-совместимый <code className="font-mono">/chat/completions</code>.
      </TipRow>

      <div className="rounded-2xl border border-line bg-surface p-3">
        <p className="text-[11.5px] font-semibold text-ink">Без ключа всё тоже работает</p>
        <p className="mt-0.5 text-[11px] leading-snug text-ink-mute">
          Подсказки навыков, готовые формулировки достижений, офлайн-парсер и проверка ATS выполняются локально.
        </p>
        <Button
          size="xs"
          variant="ghost"
          icon="refresh"
          className="mt-2"
          onClick={() => {
            setSettings({ apiKey: '' });
            toast('Ключ удалён из браузера', { tone: 'info' });
          }}
        >
          Очистить ключ
        </Button>
      </div>
    </div>
  );
};
