import { ResumeConfig, ResumeData, ResumeLocale } from '../types';

export type SectionId =
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'languages'
  | 'certifications'
  | `custom:${string}`;

export interface SectionDef {
  id: SectionId;
  icon: string;
  label: Record<ResumeLocale, string>;
}

export const SECTION_DEFS: SectionDef[] = [
  { id: 'summary', icon: 'user', label: { ru: 'О себе', en: 'Summary' } },
  { id: 'experience', icon: 'briefcase', label: { ru: 'Опыт работы', en: 'Experience' } },
  { id: 'education', icon: 'graduation', label: { ru: 'Образование', en: 'Education' } },
  { id: 'projects', icon: 'folder', label: { ru: 'Проекты', en: 'Projects' } },
  { id: 'skills', icon: 'zap', label: { ru: 'Навыки', en: 'Skills' } },
  { id: 'languages', icon: 'globe', label: { ru: 'Языки', en: 'Languages' } },
  { id: 'certifications', icon: 'award', label: { ru: 'Сертификаты', en: 'Certifications' } },
];

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'languages',
  'certifications',
];

/** Order used for the sidebar of two-column templates. */
export const SIDEBAR_ORDER: SectionId[] = ['skills', 'languages', 'certifications'];

export function customSectionId(id: string): SectionId {
  return `custom:${id}`;
}

export function sectionLabel(
  id: string,
  locale: ResumeLocale,
  data?: ResumeData
): string {
  const found = SECTION_DEFS.find((s) => s.id === id);
  if (found) return found.label[locale];
  if (id.startsWith('custom:')) {
    const customId = id.slice(7);
    const section = data?.customSections.find((s) => s.id === customId);
    return section?.title || (locale === 'ru' ? 'Дополнительно' : 'Additional');
  }
  return id;
}

export function sectionIcon(id: string): string {
  const found = SECTION_DEFS.find((s) => s.id === id);
  if (found) return found.icon;
  return id.startsWith('custom:') ? 'layers' : 'file';
}

/** All section ids for the current document, including custom sections. */
export function allSectionIds(data: ResumeData, config: ResumeConfig): SectionId[] {
  const custom = data.customSections.map((s) => customSectionId(s.id));
  const base = config.sectionOrder.filter(
    (id) => SECTION_DEFS.some((s) => s.id === id) || id.startsWith('custom:')
  );
  const missing = [...DEFAULT_SECTION_ORDER, ...custom].filter((id) => !base.includes(id));
  return [...base, ...missing] as SectionId[];
}

export function isSectionVisible(config: ResumeConfig, id: string): boolean {
  return !config.hiddenSections.includes(id);
}

export function hasSectionContent(data: ResumeData, id: string): boolean {
  switch (id) {
    case 'summary':
      return Boolean(data.summary.trim());
    case 'experience':
      return data.experience.length > 0;
    case 'education':
      return data.education.length > 0;
    case 'projects':
      return data.projects.length > 0;
    case 'skills':
      return data.skills.length > 0;
    case 'languages':
      return data.languages.length > 0;
    case 'certifications':
      return data.certifications.length > 0;
    default: {
      if (id.startsWith('custom:')) {
        const customId = id.slice(7);
        const section = data.customSections.find((s) => s.id === customId);
        return Boolean(section && section.items.length > 0);
      }
      return false;
    }
  }
}

export function orderedSections(
  data: ResumeData,
  config: ResumeConfig,
  target: 'main' | 'sidebar'
): SectionId[] {
  const ids = allSectionIds(data, config).filter((id) => {
    if (!isSectionVisible(config, id) || !hasSectionContent(data, id)) return false;
    const template = config.templateId;
    const isTwoCol = template === 'modern' || template === 'executive' || template === 'elegant';
    const inSidebar = SIDEBAR_ORDER.includes(id as SectionId);
    if (target === 'sidebar') return isTwoCol && inSidebar;
    return !(isTwoCol && inSidebar);
  });
  return ids;
}
