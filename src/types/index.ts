export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface Personal {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  photo: string; // base64 data-url
  links: SocialLink[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string; // YYYY-MM
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  location?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
  category?: string;
}

export type Proficiency = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

export interface Language {
  id: string;
  name: string;
  proficiency: Proficiency;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  url: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

export interface ResumeData {
  personal: Personal;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
}

export type FontOption = 'sans' | 'serif' | 'display' | 'mono';
export type SpacingOption = 'compact' | 'normal' | 'comfortable';
export type LayoutType = 'single-column' | 'two-columns-left' | 'two-columns-right';
export type PhotoPosition = 'header-right' | 'sidebar' | 'hidden';
export type PhotoShape = 'circle' | 'rounded' | 'square';
export type ResumeLocale = 'ru' | 'en';

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
  sidebar?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  layout: LayoutType;
  photoPosition: PhotoPosition;
  tone: 'light' | 'dark' | 'mixed';
  /** Section ids that this template places in the sidebar (when it has one). */
  sidebarSections: string[];
  accentStyle: 'band' | 'line' | 'sidebar' | 'minimal' | 'serif';
}

export interface ResumeConfig {
  templateId: string;
  colorScheme: ColorScheme;
  font: FontOption;
  spacing: SpacingOption;
  locale: ResumeLocale;
  photoShape: PhotoShape;
  showPhoto: boolean;
  /** Global type multiplier, 0.9 – 1.12 */
  textScale: number;
  /** Tint the page background with the palette colour */
  paperTint: boolean;
  /** Render skill proficiency bars instead of tags */
  showSkillLevels: boolean;
  sectionOrder: string[];
  hiddenSections: string[];
}

export interface SavedResume {
  id: string;
  name: string;
  updatedAt: number;
  data: ResumeData;
  config: ResumeConfig;
}

export type EditorTab =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'custom'
  | 'design'
  | 'ai'
  | 'quality'
  | 'library';

export interface AiSettings {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface QualityCheck {
  id: string;
  label: string;
  status: 'pass' | 'warn' | 'fail';
  hint: string;
  weight: number;
}

export interface QualityReport {
  score: number;
  checks: QualityCheck[];
  matchedKeywords: string[];
  missingKeywords: string[];
  wordCount: number;
  hasVacancy: boolean;
}
