import React from 'react';
import { ResumeConfig, ResumeData } from '../../types';
import { hexToRgba, tint } from '../../utils';
import { orderedSections } from '../../lib/sections';
import { contactItems, linkIcon, makeStyle, makeTokens, Photo, prettyUrl } from './shared';
import { SectionBlock } from './sections';
import { Icon } from '../ui/Icon';

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

export const ExecutiveTemplate: React.FC<Props> = ({ data, config }) => {
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
      <div style={{ padding: `${t.sp * 1.5}px ${t.sp * 1.6}px ${t.sp * 1.1}px`, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: t.sp }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: t.fs(8.6),
                fontWeight: 800,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: t.accent,
                marginBottom: 8,
              }}
            >
              {t.en ? 'Curriculum Vitae' : 'Резюме'}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: t.fs(31),
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                color: t.ink,
              }}
            >
              {personal.fullName || (t.en ? 'Your Name' : 'Ваше имя')}
            </h1>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: t.fs(11.6),
                fontWeight: 600,
                color: t.primary,
                letterSpacing: '0.01em',
              }}
            >
              {personal.jobTitle || (t.en ? 'Position' : 'Должность')}
            </p>
          </div>

          {config.showPhoto && (
            <Photo
              personal={personal}
              config={config}
              size={86}
              border={`1px solid ${hexToRgba(t.primary, 0.2)}`}
              bg={tint(t.primary, 0.9)}
              fg={t.primary}
            />
          )}
        </div>

        <div
          style={{
            marginTop: t.sp * 1.05,
            paddingTop: 10,
            borderTop: `1px solid ${hexToRgba(t.primary, 0.28)}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 20px',
          }}
        >
          {contacts.map((contact) => (
            <span key={contact.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.muted, fontSize: t.fs(9.8) }}>
              <span style={{ color: t.accent }}>
                <Icon name={contact.icon} size={11} />
              </span>
              {contact.text}
            </span>
          ))}
          {links.slice(0, 4).map((link) => (
            <span key={link.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.muted, fontSize: t.fs(9.8) }}>
              <span style={{ color: t.accent }}>
                <Icon name={linkIcon(link.label, link.url)} size={11} />
              </span>
              {prettyUrl(link.url)}
            </span>
          ))}
        </div>
      </div>

      {/* ── columns ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1, minWidth: 0, padding: `${t.sp * 0.7}px ${t.sp * 1.6}px ${t.sp * 1.5}px` }}>
          {mainSections.map((id) => (
            <SectionBlock key={id} id={id} data={data} config={config} s={main} variant="underline" gap={t.sp * 0.95} skillColumns={2} />
          ))}
        </div>

        <div
          style={{
            width: 232,
            flexShrink: 0,
            background: tint(t.primary, 0.955),
            borderLeft: `1px solid ${hexToRgba(t.primary, 0.1)}`,
            padding: `${t.sp * 1.1}px ${t.sp * 1.05}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: t.sp * 0.85,
          }}
        >
          {sideSections.map((id) => (
            <SectionBlock key={id} id={id} data={data} config={config} s={side} variant="side" gap={t.sp * 0.55} compact skillColumns={1} />
          ))}
          {!sideSections.length && (
            <div style={{ fontSize: t.fs(9), color: t.faint, lineHeight: 1.5 }}>
              {t.en ? 'Add skills and languages to fill this column.' : 'Добавьте навыки и языки, чтобы заполнить колонку.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
