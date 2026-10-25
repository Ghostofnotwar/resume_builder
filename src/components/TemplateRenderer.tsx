import React from 'react';
import { ResumeConfig, ResumeData } from '../types';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { TimelineTemplate } from './templates/TimelineTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

export const TemplateRenderer: React.FC<Props> = ({ data, config }) => {
  switch (config.templateId) {
    case 'modern':
      return <ModernTemplate data={data} config={config} />;
    case 'executive':
      return <ExecutiveTemplate data={data} config={config} />;
    case 'minimal':
      return <MinimalTemplate data={data} config={config} />;
    case 'timeline':
      return <TimelineTemplate data={data} config={config} />;
    case 'elegant':
      return <ElegantTemplate data={data} config={config} />;
    case 'classic':
    default:
      return <ClassicTemplate data={data} config={config} />;
  }
};
