import React from 'react';
import {
  Certification,
  CustomSection,
  Education,
  Experience,
  Language,
  Project,
  ResumeConfig,
  ResumeData,
  Skill,
} from '../../types';
import { dateRange, hexToRgba } from '../../utils';
import { PROFICIENCY_LABELS } from '../../constants';
import { filledCertifications, filledEducation, filledExperience, filledProjects, sectionLabel } from '../../lib/sections';
import {
  Bullet,
  DatePill,
  HeadingBar,
  HeadingSerif,
  HeadingSide,
  HeadingUnderline,
  SectionStyle,
  prettyUrl,
} from './shared';

export type HeadingVariant = 'bar' | 'underline' | 'side' | 'serif' | 'plain';

const Heading: React.FC<{ variant: HeadingVariant; s: SectionStyle; children: React.ReactNode }> = ({
  variant,
  s,
  children,
}) => {
  if (variant === 'underline') return <HeadingUnderline s={s}>{children}</HeadingUnderline>;
  if (variant === 'side') return <HeadingSide s={s}>{children}</HeadingSide>;
  if (variant === 'serif') return <HeadingSerif s={s}>{children}</HeadingSerif>;
  if (variant === 'plain') {
    return (
      <h2
        style={{
          fontSize: s.t.fs(10.5),
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: s.onDark ? s.heading : s.t.ink,
          margin: '0 0 7px',
          paddingBottom: 4,
          borderBottom: `1px solid ${s.onDark ? s.line : hexToRgba(s.t.ink, 0.25)}`,
        }}
      >
        {children}
      </h2>
    );
  }
  return <HeadingBar s={s}>{children}</HeadingBar>;
};

/* ─────────── summary ─────────── */

const Summary: React.FC<{ text: string; s: SectionStyle; italic?: boolean }> = ({ text, s, italic }) => (
  <p
    style={{
      margin: 0,
      fontSize: s.t.fs(11),
      lineHeight: 1.7,
      color: s.body,
      fontStyle: italic ? 'italic' : 'normal',
    }}
  >
    {text}
  </p>
);

/* ─────────── experience ─────────── */

const ExperienceList: React.FC<{
  items: Experience[];
  s: SectionStyle;
  compact?: boolean;
  locale: ResumeConfig['locale'];
}> = ({ items, s, compact, locale }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 10 : s.t.sp * 0.8 }}>
    {items.map((exp) => (
      <div key={exp.id}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: s.t.fs(compact ? 11.5 : 12.6),
                fontWeight: 800,
                color: s.heading,
                lineHeight: 1.32,
              }}
            >
              {exp.position || '—'}
            </div>
            {(exp.company || exp.location) && (
              <div
                style={{
                  fontSize: s.t.fs(10.4),
                  fontWeight: 600,
                  color: s.onDark ? s.muted : s.accent,
                  marginTop: 1,
                }}
              >
                {exp.company}
                {exp.company && exp.location ? ' · ' : ''}
                {exp.location}
              </div>
            )}
          </div>
          <DatePill s={s}>
            {dateRange(exp.startDate, exp.endDate, exp.current, locale) || '—'}
          </DatePill>
        </div>
        {exp.description && (
          <p
            style={{
              margin: '4px 0 0',
              fontSize: s.t.fs(10.2),
              lineHeight: 1.55,
              color: s.muted,
            }}
          >
            {exp.description}
          </p>
        )}
        {exp.highlights.filter(Boolean).length > 0 && (
          <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {exp.highlights.filter(Boolean).map((highlight, index) => (
              <Bullet key={index} s={s}>
                {highlight}
              </Bullet>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ─────────── education ─────────── */

const EducationList: React.FC<{ items: Education[]; s: SectionStyle; compact?: boolean }> = ({ items, s, compact }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 8 : 10 }}>
    {items.map((edu) => (
      <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: s.t.fs(compact ? 10.6 : 11.6), fontWeight: 700, color: s.heading, lineHeight: 1.35 }}>
            {edu.institution || '—'}
          </div>
          <div style={{ fontSize: s.t.fs(9.8), color: s.muted, marginTop: 1, lineHeight: 1.4 }}>
            {[edu.degree, edu.field].filter(Boolean).join(', ')}
            {edu.location ? ` · ${edu.location}` : ''}
          </div>
        </div>
        {(edu.startYear || edu.endYear) && (
          <span style={{ fontSize: s.t.fs(9), fontWeight: 600, color: s.onDark ? s.muted : s.faint, whiteSpace: 'nowrap' }}>
            {edu.startYear}
            {edu.endYear ? `–${edu.endYear}` : ''}
          </span>
        )}
      </div>
    ))}
  </div>
);

/* ─────────── projects ─────────── */

const ProjectsList: React.FC<{ items: Project[]; s: SectionStyle; locale: ResumeConfig['locale']; compact?: boolean }> = ({
  items,
  s,
  locale,
  compact,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 9 : s.t.sp * 0.7 }}>
    {items.map((project) => (
      <div key={project.id}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: s.t.fs(11.6), fontWeight: 700, color: s.heading }}>
              {project.name || '—'}
              {project.role && <span style={{ fontWeight: 500, color: s.muted }}> — {project.role}</span>}
            </div>
            {project.url && (
              <div style={{ fontSize: s.t.fs(9.2), color: s.onDark ? s.muted : s.accent, marginTop: 1 }}>
                {prettyUrl(project.url)}
              </div>
            )}
          </div>
          {(project.startDate || project.endDate) && (
            <DatePill s={s}>{dateRange(project.startDate, project.endDate, false, locale)}</DatePill>
          )}
        </div>
        {project.description && (
          <p style={{ margin: '3px 0 0', fontSize: s.t.fs(10.1), lineHeight: 1.5, color: s.body }}>{project.description}</p>
        )}
        {project.highlights.filter(Boolean).length > 0 && (
          <div style={{ marginTop: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {project.highlights.filter(Boolean).map((highlight, index) => (
              <Bullet key={index} s={s}>
                {highlight}
              </Bullet>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ─────────── skills ─────────── */

const SkillsList: React.FC<{
  items: Skill[];
  s: SectionStyle;
  levels: boolean;
  compact?: boolean;
  columns?: number;
}> = ({ items, s, levels, compact, columns = 2 }) => {
  if (!levels) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {items.map((skill) => (
          <span
            key={skill.id}
            style={{
              fontSize: s.t.fs(9.6),
              fontWeight: 600,
              color: s.chipText,
              background: s.tagBg,
              border: `1px solid ${s.tagBorder}`,
              padding: '2.5px 7px',
              borderRadius: 5,
              lineHeight: 1.3,
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns > 1 ? `repeat(${columns}, minmax(0, 1fr))` : '1fr',
        columnGap: columns > 1 ? 14 : 0,
        rowGap: compact ? 6 : 7,
      }}
    >
      {items.map((skill) => (
        <div key={skill.id} style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginBottom: 2.5 }}>
            <span style={{ fontSize: s.t.fs(9.9), fontWeight: 600, color: s.onDark ? 'rgba(255,255,255,0.9)' : s.body }}>
              {skill.name}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 2.5 }}>
            {[1, 2, 3, 4, 5].map((step) => (
              <span
                key={step}
                style={{
                  height: 3,
                  flex: 1,
                  borderRadius: 2,
                  background:
                    step <= skill.level
                      ? s.onDark
                        ? 'rgba(255,255,255,0.82)'
                        : `linear-gradient(90deg, ${s.t.primary}, ${s.accent})`
                      : s.barBg,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─────────── languages ─────────── */

const LanguagesList: React.FC<{ items: Language[]; s: SectionStyle; compact?: boolean }> = ({ items, s, compact }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 4 : 5 }}>
    {items.map((lang) => (
      <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: s.t.fs(9.9), fontWeight: 600, color: s.onDark ? 'rgba(255,255,255,0.9)' : s.body }}>
          {lang.name}
        </span>
        <span
          style={{
            fontSize: s.t.fs(8.6),
            fontWeight: 700,
            color: s.onDark ? 'rgba(255,255,255,0.75)' : s.t.muted,
            background: s.onDark ? 'rgba(255,255,255,0.1)' : hexToRgba(s.t.primary, 0.07),
            padding: '1.5px 6px',
            borderRadius: 99,
            whiteSpace: 'nowrap',
          }}
        >
          {lang.proficiency}
        </span>
      </div>
    ))}
    {!items.length && <span style={{ fontSize: 10, color: s.muted }}>—</span>}
  </div>
);

/* ─────────── certifications ─────────── */

const CertificationsList: React.FC<{ items: Certification[]; s: SectionStyle; compact?: boolean }> = ({
  items,
  s,
  compact,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 6 : 7 }}>
    {items.map((cert) => (
      <div key={cert.id}>
        <div style={{ fontSize: s.t.fs(10), fontWeight: 600, color: s.heading, lineHeight: 1.4 }}>{cert.name}</div>
        <div style={{ fontSize: s.t.fs(8.8), color: s.muted, marginTop: 0.5 }}>
          {[cert.issuer, cert.date].filter(Boolean).join(' · ')}
        </div>
      </div>
    ))}
  </div>
);

/* ─────────── custom ─────────── */

const CustomList: React.FC<{ section: CustomSection; s: SectionStyle; compact?: boolean }> = ({ section, s, compact }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 7 : 8 }}>
    {section.items.map((item) => (
      <div key={item.id}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: s.t.fs(10.6), fontWeight: 700, color: s.heading }}>{item.title}</div>
            {item.subtitle && (
              <div style={{ fontSize: s.t.fs(9.4), color: s.onDark ? s.muted : s.accent, marginTop: 0.5 }}>{item.subtitle}</div>
            )}
          </div>
          {item.date && <span style={{ fontSize: s.t.fs(8.8), color: s.faint, whiteSpace: 'nowrap' }}>{item.date}</span>}
        </div>
        {item.description && (
          <p style={{ margin: '2px 0 0', fontSize: s.t.fs(9.8), lineHeight: 1.5, color: s.body }}>{item.description}</p>
        )}
      </div>
    ))}
  </div>
);

/* ─────────── dispatcher ─────────── */

export const SectionBody: React.FC<{
  id: string;
  data: ResumeData;
  config: ResumeConfig;
  s: SectionStyle;
  compact?: boolean;
  skillColumns?: number;
  italicSummary?: boolean;
}> = ({ id, data, config, s, compact, skillColumns, italicSummary }) => {
  switch (id) {
    case 'summary':
      return <Summary text={data.summary} s={s} italic={italicSummary} />;
    case 'experience':
      return <ExperienceList items={filledExperience(data)} s={s} compact={compact} locale={config.locale} />;
    case 'education':
      return <EducationList items={filledEducation(data)} s={s} compact={compact} />;
    case 'projects':
      return <ProjectsList items={filledProjects(data)} s={s} locale={config.locale} compact={compact} />;
    case 'skills':
      return (
        <SkillsList
          items={data.skills}
          s={s}
          levels={config.showSkillLevels}
          compact={compact}
          columns={skillColumns ?? (compact ? 1 : 2)}
        />
      );
    case 'languages':
      return <LanguagesList items={data.languages} s={s} compact={compact} />;
    case 'certifications':
      return <CertificationsList items={filledCertifications(data)} s={s} compact={compact} />;
    default: {
      if (id.startsWith('custom:')) {
        const custom = data.customSections.find((section) => `custom:${section.id}` === id);
        if (!custom) return null;
        return <CustomList section={custom} s={s} compact={compact} />;
      }
      return null;
    }
  }
};

export const SectionBlock: React.FC<{
  id: string;
  data: ResumeData;
  config: ResumeConfig;
  s: SectionStyle;
  variant?: HeadingVariant;
  gap?: number;
  compact?: boolean;
  skillColumns?: number;
  titleOverride?: string;
  italicSummary?: boolean;
}> = ({
  id,
  data,
  config,
  s,
  variant = 'bar',
  gap,
  compact,
  skillColumns,
  titleOverride,
  italicSummary,
}) => (
  <div style={{ marginBottom: gap ?? s.t.sp * 0.85 }}>
    <Heading variant={variant} s={s}>
      {titleOverride ?? sectionLabel(id, config.locale, data)}
    </Heading>
    <SectionBody id={id} data={data} config={config} s={s} compact={compact} skillColumns={skillColumns} italicSummary={italicSummary} />
  </div>
);

export const PROFICIENCY_TEXT = PROFICIENCY_LABELS;
