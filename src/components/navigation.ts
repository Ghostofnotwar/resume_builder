import { EditorTab } from '../types';
import { IconName } from './ui/Icon';

export interface TabMeta {
  id: EditorTab;
  label: string;
  short: string;
  icon: IconName;
  title: string;
  description: string;
}

export const TAB_META: TabMeta[] = [
  {
    id: 'personal',
    label: 'Личные данные',
    short: 'Личные',
    icon: 'user',
    title: 'Личные данные и профиль',
    description: 'Имя, контакты, фото и короткий рассказ о себе — то, что видно первым.',
  },
  {
    id: 'experience',
    label: 'Опыт работы',
    short: 'Опыт',
    icon: 'briefcase',
    title: 'Опыт работы',
    description: 'Места работы и достижения с измеримым результатом. Начните с последнего.',
  },
  {
    id: 'education',
    label: 'Образование',
    short: 'Учёба',
    icon: 'graduation',
    title: 'Образование',
    description: 'Вузы, программы и годы обучения.',
  },
  {
    id: 'skills',
    label: 'Навыки',
    short: 'Навыки',
    icon: 'zap',
    title: 'Навыки',
    description: 'Технологии и инструменты. 6–12 навыков — оптимально.',
  },
  {
    id: 'projects',
    label: 'Проекты',
    short: 'Проекты',
    icon: 'folder',
    title: 'Проекты',
    description: 'Пет-проекты, кейсы и опенсорс с ролью и результатом.',
  },
  {
    id: 'certifications',
    label: 'Сертификаты',
    short: 'Сертиф.',
    icon: 'award',
    title: 'Сертификаты и курсы',
    description: 'Подтверждения экспертизы: AWS, Scrum, Coursera и другие.',
  },
  {
    id: 'languages',
    label: 'Языки',
    short: 'Языки',
    icon: 'globe',
    title: 'Языки',
    description: 'Языки и уровень владения по CEFR.',
  },
  {
    id: 'custom',
    label: 'Доп. разделы',
    short: 'Доп.',
    icon: 'layers',
    title: 'Дополнительные разделы',
    description: 'Публикации, выступления, волонтёрство — любые свои блоки.',
  },
  {
    id: 'design',
    label: 'Дизайн',
    short: 'Дизайн',
    icon: 'palette',
    title: 'Дизайн резюме',
    description: 'Шаблон, палитра, шрифт, плотность и порядок разделов.',
  },
  {
    id: 'ai',
    label: 'ИИ-ассистент',
    short: 'ИИ',
    icon: 'sparkles',
    title: 'ИИ-ассистент',
    description: 'Импорт текста, генерация формулировок и подключение модели.',
  },
  {
    id: 'quality',
    label: 'Проверка резюме',
    short: 'Проверка',
    icon: 'gauge',
    title: 'Проверка резюме',
    description: 'ATS-анализ, метрики, ключевые слова из вакансии и советы.',
  },
  {
    id: 'library',
    label: 'Библиотека',
    short: 'Файлы',
    icon: 'library',
    title: 'Библиотека и файлы',
    description: 'Версии под разные вакансии, бэкапы и импорт.',
  },
];

export const NAV_GROUPS: { title: string; items: EditorTab[] }[] = [
  { title: 'Содержание', items: ['personal', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'custom'] },
  { title: 'Оформление', items: ['design'] },
  { title: 'Помощники', items: ['ai', 'quality'] },
  { title: 'Документ', items: ['library'] },
];

export function tabMeta(id: EditorTab): TabMeta {
  return TAB_META.find((tab) => tab.id === id) ?? TAB_META[0];
}
