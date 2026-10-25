import { ResumeData } from '../../types';

export interface RolePreset {
  id: string;
  label: string;
  keywords: string[];
  title: string;
  summary: string;
  skills: string[];
  bullets: string[];
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'frontend',
    label: 'Frontend-разработчик',
    keywords: ['frontend', 'фронтенд', 'react', 'vue', 'верстка', 'javascript', 'typescript'],
    title: 'Frontend Developer',
    summary:
      'Frontend-разработчик с опытом создания интерфейсов для высоконагруженных продуктов. Работаю с React, TypeScript и дизайн-системами, слежу за производительностью и доступностью. Умею переводить макеты в аккуратный код и находить общий язык с дизайнерами и бэкендом.',
    skills: ['React', 'TypeScript', 'JavaScript (ES6+)', 'HTML5 / CSS3', 'Next.js', 'REST / GraphQL', 'Git', 'Vite'],
    bullets: [
      'Ускорил загрузку ключевого экрана на 40% за счёт code-splitting и оптимизации изображений',
      'Собрал дизайн-систему из 40+ компонентов и сократил время запуска новых страниц на 30%',
      'Покрыл критические сценарии e2e-тестами, снизив количество регрессов на 45%',
    ],
  },
  {
    id: 'backend',
    label: 'Backend-разработчик',
    keywords: ['backend', 'бэкенд', 'python', 'java', 'golang', 'node', 'api', 'микросервис'],
    title: 'Backend Developer',
    summary:
      'Backend-разработчик с опытом проектирования API и работы с высокими нагрузками. Отвечаю за надёжность сервисов, оптимизацию запросов и наблюдаемость. Предпочитаю простые решения с понятной архитектурой и тестами.',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'REST / gRPC', 'Kubernetes', 'CI/CD'],
    bullets: [
      'Спроектировал API для сервиса с 100k+ запросов в сутки и p95 < 120 мс',
      'Оптимизировал SQL-запросы и снизил нагрузку на БД на 35%',
      'Внедрил трассировку и алерты, сократив время обнаружения инцидентов с часов до минут',
    ],
  },
  {
    id: 'fullstack',
    label: 'Fullstack-разработчик',
    keywords: ['fullstack', 'фулстек', 'full-stack', 'универсальный разработчик'],
    title: 'Fullstack Developer',
    summary:
      'Fullstack-разработчик: закрываю задачи от схемы данных до интерфейса. Умею работать автономно, оценивать риски и доводить продукт до релиза. Опыт работы в небольших продуктовых командах и запуска проектов с нуля.',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Prisma', 'Docker', 'AWS', 'Git'],
    bullets: [
      'Запустил MVP с нуля за 3 месяца и вывел продукт на первые 500 платящих пользователей',
      'Автоматизировал деплой и сократил время релиза с 2 часов до 10 минут',
      'Снизил стоимость инфраструктуры на 25% за счёт оптимизации и миграции',
    ],
  },
  {
    id: 'qa',
    label: 'QA-инженер',
    keywords: ['qa', 'тестировщик', 'quality assurance', 'тестирование', 'автотесты'],
    title: 'QA Engineer',
    summary:
      'QA-инженер с опытом тестирования веб- и мобильных продуктов. Строю тестовые процессы с нуля, автоматизирую регрессию и работаю в тесной связке с разработкой. Ценю воспроизводимые баг-репорты и прозрачные метрики качества.',
    skills: ['Playwright', 'Postman', 'SQL', 'Charles', 'TestRail', 'REST API', 'CI/CD', 'Jira'],
    bullets: [
      'Автоматизировал регрессионный набор из 250 кейсов — время прогона сократилось с 3 дней до 40 минут',
      'Внедрил процесс тест-дизайна и снизил количество прод-багов на 40%',
      'Настроил тестовые окружения и тестовые данные для команды из 12 человек',
    ],
  },
  {
    id: 'product',
    label: 'Продуктовый менеджер',
    keywords: ['product', 'продукт', 'менеджер продукта', 'product manager', 'pm'],
    title: 'Product Manager',
    summary:
      'Продуктовый менеджер с фокусом на данных и пользовательские исследования. Отвечаю за discovery, приоритизацию и метрики продукта. Умею собирать команду вокруг гипотез и доводить их до измеримого результата.',
    skills: ['Product Discovery', 'A/B-тесты', 'SQL', 'Amplitude', 'Figma', 'Jira', 'Юнит-экономика', 'Roadmap'],
    bullets: [
      'Увеличил retention 30-дневной когорты на 18% через переработку онбординга',
      'Запустил A/B-платформу и сократил цикл проверки гипотез с 6 до 2 недель',
      'Сформировал роадмап на 3 квартала и синхронизировал 5 команд разработки',
    ],
  },
  {
    id: 'designer',
    label: 'UI/UX дизайнер',
    keywords: ['designer', 'дизайнер', 'ui', 'ux', 'product design', 'figma'],
    title: 'Product Designer',
    summary:
      'Продуктовый дизайнер: от исследований до готовых макетов и дизайн-системы. Проверяю решения на пользователях и метриках, работаю в тесной связке с разработкой. Слежу за консистентностью и доступностью интерфейсов.',
    skills: ['Figma', 'Дизайн-системы', 'Прототипирование', 'UX-исследования', 'Wireframes', 'Accessibility', 'Анимация', 'Design tokens'],
    bullets: [
      'Переработал ключевой сценарий покупки и увеличил конверсию на 22%',
      'Создал дизайн-систему из 120 компонентов, которой пользуются 4 продуктовые команды',
      'Провёл 30 интервью с пользователями и заложил результаты в роадмап',
    ],
  },
  {
    id: 'analyst',
    label: 'Аналитик данных',
    keywords: ['analyst', 'аналитик', 'данные', 'data', 'bi', 'sql', 'dashboard'],
    title: 'Data Analyst',
    summary:
      'Аналитик данных с опытом построения отчётности и продуктовой аналитики. Превращаю сырые данные в решения: собираю метрики, проверяю гипотезы, строю дашборды. Работаю с SQL, Python и BI-инструментами.',
    skills: ['SQL', 'Python (pandas)', 'Tableau', 'Power BI', 'A/B-тесты', 'Airflow', 'Статистика', 'Excel'],
    bullets: [
      'Построил систему продуктовых метрик и дашбордов, которой пользуются 6 команд',
      'Выявил причину падения конверсии и вернул 12% потерянной выручки',
      'Автоматизировал отчётность, освободив 20 часов работы команды в месяц',
    ],
  },
  {
    id: 'marketing',
    label: 'Маркетолог',
    keywords: ['marketing', 'маркетолог', 'smm', 'performance', 'ppc', 'реклама'],
    title: 'Digital Marketing Manager',
    summary:
      'Digital-маркетолог с опытом управления платным трафиком и контент-стратегией. Считаю юнит-экономику, тестирую гипотезы и масштабирую работающие каналы. Ориентируюсь на CAC, LTV и ROMI.',
    skills: ['Яндекс.Директ', 'Google Ads', 'GA4', 'Юнит-экономика', 'Email-маркетинг', 'SEO', 'CRM', 'Аналитика'],
    bullets: [
      'Снизил CAC на 28% при росте объёма заявок на 40%',
      'Запустил контент-направление, которое приносит 30% органического трафика',
      'Выстроил сквозную аналитику по всем каналам привлечения',
    ],
  },
  {
    id: 'sales',
    label: 'Менеджер по продажам',
    keywords: ['sales', 'продажи', 'менеджер по продажам', 'account manager', 'b2b'],
    title: 'Sales Manager',
    summary:
      'Менеджер по продажам с опытом работы с B2B-клиентами и длинным циклом сделки. Веду клиента от первого контакта до подписания и развития аккаунта. Работаю с CRM-дисциплиной и прогнозом выручки.',
    skills: ['B2B-продажи', 'CRM (amoCRM)', 'Переговоры', 'Презентации', 'Холодные звонки', 'Работа с возражениями', 'Excel', 'Прогнозирование'],
    bullets: [
      'Выполнял план продаж на 110–130% в течение 8 кварталов подряд',
      'Увеличил средний чек на 20% за счёт пакетных предложений',
      'Сократил цикл сделки на 15% через скрипты квалификации',
    ],
  },
  {
    id: 'hr',
    label: 'HR-специалист',
    keywords: ['hr', 'рекрутер', 'recruiter', 'подбор', 'кадры', 'people'],
    title: 'HR Specialist',
    summary:
      'HR-специалист с опытом полного цикла подбора и развития бренда работодателя. Закрываю технические и продуктовые вакансии, выстраиваю воронку и работаю с обратной связью кандидатов.',
    skills: ['Рекрутмент', 'Sourcing', 'Интервью', 'ATS', 'Employer Brand', 'Onboarding', 'Аналитика найма', 'Коммуникация'],
    bullets: [
      'Закрывал 8–10 технических вакансий в месяц со средним сроком 21 день',
      'Снизил отток на испытательном сроке на 18% через новый онбординг',
      'Выстроил процесс интервью для 4 продуктовых команд',
    ],
  },
];

const ACTION_VERBS = [
  'Увеличил',
  'Снизил',
  'Запустил',
  'Внедрил',
  'Автоматизировал',
  'Оптимизировал',
  'Спроектировал',
  'Возглавил',
  'Переработал',
  'Масштабировал',
  'Ускорил',
  'Сократил',
];

const WEAK_STARTS: Record<string, string> = {
  'работал над': 'Разработал',
  'занимался': 'Отвечал за',
  'участвовал в': 'Внёс вклад в',
  'помогал': 'Поддержал',
  'делал': 'Создал',
  'отвечал за': 'Отвечал за',
  'был ответственным за': 'Отвечал за',
  'responsible for': 'Led',
  'worked on': 'Delivered',
  'helped': 'Supported',
};

export function findRolePreset(query: string): RolePreset | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  let best: { preset: RolePreset; score: number } | null = null;
  for (const preset of ROLE_PRESETS) {
    let score = 0;
    if (preset.label.toLowerCase().includes(q) || q.includes(preset.title.toLowerCase())) {
      score += 3;
    }
    for (const keyword of preset.keywords) {
      if (q.includes(keyword)) score += 2;
    }
    if (score > 0 && (!best || score > best.score)) best = { preset, score };
  }
  return best?.preset ?? null;
}

export function suggestSkillsFor(title: string): string[] {
  return findRolePreset(title)?.skills ?? [];
}

export function suggestBulletsFor(title: string): string[] {
  return findRolePreset(title)?.bullets ?? [];
}

/** Offline summary generator — no key required. */
export function generateSummary(data: ResumeData, role = data.personal.jobTitle): string {
  const preset = findRolePreset(role);
  const years = estimateYears(data);
  const companies = data.experience
    .map((e) => e.company)
    .filter(Boolean)
    .slice(0, 3);
  const skills = data.skills
    .map((s) => s.name)
    .filter(Boolean)
    .slice(0, 4);

  const focus = skills.length
    ? `Ключевые компетенции: ${skills.join(', ')}.`
    : preset
      ? `Ключевые компетенции: ${preset.skills.slice(0, 4).join(', ')}.`
      : '';

  const experienceLine = years
    ? `Опыт работы — ${years} ${yearsWord(years)}${companies.length ? ` в ${companies.join(', ')}` : ''}.`
    : companies.length
      ? `Опыт работы: ${companies.join(', ')}.`
      : '';

  const base =
    preset?.summary ??
    `Специалист с опытом в роли «${role || 'специалист'}». Отвечаю за результат, умею расставлять приоритеты и работать в команде.`;

  return [base, experienceLine, focus].filter(Boolean).join(' ');
}

export function estimateYears(data: ResumeData): number {
  let months = 0;
  for (const exp of data.experience) {
    if (!exp.startDate) continue;
    const [sy, sm] = exp.startDate.split('-').map(Number);
    if (!sy) continue;
    const now = new Date();
    const [ey, em] = exp.current
      ? [now.getFullYear(), now.getMonth() + 1]
      : exp.endDate
        ? exp.endDate.split('-').map(Number)
        : [sy, sm];
    const total = (ey - sy) * 12 + ((em || 1) - (sm || 1));
    months += Math.max(0, total);
  }
  return Math.round(months / 12);
}

function yearsWord(years: number): string {
  const mod10 = years % 10;
  const mod100 = years % 100;
  if (mod10 === 1 && mod100 !== 11) return 'год';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'года';
  return 'лет';
}

export interface BulletSuggestion {
  original: string;
  improved: string;
  note: string;
}

/** Offline "AI" rewrite: replaces weak verbs, adds action verb, keeps meaning. */
export function improveBulletLocal(text: string): BulletSuggestion {
  const trimmed = text.trim();
  if (!trimmed) return { original: text, improved: text, note: 'Пустая строка' };
  let improved = trimmed;
  let note = 'Формулировка усилена глаголом действия';

  for (const [weak, strong] of Object.entries(WEAK_STARTS)) {
    const re = new RegExp(`^${weak}\\s+`, 'i');
    if (re.test(improved)) {
      improved = improved.replace(re, `${strong} `);
      note = `«${weak}» → «${strong}»`;
      break;
    }
  }

  if (!improved.includes('%') && !/\d/.test(improved)) {
    improved = `${improved.replace(/[.;]$/, '')} — [добавьте метрику: %, ₽, кол-во]`;
    note = 'Добавлен слот для измеримого результата';
  }

  improved = improved.charAt(0).toUpperCase() + improved.slice(1);
  if (!/[.!?]$/.test(improved)) improved += '.';

  return { original: trimmed, improved, note };
}

export function actionVerbs(): string[] {
  return [...ACTION_VERBS];
}

const SKILL_POOL: Record<string, string[]> = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Redux', 'Tailwind CSS', 'Vite', 'Jest', 'Storybook'],
  backend: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'RabbitMQ', 'gRPC', 'Linux'],
  design: ['Figma', 'Дизайн-системы', 'Прототипирование', 'UX-исследования', 'Анимация', 'Accessibility'],
  management: ['Управление командой', 'Roadmap', 'OKR', 'Стратегия', 'Переговоры', 'Бюджетирование'],
};

/** Quick skill suggestions from the current role. */
export function skillSuggestions(title: string): string[] {
  const pool = new Set<string>();
  for (const preset of ROLE_PRESETS) {
    if (
      title &&
      (preset.title.toLowerCase().includes(title.toLowerCase().slice(0, 6)) ||
        preset.keywords.some((k) => title.toLowerCase().includes(k)))
    ) {
      preset.skills.forEach((s) => pool.add(s));
    }
  }
  if (!pool.size) {
    Object.values(SKILL_POOL).forEach((list) => list.slice(0, 3).forEach((s) => pool.add(s)));
  }
  return [...pool].slice(0, 14);
}
