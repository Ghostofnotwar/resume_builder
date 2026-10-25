import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Certification,
  ColorScheme,
  CustomItem,
  CustomSection,
  Education,
  Experience,
  Language,
  Project,
  ResumeConfig,
  ResumeData,
  SavedResume,
  Skill,
  SocialLink,
} from '../types';
import { BLANK_DATA, DEFAULT_CONFIG, DEMO_DATA, blankConfig } from '../constants/sample';
import { DEFAULT_SECTION_ORDER } from '../lib/sections';
import { uid } from '../utils';

interface Snapshot {
  data: ResumeData;
  config: ResumeConfig;
}

export interface ResumeStore {
  data: ResumeData;
  config: ResumeConfig;
  library: SavedResume[];
  docName: string;
  savedAt: number;
  past: Snapshot[];
  future: Snapshot[];

  /* ── personal ── */
  updatePersonal: (personal: Partial<ResumeData['personal']>) => void;
  updateSummary: (summary: string) => void;
  addLink: (link?: Partial<SocialLink>) => void;
  updateLink: (id: string, patch: Partial<SocialLink>) => void;
  removeLink: (id: string) => void;

  /* ── experience ── */
  addExperience: (exp?: Partial<Experience>) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  moveExperience: (id: string, direction: -1 | 1) => void;
  reorderExperience: (from: number, to: number) => void;

  /* ── education ── */
  addEducation: (edu?: Partial<Education>) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  moveEducation: (id: string, direction: -1 | 1) => void;
  reorderEducation: (from: number, to: number) => void;

  /* ── skills ── */
  addSkill: (skill?: Partial<Skill>) => void;
  addSkillsBulk: (names: string[]) => void;
  updateSkill: (id: string, patch: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  moveSkill: (id: string, direction: -1 | 1) => void;
  reorderSkills: (from: number, to: number) => void;

  /* ── languages ── */
  addLanguage: (lang?: Partial<Language>) => void;
  updateLanguage: (id: string, patch: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  /* ── projects ── */
  addProject: (project?: Partial<Project>) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  moveProject: (id: string, direction: -1 | 1) => void;
  reorderProjects: (from: number, to: number) => void;

  /* ── certifications ── */
  addCertification: (cert?: Partial<Certification>) => void;
  updateCertification: (id: string, patch: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  /* ── custom sections ── */
  addCustomSection: (title?: string) => string;
  updateCustomSection: (id: string, patch: Partial<Omit<CustomSection, 'items'>>) => void;
  removeCustomSection: (id: string) => void;
  addCustomItem: (sectionId: string, item?: Partial<CustomItem>) => void;
  updateCustomItem: (sectionId: string, itemId: string, patch: Partial<CustomItem>) => void;
  removeCustomItem: (sectionId: string, itemId: string) => void;

  /* ── design ── */
  setTemplate: (templateId: string) => void;
  setPalette: (scheme: ColorScheme) => void;
  setAccent: (hex: string) => void;
  setFont: (font: ResumeConfig['font']) => void;
  setSpacing: (spacing: ResumeConfig['spacing']) => void;
  setLocale: (locale: ResumeConfig['locale']) => void;
  setPhotoShape: (shape: ResumeConfig['photoShape']) => void;
  setShowPhoto: (value: boolean) => void;
  setTextScale: (value: number) => void;
  setPaperTint: (value: boolean) => void;
  setShowSkillLevels: (value: boolean) => void;
  toggleSection: (id: string) => void;
  moveSection: (id: string, direction: -1 | 1) => void;
  resetDesign: () => void;

  /* ── document ── */
  setDocName: (name: string) => void;
  newBlank: () => void;
  loadDemo: () => void;
  replaceData: (data: ResumeData) => void;
  importState: (payload: { data?: ResumeData; config?: ResumeConfig; docName?: string }) => boolean;
  saveToLibrary: () => void;
  loadFromLibrary: (id: string) => void;
  deleteFromLibrary: (id: string) => void;
  duplicateCurrent: () => void;

  /* ── history ── */
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

let lastCommitAt = 0;

function nextHistory(s: ResumeStore): Pick<ResumeStore, 'past' | 'future' | 'savedAt'> {
  const now = Date.now();
  const grouped = now - lastCommitAt < 400 && s.past.length > 0;
  lastCommitAt = now;
  const snapshot: Snapshot = { data: s.data, config: s.config };
  return {
    past: grouped ? s.past : [...s.past.slice(-59), snapshot],
    future: [],
    savedAt: now,
  };
}

function reorder<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function move<T extends { id: string }>(list: T[], id: string, direction: -1 | 1): T[] {
  const index = list.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

const emptyExperience = (): Experience => ({
  id: uid(),
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  highlights: [],
});

const emptyEducation = (): Education => ({
  id: uid(),
  institution: '',
  degree: '',
  field: '',
  startYear: '',
  endYear: '',
  location: '',
});

const emptyProject = (): Project => ({
  id: uid(),
  name: '',
  role: '',
  url: '',
  startDate: '',
  endDate: '',
  description: '',
  highlights: [],
});

const emptyCertification = (): Certification => ({
  id: uid(),
  name: '',
  issuer: '',
  date: '',
  url: '',
});

function isResumeData(value: unknown): value is ResumeData {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.personal === 'object' && 'personal' in candidate;
}

/** Merge imported / legacy data over a blank document so missing arrays never crash render. */
export function normalizeData(input: unknown): ResumeData {
  const base: ResumeData = {
    ...BLANK_DATA,
    personal: { ...BLANK_DATA.personal, links: [] },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certifications: [],
    customSections: [],
  };
  if (!isResumeData(input)) return base;
  return {
    personal: {
      ...base.personal,
      ...input.personal,
      links: Array.isArray(input.personal?.links) ? input.personal.links : [],
    },
    summary: input.summary ?? '',
    experience: Array.isArray(input.experience) ? input.experience : [],
    education: Array.isArray(input.education) ? input.education : [],
    skills: Array.isArray(input.skills) ? input.skills : [],
    languages: Array.isArray(input.languages) ? input.languages : [],
    projects: Array.isArray(input.projects) ? input.projects : [],
    certifications: Array.isArray(input.certifications) ? input.certifications : [],
    customSections: Array.isArray(input.customSections) ? input.customSections : [],
  };
}

export function normalizeConfig(input: unknown): ResumeConfig {
  const candidate = (input ?? {}) as Partial<ResumeConfig>;
  return {
    ...DEFAULT_CONFIG,
    ...candidate,
    colorScheme: { ...DEFAULT_CONFIG.colorScheme, ...(candidate.colorScheme ?? {}) },
    sectionOrder:
      Array.isArray(candidate.sectionOrder) && candidate.sectionOrder.length
        ? candidate.sectionOrder
        : DEFAULT_SECTION_ORDER,
    hiddenSections: Array.isArray(candidate.hiddenSections) ? candidate.hiddenSections : [],
  };
}

/** Migrate the previous app version (localStorage key resume-builder-v2). */
function readLegacy(): { data: ResumeData; config: ResumeConfig } | null {
  try {
    const raw = localStorage.getItem('resume-builder-v2');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const state = parsed?.state ?? parsed;
    if (!state?.data) return null;
    return { data: normalizeData(state.data), config: normalizeConfig(state.config) };
  } catch {
    return null;
  }
}

const legacy = typeof window !== 'undefined' ? readLegacy() : null;

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      data: legacy?.data ?? DEMO_DATA,
      config: legacy?.config ?? DEFAULT_CONFIG,
      library: [],
      docName: legacy?.data?.personal?.fullName
        ? `Резюме — ${legacy.data.personal.fullName}`
        : 'Моё резюме',
      savedAt: Date.now(),
      past: [],
      future: [],

      /* ── personal ── */
      updatePersonal: (patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, personal: { ...s.data.personal, ...patch } },
        })),
      updateSummary: (summary) =>
        set((s) => ({ ...nextHistory(s), data: { ...s.data, summary } })),
      addLink: (link) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            personal: {
              ...s.data.personal,
              links: [
                ...s.data.personal.links,
                { id: uid(), label: '', url: '', ...link },
              ],
            },
          },
        })),
      updateLink: (id, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            personal: {
              ...s.data.personal,
              links: s.data.personal.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
            },
          },
        })),
      removeLink: (id) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            personal: {
              ...s.data.personal,
              links: s.data.personal.links.filter((l) => l.id !== id),
            },
          },
        })),

      /* ── experience ── */
      addExperience: (exp) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            experience: [{ ...emptyExperience(), ...exp }, ...s.data.experience],
          },
        })),
      updateExperience: (id, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            experience: s.data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, experience: s.data.experience.filter((e) => e.id !== id) },
        })),
      moveExperience: (id, direction) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, experience: move(s.data.experience, id, direction) },
        })),
      reorderExperience: (from, to) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, experience: reorder(s.data.experience, from, to) },
        })),

      /* ── education ── */
      addEducation: (edu) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, education: [...s.data.education, { ...emptyEducation(), ...edu }] },
        })),
      updateEducation: (id, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            education: s.data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) },
        })),
      moveEducation: (id, direction) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, education: move(s.data.education, id, direction) },
        })),
      reorderEducation: (from, to) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, education: reorder(s.data.education, from, to) },
        })),

      /* ── skills ── */
      addSkill: (skill) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            skills: [...s.data.skills, { id: uid(), name: '', level: 3, ...skill }],
          },
        })),
      addSkillsBulk: (names) =>
        set((s) => {
          const existing = new Set(s.data.skills.map((sk) => sk.name.toLowerCase()));
          const fresh = names
            .map((n) => n.trim())
            .filter((n) => n && !existing.has(n.toLowerCase()))
            .map((name) => ({ id: uid(), name, level: 3 }));
          if (!fresh.length) return {};
          return {
            ...nextHistory(s),
            data: { ...s.data, skills: [...s.data.skills, ...fresh] },
          };
        }),
      updateSkill: (id, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            skills: s.data.skills.map((sk) => (sk.id === id ? { ...sk, ...patch } : sk)),
          },
        })),
      removeSkill: (id) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, skills: s.data.skills.filter((sk) => sk.id !== id) },
        })),
      moveSkill: (id, direction) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, skills: move(s.data.skills, id, direction) },
        })),
      reorderSkills: (from, to) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, skills: reorder(s.data.skills, from, to) },
        })),

      /* ── languages ── */
      addLanguage: (lang) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            languages: [
              ...s.data.languages,
              { id: uid(), name: '', proficiency: 'B2', ...lang },
            ],
          },
        })),
      updateLanguage: (id, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            languages: s.data.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)),
          },
        })),
      removeLanguage: (id) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, languages: s.data.languages.filter((l) => l.id !== id) },
        })),

      /* ── projects ── */
      addProject: (project) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, projects: [...s.data.projects, { ...emptyProject(), ...project }] },
        })),
      updateProject: (id, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            projects: s.data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        })),
      removeProject: (id) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) },
        })),
      moveProject: (id, direction) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, projects: move(s.data.projects, id, direction) },
        })),
      reorderProjects: (from, to) =>
        set((s) => ({
          ...nextHistory(s),
          data: { ...s.data, projects: reorder(s.data.projects, from, to) },
        })),

      /* ── certifications ── */
      addCertification: (cert) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            certifications: [...s.data.certifications, { ...emptyCertification(), ...cert }],
          },
        })),
      updateCertification: (id, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            certifications: s.data.certifications.map((c) =>
              c.id === id ? { ...c, ...patch } : c
            ),
          },
        })),
      removeCertification: (id) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            certifications: s.data.certifications.filter((c) => c.id !== id),
          },
        })),

      /* ── custom ── */
      addCustomSection: (title) => {
        const id = uid();
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            customSections: [
              ...s.data.customSections,
              {
                id,
                title: title ?? (s.config.locale === 'en' ? 'Additional' : 'Дополнительно'),
                items: [{ id: uid(), title: '', subtitle: '', date: '', description: '' }],
              },
            ],
          },
          config: { ...s.config, sectionOrder: [...s.config.sectionOrder, `custom:${id}`] },
        }));
        return id;
      },
      updateCustomSection: (id, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            customSections: s.data.customSections.map((cs) =>
              cs.id === id ? { ...cs, ...patch } : cs
            ),
          },
        })),
      removeCustomSection: (id) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            customSections: s.data.customSections.filter((cs) => cs.id !== id),
          },
          config: {
            ...s.config,
            sectionOrder: s.config.sectionOrder.filter((sid) => sid !== `custom:${id}`),
          },
        })),
      addCustomItem: (sectionId, item) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            customSections: s.data.customSections.map((cs) =>
              cs.id === sectionId
                ? {
                    ...cs,
                    items: [
                      ...cs.items,
                      { id: uid(), title: '', subtitle: '', date: '', description: '', ...item },
                    ],
                  }
                : cs
            ),
          },
        })),
      updateCustomItem: (sectionId, itemId, patch) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            customSections: s.data.customSections.map((cs) =>
              cs.id === sectionId
                ? {
                    ...cs,
                    items: cs.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
                  }
                : cs
            ),
          },
        })),
      removeCustomItem: (sectionId, itemId) =>
        set((s) => ({
          ...nextHistory(s),
          data: {
            ...s.data,
            customSections: s.data.customSections.map((cs) =>
              cs.id === sectionId
                ? { ...cs, items: cs.items.filter((it) => it.id !== itemId) }
                : cs
            ),
          },
        })),

      /* ── design ── */
      setTemplate: (templateId) =>
        set((s) => ({ ...nextHistory(s), config: { ...s.config, templateId } })),
      setPalette: (colorScheme) =>
        set((s) => ({ ...nextHistory(s), config: { ...s.config, colorScheme } })),
      setAccent: (hex) =>
        set((s) => ({
          ...nextHistory(s),
          config: {
            ...s.config,
            colorScheme: { ...s.config.colorScheme, id: 'custom', name: 'Свой акцент', accent: hex },
          },
        })),
      setFont: (font) => set((s) => ({ ...nextHistory(s), config: { ...s.config, font } })),
      setSpacing: (spacing) =>
        set((s) => ({ ...nextHistory(s), config: { ...s.config, spacing } })),
      setLocale: (locale) => set((s) => ({ ...nextHistory(s), config: { ...s.config, locale } })),
      setPhotoShape: (photoShape) =>
        set((s) => ({ ...nextHistory(s), config: { ...s.config, photoShape } })),
      setShowPhoto: (showPhoto) =>
        set((s) => ({ ...nextHistory(s), config: { ...s.config, showPhoto } })),
      setTextScale: (textScale) =>
        set((s) => ({ ...nextHistory(s), config: { ...s.config, textScale } })),
      setPaperTint: (paperTint) =>
        set((s) => ({ ...nextHistory(s), config: { ...s.config, paperTint } })),
      setShowSkillLevels: (showSkillLevels) =>
        set((s) => ({ ...nextHistory(s), config: { ...s.config, showSkillLevels } })),
      toggleSection: (id) =>
        set((s) => {
          const hidden = s.config.hiddenSections.includes(id)
            ? s.config.hiddenSections.filter((h) => h !== id)
            : [...s.config.hiddenSections, id];
          return { ...nextHistory(s), config: { ...s.config, hiddenSections: hidden } };
        }),
      moveSection: (id, direction) =>
        set((s) => {
          const order = [...s.config.sectionOrder];
          const index = order.indexOf(id);
          const target = index + direction;
          if (index < 0 || target < 0 || target >= order.length) return {};
          [order[index], order[target]] = [order[target], order[index]];
          return { ...nextHistory(s), config: { ...s.config, sectionOrder: order } };
        }),
      resetDesign: () =>
        set((s) => ({ ...nextHistory(s), config: { ...DEFAULT_CONFIG, locale: s.config.locale } })),

      /* ── document ── */
      setDocName: (docName) => set({ docName }),
      newBlank: () =>
        set((s) => ({
          ...nextHistory(s),
          data: normalizeData(BLANK_DATA),
          config: blankConfig('classic'),
          docName: s.config.locale === 'en' ? 'New resume' : 'Новое резюме',
        })),
      loadDemo: () =>
        set((s) => ({
          ...nextHistory(s),
          data: normalizeData(DEMO_DATA),
          config: { ...DEFAULT_CONFIG, locale: s.config.locale },
          docName: s.config.locale === 'en' ? 'Sample resume' : 'Демо-резюме',
        })),
      replaceData: (data) =>
        set((s) => ({ ...nextHistory(s), data: normalizeData(data) })),
      importState: (payload) => {
        if (!payload || (!payload.data && !payload.config)) return false;
        set((s) => ({
          ...nextHistory(s),
          data: normalizeData(payload.data ?? s.data),
          config: normalizeConfig(payload.config ?? s.config),
          docName: payload.docName || s.docName,
        }));
        return true;
      },
      saveToLibrary: () =>
        set((s) => {
          const entry: SavedResume = {
            id: uid(),
            name: s.docName || s.data.personal.fullName || 'Резюме',
            updatedAt: Date.now(),
            data: s.data,
            config: s.config,
          };
          return {
            ...nextHistory(s),
            library: [entry, ...s.library.filter((l) => l.name !== entry.name)].slice(0, 30),
          };
        }),
      loadFromLibrary: (id) =>
        set((s) => {
          const entry = s.library.find((l) => l.id === id);
          if (!entry) return {};
          return {
            ...nextHistory(s),
            data: normalizeData(entry.data),
            config: normalizeConfig(entry.config),
            docName: entry.name,
          };
        }),
      deleteFromLibrary: (id) =>
        set((s) => ({ library: s.library.filter((l) => l.id !== id) })),
      duplicateCurrent: () =>
        set((s) => {
          const copy: SavedResume = {
            id: uid(),
            name: `${s.docName || 'Резюме'} (копия)`,
            updatedAt: Date.now(),
            data: s.data,
            config: s.config,
          };
          return { library: [copy, ...s.library].slice(0, 30) };
        }),

      /* ── history ── */
      undo: () =>
        set((s) => {
          if (!s.past.length) return {};
          const previous = s.past[s.past.length - 1];
          lastCommitAt = 0;
          return {
            past: s.past.slice(0, -1),
            future: [...s.future.slice(-59), { data: s.data, config: s.config }],
            data: previous.data,
            config: previous.config,
            savedAt: Date.now(),
          };
        }),
      redo: () =>
        set((s) => {
          if (!s.future.length) return {};
          const nextSnapshot = s.future[s.future.length - 1];
          lastCommitAt = 0;
          return {
            future: s.future.slice(0, -1),
            past: [...s.past, { data: s.data, config: s.config }],
            data: nextSnapshot.data,
            config: nextSnapshot.config,
            savedAt: Date.now(),
          };
        }),
      clearHistory: () => set({ past: [], future: [] }),
    }),
    {
      name: 'resume-studio-v3',
      version: 1,
      partialize: (state) => ({
        data: state.data,
        config: state.config,
        library: state.library,
        docName: state.docName,
        savedAt: state.savedAt,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ResumeStore>;
        return {
          ...current,
          ...p,
          data: normalizeData(p.data ?? current.data),
          config: normalizeConfig(p.config ?? current.config),
          library: Array.isArray(p.library) ? p.library : [],
          past: [],
          future: [],
        };
      },
    }
  )
);

export const canUndo = (s: ResumeStore) => s.past.length > 0;
export const canRedo = (s: ResumeStore) => s.future.length > 0;
