import { RefObject, useCallback, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { exportResumePdf, exportResumePng, printResume } from '../lib/export';
import { toast } from '../components/ui/Toast';

type ExportKind = 'pdf' | 'png' | 'print' | null;

export function useResumeExport(ref: RefObject<HTMLElement>) {
  const [busy, setBusy] = useState<ExportKind>(null);

  const pdf = useCallback(async () => {
    if (!ref.current) {
      toast('Предпросмотр не готов', { tone: 'error' });
      return;
    }
    setBusy('pdf');
    try {
      const { data } = useResumeStore.getState();
      await exportResumePdf(ref.current, data);
      toast('PDF сохранён', { description: 'Многостраничный файл A4 готов к отправке.' });
    } catch (error) {
      toast('Ошибка экспорта PDF', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setBusy(null);
    }
  }, [ref]);

  const png = useCallback(async () => {
    if (!ref.current) return;
    setBusy('png');
    try {
      const { data } = useResumeStore.getState();
      await exportResumePng(ref.current, data);
      toast('PNG сохранён');
    } catch (error) {
      toast('Ошибка экспорта PNG', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setBusy(null);
    }
  }, [ref]);

  const print = useCallback(async () => {
    setBusy('print');
    try {
      await printResume();
    } catch (error) {
      toast('Ошибка печати', { description: String((error as Error).message), tone: 'error' });
    } finally {
      setTimeout(() => setBusy(null), 600);
    }
  }, []);

  return { pdf, png, print, busy };
}
