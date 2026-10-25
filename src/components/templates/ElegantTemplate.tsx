import React from 'react';
import { ResumeConfig, ResumeData } from '../../types';
import { hexToRgba, tint } from '../../utils';
import { orderedSections } from '../../lib/sections';
import { contactItems, linkIcon, makeStyle, makeTokens, Photo, prettyUrl } from './shared';
import { SectionBlock } from './sections';

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

const SERIF = "'Source Serif 4', Georgia, 'Times New Roman', serif";

export const ElegantTemplate: React.FC<Props> = ({ data, config }) => {
  const t = makeTokens(config);
  const main = makeStyle(t);
  const side = makeStyle(t);
  const { personal } = data;
  const mainSections = orderedSections(data, config, 'main');
  const sideSections = orderedSections(data, config, 'sidebar');
  const contacts = contactItems(personal);
  const links = personal.links.filter((link) => link.url.trim());

  return (
    <div
      style={{
        fontFamily: t.ff,
        background: t.paper,
        color: t.ink,
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── header ── */}
      <header style={{ padding: `${t.sp * 1.7}px ${t.sp * 1.7}px ${t.sp * 1.1}px`, textAlign: 'center' }}>
        {config.showPhoto && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Photo
              personal={personal}
              config={config}
              size={78}
              border={`1px solid ${hexToRgba(t.primary, 0.24)}`}
              bg={tint(t.primary, 0.94)}
              fg={t.primary}
            />
          </div>
        )}
        <h1
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontSize: t.fs(34),
            fontWeight: 600,
            letterSpacing: '0.01em',
            lineHeight: 1.12,
            color: t.ink,
          }}
        >
          {personal.fullName || (t.en ? 'Your Name' : 'Ваше имя')}
        </h1>
        <p
          style={{
            margin: '7px 0 0',
            fontSize: t.fs(10.4),
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: t.accent,
          }}
        >
          {personal.jobTitle || (t.en ? 'Position' : 'Должность')}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '14px 0 10px' }}>
          <span style={{ height: 1, width: 70, background: main.line }} />
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: t.accent }} />
          <span style={{ height: 1, width: 70, background: main.line }} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 0', fontSize: t.fs(9.8), color: t.muted }}>
          {[...contacts.map((c) => c.text), ...links.map((l) => (l.label ? `${l.label}: ${prettyUrl(l.url)}` : prettyUrl(l.url)))].map(
            (text, index, list) => (
              <span key={`${text}-${index}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {text}
                {index < list.length - 1 && <span style={{ margin: '0 8px', color: t.faint }}>·</span>}
              </span>
            )
          )}
        </div>
      </header>

      <div style={{ height: 1, background: main.line, margin: `0 ${t.sp * 1.7}px` }} />

      {/* ── body ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1, minWidth: 0, padding: `${t.sp * 1.2}px ${t.sp * 1.5}px` }}>
          {mainSections.map((id) => (
            <SectionBlock key={id} id={id} data={data} config={config} s={main} variant="serif" gap={t.sp} skillColumns={2} italicSummary />
          ))}
          {!mainSections.length && (
            <p style={{ color: t.faint, fontSize: t.fs(11), fontStyle: 'italic' }}>
              {t.en ? 'Your story starts here.' : 'Ваша история начинается здесь.'}
            </p>
          )}
        </div>

        <aside
          style={{
            width: 234,
            flexShrink: 0,
            background: tint(t.primary, 0.965),
            borderLeft: `1px solid ${hexToRgba(t.primary, 0.12)}`,
            padding: `${t.sp * 1.2}px ${t.sp * 1.05}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: t.sp * 0.85,
          }}
        >
          {sideSections.map((id) => (
            <SectionBlock key={id} id={id} data={data} config={config} s={side} variant="side" gap={t.sp * 0.55} compact skillColumns={1} />
          ))}
          {!sideSections.length && (
            <p style={{ fontSize: t.fs(9), lineHeight: 1.55, color: t.faint, fontStyle: 'italic' }}>
              {t.en ? 'Skills, languages and certifications live here.' : 'Здесь размещаются навыки, языки и сертификаты.'}
            </p>
          )}
        </aside>
      </div>

      <div style={{ padding: `0 ${t.sp * 1.7}px ${t.sp * 1.1}px`, color: t.faint, fontSize: t.fs(8), letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {links.slice(0, 2).map((l) => prettyUrl(l.url)).join(' · ')}
      </div>
    </div>
  );
};
