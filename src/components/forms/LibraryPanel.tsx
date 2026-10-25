import React, { useRef } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Button, Field, IconButton, Input } from '../ui';
import { Group, TipRow } from './FormKit';
import { Icon } from '../ui/Icon';
import { toast } from '../ui/Toast';
import { exportResumeJson, exportMarkdown, readJsonFile } from '../../lib/export';
import { useUiStore } from '../../store/uiStore';

function formatWhen(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export const LibraryPanel: React.FC = () => {
  const docName = useResumeStore((s) => s.docName);
  const library = useResumeStore((s) => s.library);
  const data = useResumeStore((s) => s.data);
  const config = useResumeStore((s) => s.config);
  const setDocName = useResumeStore((s) => s.setDocName);
  const saveToLibrary = useResumeStore((s) => s.saveToLibrary);
  const loadFromLibrary = useResumeStore((s) => s.loadFromLibrary);
  const deleteFromLibrary = useResumeStore((s) => s.deleteFromLibrary);
  const duplicateCurrent = useResumeStore((s) => s.duplicateCurrent);
  const newBlank = useResumeStore((s) => s.newBlank);
  const loadDemo = useResumeStore((s) => s.loadDemo);
  const importState = useResumeStore((s) => s.importState);
  const clearHistory = useResumeStore((s) => s.clearHistory);
  const fileRef = useRef<HTMLInputElement>(null);
  const openQuickStart = useUiStore((s) => s.openQuickStart);

  const handleExportJson = () => {
    exportResumeJson(data, config, docName);
    toast('JSON скачан', { description: 'Файл можно импортировать на другом устройстве.' });
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const payload = await readJsonFile(file);
      if (!importState(payload)) {
        toast('В файле нет данных резюме', { tone: 'error' });
        return;
      }
      clearHistory();
      toast('Резюме импортировано');
    } catch (error) {
      toast('Не удалось прочитать файл', { description: String((error as Error).message), tone: 'error' });
    }
  };

  return (
    <div className="space-y-3.5">
      <Group title="Название документа" description="Используется для имени PDF и библиотеки.">
        <Field>
          <Input value={docName} placeholder="Резюме — Frontend" onChange={(event) => setDocName(event.target.value)} />
        </Field>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <Button size="sm" variant="primary" icon="save" onClick={() => { saveToLibrary(); toast('Сохранено в библиотеку'); }}>
            Сохранить версию
          </Button>
          <Button size="sm" variant="secondary" icon="copy" onClick={() => { duplicateCurrent(); toast('Копия создана'); }}>
            Дублировать
          </Button>
        </div>
      </Group>

      <Group title="Стартовый набор" description="Профиль, навыки и шаблон одним кликом — выберите профессию.">
        <Button size="sm" variant="secondary" icon="sparkles" onClick={openQuickStart}>
          Быстрый старт по профессии
        </Button>
      </Group>

      <Group title="Библиотека" description="Версии под разные вакансии — хранятся локально в браузере.">
        {library.length === 0 ? (
          <TipRow>Библиотека пуста. Сохраните текущую версию, чтобы сделать варианты под разные вакансии.</TipRow>
        ) : (
          <div className="space-y-1.5">
            {library.map((entry) => (
              <div key={entry.id} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-500">
                  <Icon name="file" size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-ink">{entry.name}</p>
                  <p className="truncate text-[10.5px] text-ink-faint">
                    {formatWhen(entry.updatedAt)} · {entry.data.personal.jobTitle || 'без должности'}
                  </p>
                </div>
                <button
                  onClick={() => { loadFromLibrary(entry.id); toast('Версия загружена'); }}
                  className="rounded-lg px-2 py-1 text-[11.5px] font-semibold text-brand-600 transition hover:bg-brand-500/10 dark:text-brand-300"
                >
                  Открыть
                </button>
                <IconButton name="trash" label="Удалить" tone="danger" onClick={() => deleteFromLibrary(entry.id)} />
              </div>
            ))}
          </div>
        )}
      </Group>

      <Group title="Новый документ" description="Создайте пустое резюме или вернитесь к демо-примеру.">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon="plus"
            onClick={() => {
              if (window.confirm('Создать пустое резюме? Текущее можно сохранить в библиотеку.')) {
                newBlank();
                toast('Создано пустое резюме', { tone: 'info' });
              }
            }}
          >
            С нуля
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon="sparkles"
            onClick={() => {
              loadDemo();
              toast('Загружен демо-пример', { tone: 'info' });
            }}
          >
            Демо-данные
          </Button>
        </div>
      </Group>

      <Group title="Файлы" description="Бэкап, перенос между устройствами и импорт из нашего формата.">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" icon="download" onClick={handleExportJson}>
            Скачать JSON
          </Button>
          <Button size="sm" variant="secondary" icon="upload" onClick={() => fileRef.current?.click()}>
            Импорт JSON
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon="file"
            onClick={() => {
              exportMarkdown(data);
              toast('Markdown скачан');
            }}
          >
            Markdown
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              void handleImport(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </div>
      </Group>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-500/25 dark:bg-rose-500/[0.06]">
        <p className="text-[11.5px] font-semibold text-rose-600 dark:text-rose-300">Локальные данные</p>
        <p className="mt-0.5 text-[11px] leading-snug text-ink-mute">
          Всё хранится в localStorage этого браузера: ничего не уходит на сервер, кроме запросов к вашей LLM (если подключена).
        </p>
        <Button
          size="xs"
          variant="danger"
          icon="trash"
          className="mt-2"
          onClick={() => {
            if (window.confirm('Удалить сохранённые данные и перезагрузить страницу?')) {
              localStorage.removeItem('resume-studio-v3');
              localStorage.removeItem('resume-builder-v2');
              window.location.reload();
            }
          }}
        >
          Очистить всё
        </Button>
      </div>
    </div>
  );
};
