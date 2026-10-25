import React from 'react';
import { ResumeConfig, ResumeData } from '../../types';
import { orderedSections } from '../../lib/sections';
import { contactItems, makeStyle, makeTokens, prettyUrl } from './shared';
import { SectionBlock } from './sections';

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

/**
 * ATS-friendly single column: no photo, no sidebars, plain headings,
 * maximum text density and machine-readable structure.
 */
export const MinimalTemplate: React.FC<Props> = ({ data, config }) => {
  const t = makeTokens(config);
  const s = makeStyle(t);
  const { personal } = data;
  const contacts = contactItems(personal);
  const links = personal.links.filter((link) => link.url.trim());
  const sections = orderedSections(data, config, 'main');
  const atsConfig: ResumeConfig = { ...config, showSkillLevels: false };

  return (
    <div
      style={{
        fontFamily: t.ff,
        background: config.paperTint ? '#ffffff' : t.paper,
        color: t.ink,
        width: '100%',
        minHeight: '100%',
        padding: `${t.sp * 1.7}px ${t.sp * 1.8}px`,
      }}
    >
      <header style={{ marginBottom: t.sp * 0.95 }}>
        <h1
          style={{
            margin: 0,
            fontSize: t.fs(24),
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            color: t.ink,
          }}
        >
          {personal.fullName || (t.en ? 'Your Name' : 'Ваше имя')}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: t.fs(11.4), fontWeight: 500, color: t.ink }}>
          {personal.jobTitle || (t.en ? 'Position' : 'Должность')}
        </p>
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '2px 0', fontSize: t.fs(9.8), color: t.muted }}>
          {[...contacts.map((c) => c.text), ...links.slice(0, 3).map((l) => prettyUrl(l.url))].map((text, index, list) => (
            <span key={`${text}-${index}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {text}
              {index < list.length - 1 && <span style={{ margin: '0 7px', color: t.faint }}>•</span>}
            </span>
          ))}
        </div>
        <div style={{ height: 2, background: t.ink, marginTop: 10, opacity: 0.85 }} />
      </header>

      {sections.map((id) => (
        <SectionBlock
          key={id}
          id={id}
          data={data}
          config={atsConfig}
          s={s}
          variant="plain"
          gap={t.sp * 0.75}
          skillColumns={1}
        />
      ))}

      {/* links with icons are intentionally kept as text for ATS parsers */}
      {links.length > 3 && (
        <p style={{ marginTop: 4, fontSize: t.fs(9), color: t.faint }}>
          {links.slice(3).map((link) => `${link.label ? `${link.label}: ` : ''}${prettyUrl(link.url)}`).join(' · ')}
        </p>
      )}
      {!sections.length && (
        <p style={{ color: t.faint, fontSize: t.fs(11), marginTop: t.sp }}>
          {t.en ? 'Fill in the sections on the left — plain text, ATS-ready.' : 'Заполните разделы слева — простой текст, готовый для ATS.'}
        </p>
      )}
    </div>
  );
};
