import { create } from 'zustand';

interface UiStore {
  quickStartOpen: boolean;
  openQuickStart: () => void;
  closeQuickStart: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  quickStartOpen: false,
  openQuickStart: () => set({ quickStartOpen: true }),
  closeQuickStart: () => set({ quickStartOpen: false }),
}));
