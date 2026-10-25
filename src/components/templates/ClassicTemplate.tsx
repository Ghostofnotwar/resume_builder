import React from 'react';
import { ResumeConfig, ResumeData } from '../../types';
import { hexToRgba } from '../../utils';
import { orderedSections } from '../../lib/sections';
import { contactItems, IconText, linkIcon, makeStyle, makeTokens, Photo, prettyUrl } from './shared';
import { SectionBlock } from './sections';

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

export const ClassicTemplate: React.FC<Props> = ({ data, config }) => {
  const t = makeTokens(config);
  const s = makeStyle(t);
  const { personal } = data;
  const contacts = contactItems(personal);
  const links = personal.links.filter((link) => link.url.trim());
  const sections = orderedSections(data, config, 'main');

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
      <div
        style={{
          background: `linear-gradient(120deg, ${t.cs.gradientFrom ?? t.primary} 0%, ${t.cs.gradientTo ?? t.accent} 100%)`,
          padding: `${t.sp * 1.5}px ${t.sp * 1.7}px`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -70,
            right: 60,
            width: 190,
            height: 190,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.055)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -90,
            right: -50,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />

        <div style={{ display: 'flex', gap: t.sp * 1.2, alignItems: 'flex-start', position: 'relative' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                color: t.onPrimary,
                fontSize: t.fs(29),
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              {personal.fullName || (t.en ? 'Your Name' : 'Ваше имя')}
            </h1>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                marginTop: 7,
                padding: '3px 11px',
                borderRadius: 99,
                background: 'rgba(255,255,255,0.16)',
                border: '1px solid rgba(255,255,255,0.28)',
              }}
            >
              <span
                style={{
                  color: t.onPrimary,
                  fontSize: t.fs(10.6),
                  fontWeight: 700,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                }}
              >
                {personal.jobTitle || (t.en ? 'Position' : 'Должность')}
              </span>
            </div>

            <div
              style={{
                marginTop: t.sp * 0.9,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px 16px',
                maxWidth: 470,
              }}
            >
              {contacts.map((contact) => (
                <IconText key={contact.id} icon={contact.icon} color={hexToRgba('#ffffff', 0.9)} iconColor="rgba(255,255,255,0.6)">
                  {contact.text}
                </IconText>
              ))}
              {links.map((link) => (
                <IconText
                  key={link.id}
                  icon={linkIcon(link.label, link.url)}
                  color={hexToRgba('#ffffff', 0.9)}
                  iconColor="rgba(255,255,255,0.6)"
                >
                  {link.label ? `${link.label}: ` : ''}
                  {prettyUrl(link.url)}
                </IconText>
              ))}
            </div>
          </div>

          {config.showPhoto && (
            <div style={{ flexShrink: 0 }}>
              <Photo
                personal={personal}
                config={config}
                size={94}
                border="2.5px solid rgba(255,255,255,0.5)"
                bg="rgba(255,255,255,0.14)"
                fg="rgba(255,255,255,0.85)"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── body ── */}
      <div style={{ flex: 1, padding: `${t.sp * 1.4}px ${t.sp * 1.7}px`, display: 'flex', flexDirection: 'column' }}>
        {sections.map((id) => (
          <SectionBlock key={id} id={id} data={data} config={config} s={s} gap={t.sp * 0.95} skillColumns={2} />
        ))}
        {!sections.length && (
          <div style={{ margin: 'auto', textAlign: 'center', color: t.faint, fontSize: t.fs(11.5) }}>
            {t.en ? 'Start filling in the sections on the left' : 'Начните заполнять разделы слева'}
          </div>
        )}
      </div>
    </div>
  );
};
