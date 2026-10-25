import { ColorScheme, FontOption, ResumeLocale, Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Цветная шапка, одна колонка, аккуратные блоки',
    layout: 'single-column',
    photoPosition: 'header-right',
    tone: 'light',
    sidebarSections: [],
    accentStyle: 'band',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Тёмная боковая панель слева, контакты и навыки',
    layout: 'two-columns-left',
    photoPosition: 'sidebar',
    tone: 'dark',
    sidebarSections: ['skills', 'languages', 'certifications'],
    accentStyle: 'sidebar',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Строгая двухколоночная сетка, панель справа',
    layout: 'two-columns-right',
    photoPosition: 'sidebar',
    tone: 'light',
    sidebarSections: ['skills', 'languages', 'certifications'],
    accentStyle: 'line',
  },
  {
    id: 'minimal',
    name: 'Minimal ATS',
    description: 'Максимум текста и парсинг — без панелей и графики',
    layout: 'single-column',
    photoPosition: 'hidden',
    tone: 'light',
    sidebarSections: [],
    accentStyle: 'minimal',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Лента опыта с маркерами и датами слева',
    layout: 'single-column',
    photoPosition: 'header-right',
    tone: 'light',
    sidebarSections: [],
    accentStyle: 'line',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Серифная типографика, тонкие линии, фотография',
    layout: 'two-columns-right',
    photoPosition: 'sidebar',
    tone: 'light',
    sidebarSections: ['skills', 'languages', 'certifications'],
    accentStyle: 'serif',
  },
];

export const PALETTES: ColorScheme[] = [
  {
    id: 'indigo',
    name: 'Indigo',
    primary: '#3730A3',
    accent: '#6366F1',
    background: '#F7F7FF',
    text: '#1E1B4B',
    sidebar: '#312E81',
    gradientFrom: '#312E81',
    gradientTo: '#6366F1',
  },
  {
    id: 'slate',
    name: 'Graphite',
    primary: '#1F2937',
    accent: '#4B5563',
    background: '#F8FAFC',
    text: '#111827',
    sidebar: '#111827',
    gradientFrom: '#111827',
    gradientTo: '#4B5563',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    primary: '#075985',
    accent: '#0EA5E9',
    background: '#F0F9FF',
    text: '#082F49',
    sidebar: '#0C4A6E',
    gradientFrom: '#0C4A6E',
    gradientTo: '#0EA5E9',
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#14532D',
    accent: '#22C55E',
    background: '#F3FBF5',
    text: '#052E16',
    sidebar: '#14532D',
    gradientFrom: '#14532D',
    gradientTo: '#22C55E',
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    primary: '#7F1D1D',
    accent: '#DC2626',
    background: '#FEF6F6',
    text: '#450A0A',
    sidebar: '#7F1D1D',
    gradientFrom: '#7F1D1D',
    gradientTo: '#DC2626',
  },
  {
    id: 'aubergine',
    name: 'Aubergine',
    primary: '#581C87',
    accent: '#A855F7',
    background: '#FBF6FF',
    text: '#2E1065',
    sidebar: '#581C87',
    gradientFrom: '#581C87',
    gradientTo: '#A855F7',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    primary: '#9A3412',
    accent: '#F97316',
    background: '#FFF8F2',
    text: '#431407',
    sidebar: '#9A3412',
    gradientFrom: '#9A3412',
    gradientTo: '#F97316',
  },
  {
    id: 'teal',
    name: 'Teal',
    primary: '#115E59',
    accent: '#14B8A6',
    background: '#F1FBF9',
    text: '#042F2E',
    sidebar: '#134E4A',
    gradientFrom: '#134E4A',
    gradientTo: '#2DD4BF',
  },
];

export const FONT_OPTIONS: { value: FontOption; label: string; css: string; sample: string }[] = [
  {
    value: 'sans',
    label: 'Sans — Inter',
    css: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    sample: 'Чёткий и современный',
  },
  {
    value: 'serif',
    label: 'Serif — Source Serif',
    css: "'Source Serif 4', Georgia, 'Times New Roman', serif",
    sample: 'Спокойный и строгий',
  },
  {
    value: 'display',
    label: 'Display — Playfair',
    css: "'Playfair Display', Georgia, serif",
    sample: 'Элегантный акцент',
  },
  {
    value: 'mono',
    label: 'Mono — JetBrains',
    css: "'JetBrains Mono', 'Courier New', monospace",
    sample: 'Технический стиль',
  },
];

export const SPACING_OPTIONS: { value: 'compact' | 'normal' | 'comfortable'; label: string; px: number }[] = [
  { value: 'compact', label: 'Плотно', px: 13 },
  { value: 'normal', label: 'Обычно', px: 19 },
  { value: 'comfortable', label: 'Свободно', px: 26 },
];

export const PROFICIENCY_LABELS: Record<string, string> = {
  A1: 'A1 · Beginner',
  A2: 'A2 · Elementary',
  B1: 'B1 · Intermediate',
  B2: 'B2 · Upper-Int.',
  C1: 'C1 · Advanced',
  C2: 'C2 · Proficient',
  Native: 'Native / Родной',
};

export const PROFICIENCY_SHORT: Record<string, string> = {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2',
  Native: 'Native',
};

export const LOCALES: { value: ResumeLocale; label: string; flag: string }[] = [
  { value: 'ru', label: 'Русский', flag: 'RU' },
  { value: 'en', label: 'English', flag: 'EN' },
];

export const PHOTO_SHAPES = [
  { value: 'circle', label: 'Круг' },
  { value: 'rounded', label: 'Скругление' },
  { value: 'square', label: 'Квадрат' },
] as const;

export const AI_PRESETS = [
  { id: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { id: 'openrouter', label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1', model: 'openai/gpt-4o-mini' },
  { id: 'groq', label: 'Groq', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  { id: 'custom', label: 'Свой endpoint', baseUrl: '', model: '' },
] as const;
