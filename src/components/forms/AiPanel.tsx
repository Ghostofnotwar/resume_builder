import React, { useState } from 'react';
import { useAiStore } from '../../store/aiStore';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils';
import { AiImportTab } from './ai/AiImportTab';
import { AiWriteTab } from './ai/AiWriteTab';
import { AiModelTab } from './ai/AiModelTab';

type Tab = 'import' | 'write' | 'model';

export const AiPanel: React.FC = () => {
  const [tab, setTab] = useState<Tab>('import');
  const settings = useAiStore((s) => s.settings);
  const hasKey = Boolean(settings.apiKey.trim() && settings.baseUrl.trim() && settings.model.trim());

  const tabs: { id: Tab; label: string; icon: string; dot?: boolean }[] = [
    { id: 'import', label: 'Импорт текста', icon: 'clipboard' },
    { id: 'write', label: 'Тексты', icon: 'sparkles' },
    { id: 'model', label: 'Модель', icon: 'key', dot: hasKey },
  ];

  return (
    <div className="space-y-3.5">
      <div className="flex gap-1 rounded-xl bg-surface-2 p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              'flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-[12px] font-semibold transition',
              tab === item.id ? 'bg-surface text-ink shadow-sm' : 'text-ink-mute hover:text-ink'
            )}
          >
            <Icon name={item.icon} size={13} />
            {item.label}
            {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
          </button>
        ))}
      </div>

      {tab === 'import' && <AiImportTab />}
      {tab === 'write' && <AiWriteTab />}
      {tab === 'model' && <AiModelTab />}
    </div>
  );
};
