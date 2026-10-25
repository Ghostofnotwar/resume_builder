import React from 'react';
import { Modal, Button } from './ui';
import { Icon } from './ui/Icon';
import { ROLE_PRESETS, RolePreset } from '../lib/ai/suggest';
import { useResumeStore } from '../store/resumeStore';
import { useUiStore } from '../store/uiStore';
import { toast } from './ui/Toast';
import { cn } from '../utils';

const ROLE_ICONS: Record<string, string> = {
  frontend: 'layout',
  backend: 'settings',
  fullstack: 'layers',
  qa: 'shield',
  product: 'target',
  designer: 'palette',
  analyst: 'gauge',
  marketing: 'zap',
  sales: 'briefcase',
  hr: 'user',
};

const TEMPLATE_BY_ROLE: Record<string, string> = {
  frontend: 'modern',
  backend: 'modern',
  fullstack: 'modern',
  qa: 'minimal',
  product: 'executive',
  designer: 'elegant',
  analyst: 'executive',
  marketing: 'classic',
  sales: 'classic',
  hr: 'classic',
};

interface Props {
  onImportText: () => void;
}

export const QuickStart: React.FC<Props> = ({ onImportText }) => {
  const open = useUiStore((s) => s.quickStartOpen);
  const closeStore = useUiStore((s) => s.closeQuickStart);
  const close = React.useCallback(() => {
    try {
      localStorage.setItem('resume-studio-onboarded', '1');
    } catch {
      /* ignore */
    }
    closeStore();
  }, [closeStore]);

  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const updateSummary = useResumeStore((s) => s.updateSummary);
  const addSkillsBulk = useResumeStore((s) => s.addSkillsBulk);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const loadDemo = useResumeStore((s) => s.loadDemo);
  const docName = useResumeStore((s) => s.docName);
  const setDocName = useResumeStore((s) => s.setDocName);

  const applyRole = (preset: RolePreset) => {
    updatePersonal({ jobTitle: preset.title });
    updateSummary(preset.summary);
    addSkillsBulk(preset.skills);
    setTemplate(TEMPLATE_BY_ROLE[preset.id] ?? 'classic');
    if (!docName || docName === 'Моё резюме' || docName === 'Новое резюме') {
      setDocName(`Резюме — ${preset.title}`);
    }
    close();
    toast('Стартовый набор применён', {
      description: 'Дальше замените текст на свой и добавьте опыт — парсер в «ИИ» ускорит это.',
    });
  };

  return (
    <Modal
      open={open}
      onClose={close}
      size="lg"
      title="Быстрый старт"
      subtitle="Выберите профессию — подставим профиль, навыки и подходящий шаблон. Всё можно изменить."
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={close}>
            Начать с пустого листа
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon="upload"
            onClick={() => {
              close();
              onImportText();
            }}
          >
            Импортировать текст
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ROLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyRole(preset)}
            className={cn(
              'group flex flex-col items-start gap-1.5 rounded-2xl border border-line bg-surface p-3 text-left transition',
              'hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-panel'
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white">
              <Icon name={ROLE_ICONS[preset.id] ?? 'briefcase'} size={15} />
            </span>
            <span className="text-[12.5px] font-semibold leading-tight text-ink">{preset.label}</span>
            <span className="text-[10.5px] leading-snug text-ink-mute">{preset.skills.slice(0, 3).join(' · ')}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2">
        <p className="text-[11.5px] leading-snug text-ink-mute">
          Хотите посмотреть готовый пример со всеми разделами?
        </p>
        <Button
          variant="soft"
          size="xs"
          icon="sparkles"
          onClick={() => {
            loadDemo();
            close();
            toast('Демо-резюме загружено', { tone: 'info' });
          }}
        >
          Демо
        </Button>
      </div>
    </Modal>
  );
};
