import { AiSettings, Experience, ResumeData } from '../../types';

const STORAGE_KEY = 'resume-studio-ai-settings';

export const DEFAULT_AI_SETTINGS: AiSettings = {
  apiKey: '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
};

export function loadAiSettings(): AiSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AI_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AiSettings>;
    return { ...DEFAULT_AI_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

export function saveAiSettings(settings: AiSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function hasAiKey(settings: AiSettings): boolean {
  return Boolean(settings.apiKey.trim() && settings.baseUrl.trim() && settings.model.trim());
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function chat(settings: AiSettings, messages: ChatMessage[], maxTokens = 700): Promise<string> {
  if (!hasAiKey(settings)) {
    throw new Error('Не задан API-ключ. Откройте «ИИ» → «Подключить модель» или используйте офлайн-режим.');
  }
  const url = `${settings.baseUrl.replace(/\/$/, '')}/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: settings.model.trim(),
      messages,
      temperature: 0.6,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(
      `Модель вернула ошибку ${response.status}. ${text.slice(0, 240) || 'Проверьте ключ, модель и endpoint.'}`
    );
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Пустой ответ модели. Попробуйте другую модель или повторите запрос.');
  }
  return content.trim();
}

function resumeBrief(data: ResumeData): string {
  return [
    `Имя: ${data.personal.fullName}`,
    `Должность: ${data.personal.jobTitle}`,
    `Локация: ${data.personal.location}`,
    `О себе: ${data.summary}`,
    'Опыт:',
    ...data.experience.map(
      (e) =>
        `- ${e.position} в ${e.company} (${e.startDate}–${e.current ? 'наст. время' : e.endDate}): ${e.description} ${e.highlights.join('; ')}`
    ),
    `Навыки: ${data.skills.map((s) => s.name).join(', ')}`,
  ].join('\n');
}

const SYSTEM_RU =
  'Ты — опытный карьерный консультант и редактор резюме. Пишешь на русском языке, если не попросили иначе. ' +
  'Формулировки конкретные, без воды и клише, с глаголами действия и измеримыми результатами. ' +
  'Не выдумывай факты, которых нет во входных данных: если не хватает цифры, оставь плейсхолдер [метрика]. ' +
  'Отвечай только готовым текстом без пояснений и markdown-разметки.';

export async function aiImproveText(
  settings: AiSettings,
  text: string,
  context = ''
): Promise<string> {
  return chat(settings, [
    { role: 'system', content: SYSTEM_RU },
    {
      role: 'user',
      content: `Улучши формулировку для резюме. Сделай её сильнее, конкретнее и компактнее (до 220 символов), сохранив смысл.\nКонтекст: ${context || 'резюме'}\nТекст: ${text}\nВерни только улучшенный вариант.`,
    },
  ]);
}

export async function aiGenerateSummary(
  settings: AiSettings,
  data: ResumeData,
  vacancy = ''
): Promise<string> {
  return chat(settings, [
    { role: 'system', content: SYSTEM_RU },
    {
      role: 'user',
      content: `Напиши профиль резюме (3–5 предложений, до 600 символов) на основе данных ниже.${
        vacancy ? `\nПодстрой под вакансию, используя её ключевые слова:\n${vacancy.slice(0, 2500)}` : ''
      }\n\nДанные:\n${resumeBrief(data)}`,
    },
  ]);
}

export async function aiGenerateBullets(
  settings: AiSettings,
  exp: Experience,
  vacancy = ''
): Promise<string[]> {
  const content = await chat(
    settings,
    [
      { role: 'system', content: SYSTEM_RU },
      {
        role: 'user',
        content: `Сформулируй 4 достижения для этого места работы. Каждое — до 180 символов, с глаголом действия и измеримым результатом (если данных нет — плейсхолдер [метрика]). Выведи по одному пункту в строке, без нумерации и маркеров.${
          vacancy ? `\nУчти требования вакансии:\n${vacancy.slice(0, 1500)}` : ''
        }\n\nДолжность: ${exp.position}\nКомпания: ${exp.company}\nОписание: ${exp.description}\nТекущие пункты: ${exp.highlights.join('; ')}`,
      },
    ],
    600
  );
  return content
    .split('\n')
    .map((line) => line.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 6);
}

export async function aiCoverLetter(
  settings: AiSettings,
  data: ResumeData,
  vacancy: string
): Promise<string> {
  return chat(
    settings,
    [
      { role: 'system', content: SYSTEM_RU },
      {
        role: 'user',
        content: `Напиши короткое сопроводительное письмо (120–180 слов) под вакансию. Структура: приветствие, почему подхожу (2 факта), конкретный вклад, завершение. Без воды.\n\nВакансия:\n${vacancy.slice(0, 3000)}\n\nРезюме:\n${resumeBrief(data)}`,
      },
    ],
    800
  );
}

export async function aiTranslateResume(
  settings: AiSettings,
  data: ResumeData,
  target: 'en' | 'ru'
): Promise<string> {
  return chat(
    settings,
    [
      {
        role: 'system',
        content:
          'You translate resumes into professional business language. Keep numbers, company names and technologies. Return only valid JSON, no markdown.',
      },
      {
        role: 'user',
        content: `Translate this resume content to ${target === 'en' ? 'English' : 'Russian'}. Keep the JSON structure exactly and translate only the textual values (not ids).\n${JSON.stringify(
          {
            summary: data.summary,
            experience: data.experience.map((e) => ({
              position: e.position,
              description: e.description,
              highlights: e.highlights,
            })),
            education: data.education.map((e) => ({ degree: e.degree, field: e.field })),
            skills: data.skills.map((s) => s.name),
          },
          null,
          2
        )}`,
      },
    ],
    1800
  );
}

export async function aiCheckGrammar(settings: AiSettings, text: string): Promise<string> {
  return chat(settings, [
    { role: 'system', content: SYSTEM_RU },
    {
      role: 'user',
      content: `Проверь текст резюме на ошибки и стилистику. Верни исправленный текст без пояснений.\n\n${text.slice(0, 4000)}`,
    },
  ]);
}

/** Cheap connectivity check for the settings screen. */
export async function aiPing(settings: AiSettings): Promise<string> {
  return chat(
    settings,
    [
      { role: 'system', content: 'Ты — тестовый ассистент. Отвечай коротко.' },
      { role: 'user', content: 'Ответь одним словом: работает' },
    ],
    16
  );
}

export interface TranslatedResumePayload {
  summary: string;
  experience: { position: string; description: string; highlights: string[] }[];
  education: { degree: string; field: string }[];
  skills: string[];
}
