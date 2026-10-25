import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AiSettings } from '../types';
import { DEFAULT_AI_SETTINGS, hasAiKey } from '../lib/ai/llm';

interface AiStore {
  settings: AiSettings;
  /** Vacancy description — shared between the AI and quality tabs. */
  vacancy: string;
  coverLetter: string;
  setSettings: (patch: Partial<AiSettings>) => void;
  setVacancy: (vacancy: string) => void;
  setCoverLetter: (coverLetter: string) => void;
  reset: () => void;
  hasKey: () => boolean;
}

export const useAiStore = create<AiStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_AI_SETTINGS,
      vacancy: '',
      coverLetter: '',
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setVacancy: (vacancy) => set({ vacancy }),
      setCoverLetter: (coverLetter) => set({ coverLetter }),
      reset: () => set({ settings: DEFAULT_AI_SETTINGS, vacancy: '', coverLetter: '' }),
      hasKey: () => hasAiKey(get().settings),
    }),
    {
      name: 'resume-studio-ai',
      partialize: (state) => ({
        settings: state.settings,
        vacancy: state.vacancy,
        coverLetter: state.coverLetter,
      }),
    }
  )
);
