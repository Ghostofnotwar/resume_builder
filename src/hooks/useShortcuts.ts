import { useEffect } from 'react';

export interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onPrint?: () => void;
  onSave?: () => void;
  onEscape?: () => void;
}

export function useShortcuts(handlers: ShortcutHandlers): void {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);
      const mod = event.metaKey || event.ctrlKey;

      if (event.key === 'Escape') {
        handlers.onEscape?.();
        return;
      }

      if (!mod) return;

      if (event.key.toLowerCase() === 'z' && !event.shiftKey) {
        event.preventDefault();
        handlers.onUndo?.();
        return;
      }
      if ((event.key.toLowerCase() === 'z' && event.shiftKey) || event.key.toLowerCase() === 'y') {
        event.preventDefault();
        handlers.onRedo?.();
        return;
      }
      if (event.key.toLowerCase() === 'p') {
        event.preventDefault();
        handlers.onPrint?.();
        return;
      }
      if (event.key.toLowerCase() === 's' && !typing) {
        event.preventDefault();
        handlers.onSave?.();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handlers]);
}
