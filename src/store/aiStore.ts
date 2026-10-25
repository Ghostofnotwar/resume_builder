import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AiSettings } from '../types';
import { DEFAULT_AI_SETTINGS, hasAiKey } from '../lib/ai/llm';

interface AiStore {
  settings: AiSettings;
  setSettings: (patch: Partial<AiSettings>) => void;
  reset: () => void;
  hasKey: () => boolean;
}

export const useAiStore = create<AiStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_AI_SETTINGS,
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      reset: () => set({ settings: DEFAULT_AI_SETTINGS }),
      hasKey: () => hasAiKey(get().settings),
    }),
    { name: 'resume-studio-ai' }
  )
);
