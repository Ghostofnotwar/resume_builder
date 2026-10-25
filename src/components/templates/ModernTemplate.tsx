import React from 'react';
import { ResumeConfig, ResumeData } from '../../types';
import { hexToRgba } from '../../utils';
import { orderedSections } from '../../lib/sections';
import { contactItems, linkIcon, makeStyle, makeTokens, Photo, prettyUrl } from './shared';
import { SectionBlock } from './sections';
import { Icon } from '../ui/Icon';

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

export const ModernTemplate: React.FC<Props> = ({ data, config }) => {
  const t = makeTokens(config);
  const dark = makeStyle(t, true);
  const light = makeStyle(t);
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
        alignItems: 'stretch',
      }}
    >
      {/* ── sidebar ── */}
      <aside
        style={{
          width: 236,
          flexShrink: 0,
          background: `linear-gradient(168deg, ${t.cs.gradientFrom ?? t.primary} 0%, ${t.cs.gradientTo ?? t.accent} 115%)`,
          padding: `${t.sp * 1.5}px ${t.sp * 1.05}px`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: t.sp * 1.1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -70,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -90,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {config.showPhoto && (
            <Photo
              personal={personal}
              config={config}
              size={104}
              border="2.5px solid rgba(255,255,255,0.35)"
              bg="rgba(255,255,255,0.12)"
              fg="rgba(255,255,255,0.9)"
            />
          )}
          <div>
            <h1
              style={{
                margin: 0,
                color: t.onPrimary,
                fontSize: t.fs(20),
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              {personal.fullName || (t.en ? 'Your Name' : 'Ваше имя')}
            </h1>
            <p
              style={{
                margin: '5px 0 0',
                color: 'rgba(255,255,255,0.82)',
                fontSize: t.fs(10.2),
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                lineHeight: 1.4,
              }}
            >
              {personal.jobTitle || (t.en ? 'Position' : 'Должность')}
            </p>
          </div>
        </div>

        {contacts.length > 0 && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 7 }}>
            <p
              style={{
                margin: '0 0 1px',
                fontSize: t.fs(8.8),
                fontWeight: 800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {t.en ? 'Contacts' : 'Контакты'}
            </p>
            {contacts.map((contact) => (
              <div key={contact.id} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', marginTop: 1.5 }}>
                  <Icon name={contact.icon} size={11} />
                </span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: t.fs(9.6), lineHeight: 1.45, wordBreak: 'break-word' }}>
                  {contact.text}
                </span>
              </div>
            ))}
            {links.map((link) => (
              <div key={link.id} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)', marginTop: 1.5 }}>
                  <Icon name={linkIcon(link.label, link.url)} size={11} />
                </span>
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: t.fs(9.6), lineHeight: 1.45, wordBreak: 'break-word' }}>
                  {prettyUrl(link.url)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: t.sp * 0.8 }}>
          {sideSections.map((id) => (
            <SectionBlock key={id} id={id} data={data} config={config} s={dark} variant="side" gap={t.sp * 0.7} compact skillColumns={1} />
          ))}
        </div>
      </aside>

      {/* ── main ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: `${t.sp * 1.5}px ${t.sp * 1.3}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {mainSections.map((id) => (
          <SectionBlock key={id} id={id} data={data} config={config} s={light} variant="bar" gap={t.sp * 0.9} skillColumns={2} />
        ))}
        {!mainSections.length && !sideSections.length && (
          <div style={{ margin: 'auto', textAlign: 'center', color: t.faint, fontSize: t.fs(11.5) }}>
            {t.en ? 'Your resume content will appear here' : 'Здесь появится содержимое резюме'}
          </div>
        )}
      </div>
    </div>
  );
};
