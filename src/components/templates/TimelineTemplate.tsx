import React from 'react';
import { ResumeConfig, ResumeData } from '../../types';
import { formatDate, hexToRgba } from '../../utils';
import { orderedSections, sectionLabel } from '../../lib/sections';
import { Bullet, contactItems, linkIcon, makeStyle, makeTokens, Photo, prettyUrl } from './shared';
import { SectionBlock } from './sections';
import { Icon } from '../ui/Icon';

interface Props {
  data: ResumeData;
  config: ResumeConfig;
}

export const TimelineTemplate: React.FC<Props> = ({ data, config }) => {
  const t = makeTokens(config);
  const s = makeStyle(t);
  const { personal } = data;
  const contacts = contactItems(personal);
  const links = personal.links.filter((link) => link.url.trim());
  const sections = orderedSections(data, config, 'main');
  const present = t.en ? 'Present' : 'наст. время';

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
      <div style={{ padding: `${t.sp * 1.5}px ${t.sp * 1.6}px ${t.sp * 1.05}px`, display: 'flex', gap: t.sp * 1.2, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, borderLeft: `4px solid ${t.accent}`, paddingLeft: t.sp * 0.95 }}>
          <h1
            style={{
              margin: 0,
              fontSize: t.fs(29),
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: t.ink,
            }}
          >
            {personal.fullName || (t.en ? 'Your Name' : 'Ваше имя')}
          </h1>
          <p
            style={{
              margin: '5px 0 0',
              fontSize: t.fs(11.8),
              fontWeight: 600,
              color: t.primary,
            }}
          >
            {personal.jobTitle || (t.en ? 'Position' : 'Должность')}
          </p>
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: '5px 16px' }}>
            {contacts.map((contact) => (
              <span key={contact.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.muted, fontSize: t.fs(9.8) }}>
                <span style={{ color: t.accent }}>
                  <Icon name={contact.icon} size={11} />
                </span>
                {contact.text}
              </span>
            ))}
            {links.map((link) => (
              <span key={link.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: t.muted, fontSize: t.fs(9.8) }}>
                <span style={{ color: t.accent }}>
                  <Icon name={linkIcon(link.label, link.url)} size={11} />
                </span>
                {prettyUrl(link.url)}
              </span>
            ))}
          </div>
        </div>
        {config.showPhoto && (
          <Photo
            personal={personal}
            config={config}
            size={88}
            border={`2px solid ${hexToRgba(t.accent, 0.4)}`}
            bg={hexToRgba(t.primary, 0.08)}
            fg={t.primary}
          />
        )}
      </div>

      <div style={{ height: 1, background: s.line, margin: `0 ${t.sp * 1.6}px` }} />

      {/* ── body ── */}
      <div style={{ flex: 1, padding: `${t.sp * 1.2}px ${t.sp * 1.6}px ${t.sp * 1.5}px` }}>
        {sections.map((id) =>
          id === 'experience' ? (
            <div key={id} style={{ marginBottom: t.sp * 0.9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <div style={{ width: 5, height: 14, borderRadius: 3, background: `linear-gradient(180deg, ${t.primary}, ${t.accent})` }} />
                <h2
                  style={{
                    margin: 0,
                    fontSize: t.fs(10.5),
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    color: t.ink,
                  }}
                >
                  {sectionLabel(id, config.locale, data)}
                </h2>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${s.line}, transparent)` }} />
              </div>

              {data.experience.map((exp, index) => {
                const isLast = index === data.experience.length - 1;
                return (
                  <div key={exp.id} style={{ display: 'flex', gap: 10 }}>
                    <div
                      style={{
                        width: 72,
                        flexShrink: 0,
                        textAlign: 'right',
                        paddingTop: 1.5,
                        fontSize: t.fs(8.8),
                        fontWeight: 600,
                        color: t.muted,
                        lineHeight: 1.45,
                      }}
                    >
                      <div>{formatDate(exp.startDate, config.locale) || '—'}</div>
                      <div style={{ color: t.faint }}>—</div>
                      <div>{exp.current ? present : formatDate(exp.endDate, config.locale) || '—'}</div>
                    </div>

                    <div style={{ width: 12, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: '50%',
                          background: t.paper,
                          border: `2.5px solid ${t.accent}`,
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      />
                      {!isLast && <span style={{ width: 1.5, flex: 1, background: hexToRgba(t.accent, 0.25), marginTop: 2 }} />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 4 : t.sp * 0.75 }}>
                      <div style={{ fontSize: t.fs(12.4), fontWeight: 800, color: t.ink, lineHeight: 1.3 }}>{exp.position || '—'}</div>
                      <div style={{ fontSize: t.fs(10.3), fontWeight: 600, color: t.accent, marginTop: 1 }}>
                        {exp.company}
                        {exp.location ? ` · ${exp.location}` : ''}
                      </div>
                      {exp.description && (
                        <p style={{ margin: '3px 0 0', fontSize: t.fs(10.1), lineHeight: 1.55, color: t.muted }}>{exp.description}</p>
                      )}
                      {exp.highlights.filter(Boolean).length > 0 && (
                        <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          {exp.highlights.filter(Boolean).map((highlight, i) => (
                            <Bullet key={i} s={s}>
                              {highlight}
                            </Bullet>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <SectionBlock key={id} id={id} data={data} config={config} s={s} variant="bar" gap={t.sp * 0.9} skillColumns={2} />
          )
        )}
        {!sections.length && (
          <div style={{ textAlign: 'center', color: t.faint, fontSize: t.fs(11.5), marginTop: t.sp * 2 }}>
            {t.en ? 'Add experience to build the timeline' : 'Добавьте опыт — и здесь появится таймлайн'}
          </div>
        )}
      </div>
    </div>
  );
};
