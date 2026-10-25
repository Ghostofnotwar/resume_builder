import React from 'react';
import { EditorTab } from '../types';
import { PersonalForm } from './forms/PersonalForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { CustomSectionsForm } from './forms/CustomSectionsForm';
import { DesignSettings } from './forms/DesignSettings';
import { AiPanel } from './forms/AiPanel';
import { QualityPanel } from './forms/QualityPanel';
import { LibraryPanel } from './forms/LibraryPanel';
import { TAB_META, tabMeta } from './navigation';
import { Icon } from './ui/Icon';
import { cn } from '../utils';

const COMPONENTS: Record<EditorTab, React.FC> = {
  personal: PersonalForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
  languages: LanguagesForm,
  custom: CustomSectionsForm,
  design: DesignSettings,
  ai: AiPanel,
  quality: QualityPanel,
  library: LibraryPanel,
};

interface Props {
  activeTab: EditorTab;
  onTab: (tab: EditorTab) => void;
  wide?: boolean;
}

export const EditorPanel: React.FC<Props> = ({ activeTab, onTab, wide }) => {
  const meta = tabMeta(activeTab);
  const Component = COMPONENTS[activeTab];
  const index = TAB_META.findIndex((tab) => tab.id === activeTab);
  const prev = TAB_META[index - 1];
  const next = TAB_META[index + 1];

  return (
    <div className="flex h-full min-h-0 flex-col bg-app">
      {/* header */}
      <div className="shrink-0 border-b border-line bg-surface px-4 pb-3 pt-3.5">
        <div className={cn(wide && 'mx-auto w-full max-w-[720px]')}>
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300">
              <Icon name={meta.icon} size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[15px] font-bold leading-tight tracking-tight text-ink">{meta.title}</h2>
              <p className="mt-0.5 text-[11.5px] leading-snug text-ink-mute">{meta.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                onClick={() => prev && onTab(prev.id)}
                disabled={!prev}
                className="rounded-lg p-1.5 text-ink-mute transition hover:bg-surface-2 hover:text-ink disabled:opacity-30"
                title={prev ? prev.label : ''}
              >
                <Icon name="chevron-up" size={15} />
              </button>
              <button
                onClick={() => next && onTab(next.id)}
                disabled={!next}
                className="rounded-lg p-1.5 text-ink-mute transition hover:bg-surface-2 hover:text-ink disabled:opacity-30"
                title={next ? next.label : ''}
              >
                <Icon name="chevron-down" size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn('px-3.5 py-4 pb-16 sm:px-4', wide && 'mx-auto w-full max-w-[720px]')}>
          <Component />
        </div>
      </div>
    </div>
  );
};
