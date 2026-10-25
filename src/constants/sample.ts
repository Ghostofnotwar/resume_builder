import { ResumeConfig, ResumeData } from '../types';
import { PALETTES, TEMPLATES } from '../constants';
import { DEFAULT_SECTION_ORDER } from '../lib/sections';

export const DEFAULT_CONFIG: ResumeConfig = {
  templateId: 'classic',
  colorScheme: PALETTES[0],
  font: 'sans',
  spacing: 'normal',
  locale: 'ru',
  photoShape: 'circle',
  showPhoto: true,
  textScale: 1,
  paperTint: true,
  showSkillLevels: true,
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

export const DEMO_DATA: ResumeData = {
  personal: {
    fullName: 'Александр Иванов',
    jobTitle: 'Senior Frontend Developer',
    email: 'alex.ivanov@email.com',
    phone: '+7 (999) 123-45-67',
    location: 'Москва, Россия',
    photo: '',
    links: [
      { id: 'l1', label: 'LinkedIn', url: 'linkedin.com/in/alexivanov' },
      { id: 'l2', label: 'GitHub', url: 'github.com/alexivanov' },
      { id: 'l3', label: 'Портфолио', url: 'alexivanov.dev' },
    ],
  },
  summary:
    'Frontend-разработчик с 6+ годами опыта в продуктовых командах. Специализируюсь на React, TypeScript и проектировании дизайн-систем. Снижал время загрузки ключевых сценариев на 40%, выстраивал процессы код-ревью и менторства. Ищу роль, где можно совмещать разработку сложных интерфейсов и техническое лидерство.',
  experience: [
    {
      id: 'e1',
      company: 'TechCorp',
      position: 'Senior Frontend Developer',
      location: 'Москва',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Продуктовая SaaS-платформа для аналитики, 200k+ активных пользователей.',
      highlights: [
        'Снизил время загрузки дашборда с 4.2 до 2.5 секунд за счёт code-splitting и кэширования',
        'Спроектировал дизайн-систему из 60+ компонентов — ускорил запуск фич на 30%',
        'Руководил командой из 5 разработчиков, выстроил процесс код-ревью и менторства',
        'Внедрил CI/CD на GitHub Actions и e2e-тесты, сократив регрессы на 45%',
      ],
    },
    {
      id: 'e2',
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      location: 'Санкт-Петербург',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: 'B2B-сервис автоматизации закупок, команда из 12 человек.',
      highlights: [
        'Перевёл интерфейс с jQuery на React и TypeScript без остановки релизов',
        'Оптимизировал таблицы с 10k+ строк — рендер ускорился в 6 раз',
        'Настроил мониторинг ошибок и снизил их количество на 60%',
      ],
    },
  ],
  education: [
    {
      id: 'ed1',
      institution: 'МГУ им. М. В. Ломоносова',
      degree: 'Бакалавр',
      field: 'Прикладная математика и информатика',
      startYear: '2015',
      endYear: '2019',
      location: 'Москва',
    },
  ],
  skills: [
    { id: 's1', name: 'React', level: 5, category: 'Frontend' },
    { id: 's2', name: 'TypeScript', level: 5, category: 'Frontend' },
    { id: 's3', name: 'Next.js', level: 4, category: 'Frontend' },
    { id: 's4', name: 'Node.js', level: 4, category: 'Backend' },
    { id: 's5', name: 'GraphQL', level: 3, category: 'Backend' },
    { id: 's6', name: 'Docker', level: 3, category: 'DevOps' },
    { id: 's7', name: 'Figma', level: 4, category: 'Design' },
  ],
  languages: [
    { id: 'lg1', name: 'Русский', proficiency: 'Native' },
    { id: 'lg2', name: 'Английский', proficiency: 'C1' },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Resume Studio',
      role: 'Автор и мейнтейнер',
      url: 'github.com/alexivanov/resume-studio',
      startDate: '2023-01',
      endDate: '',
      description: 'Open-source конструктор резюме с экспортом в PDF.',
      highlights: ['1.2k звёзд на GitHub', '100% покрытие типов, zero-dependency рендер'],
    },
  ],
  certifications: [
    { id: 'c1', name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2023', url: '' },
    { id: 'c2', name: 'Professional Scrum Master I', issuer: 'Scrum.org', date: '2022', url: '' },
  ],
  customSections: [],
};

export const BLANK_DATA: ResumeData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    photo: '',
    links: [],
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  customSections: [],
};

export function blankConfig(templateId = 'classic'): ResumeConfig {
  const template = TEMPLATES.find((t) => t.id === templateId);
  return {
    ...DEFAULT_CONFIG,
    templateId: template?.id ?? 'classic',
    sectionOrder: DEFAULT_SECTION_ORDER,
    hiddenSections: [],
  };
}
