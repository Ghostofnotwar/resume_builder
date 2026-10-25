import React from 'react';
import { ColorScheme, Personal, ResumeConfig, ResumeLocale } from '../../types';
import { FONT_OPTIONS, SPACING_OPTIONS } from '../../constants';
import { hexToRgba, isLight, tint } from '../../utils';
import { Icon, IconName } from '../ui/Icon';

export interface Tokens {
  cs: ColorScheme;
  sp: number;
  ff: string;
  fs: (size: number) => number;
  locale: ResumeLocale;
  en: boolean;
  onPrimary: string;
  ink: string;
  body: string;
  muted: string;
  faint: string;
  paper: string;
  accent: string;
  primary: string;
  accentSoft: string;
}

export function makeTokens(config: ResumeConfig): Tokens {
  const cs = config.colorScheme;
  const sp = SPACING_OPTIONS.find((s) => s.value === config.spacing)?.px ?? 19;
  const ff = FONT_OPTIONS.find((f) => f.value === config.font)?.css ?? FONT_OPTIONS[0].css;
  const scale = config.textScale ?? 1;
  return {
    cs,
    sp,
    ff,
    fs: (size: number) => Math.round(size * scale * 10) / 10,
    locale: config.locale,
    en: config.locale === 'en',
    onPrimary: isLight(cs.primary) ? '#111827' : '#ffffff',
    ink: cs.text,
    body: hexToRgba(cs.text, 0.82),
    muted: hexToRgba(cs.text, 0.62),
    faint: hexToRgba(cs.text, 0.42),
    paper: config.paperTint ? cs.background : '#ffffff',
    accent: cs.accent,
    primary: cs.primary,
    accentSoft: hexToRgba(cs.accent, 0.1),
  };
}

/** Style bundle used by the shared section renderers. */
export interface SectionStyle {
  t: Tokens;
  onDark?: boolean;
  heading: string;
  body: string;
  muted: string;
  faint: string;
  accent: string;
  primary: string;
  chipBg: string;
  chipText: string;
  tagBg: string;
  tagBorder: string;
  barBg: string;
  line: string;
  radius: number;
  bullet: 'dot' | 'dash' | 'square';
  dateStyle: 'pill' | 'plain' | 'outline';
}

export function makeStyle(t: Tokens, onDark = false): SectionStyle {
  if (onDark) {
    return {
      t,
      onDark,
      heading: '#ffffff',
      body: 'rgba(255,255,255,0.82)',
      muted: 'rgba(255,255,255,0.6)',
      faint: 'rgba(255,255,255,0.4)',
      accent: '#ffffff',
      primary: '#ffffff',
      chipBg: 'rgba(255,255,255,0.12)',
      chipText: 'rgba(255,255,255,0.92)',
      tagBg: 'rgba(255,255,255,0.1)',
      tagBorder: 'rgba(255,255,255,0.18)',
      barBg: 'rgba(255,255,255,0.2)',
      line: 'rgba(255,255,255,0.14)',
      radius: 8,
      bullet: 'dot',
      dateStyle: 'pill',
    };
  }
  return {
    t,
    heading: t.ink,
    body: t.body,
    muted: t.muted,
    faint: t.faint,
    accent: t.accent,
    primary: t.primary,
    chipBg: hexToRgba(t.primary, 0.08),
    chipText: t.primary,
    tagBg: tint(t.primary, 0.93),
    tagBorder: hexToRgba(t.primary, 0.14),
    barBg: hexToRgba(t.primary, 0.12),
    line: hexToRgba(t.primary, 0.14),
    radius: 8,
    bullet: 'dot',
    dateStyle: 'pill',
  };
}

/* ───────────── contacts ───────────── */

export interface ContactItem {
  id: string;
  icon: IconName;
  text: string;
  href?: string;
}

export function contactItems(personal: Personal): ContactItem[] {
  const items: ContactItem[] = [];
  if (personal.email.trim()) {
    items.push({ id: 'email', icon: 'mail', text: personal.email.trim(), href: `mailto:${personal.email.trim()}` });
  }
  if (personal.phone.trim()) {
    items.push({ id: 'phone', icon: 'phone', text: personal.phone.trim(), href: `tel:${personal.phone.replace(/\s/g, '')}` });
  }
  if (personal.location.trim()) {
    items.push({ id: 'location', icon: 'map-pin', text: personal.location.trim() });
  }
  return items;
}

export function linkIcon(label: string, url: string): IconName {
  const value = `${label} ${url}`.toLowerCase();
  if (value.includes('github')) return 'github';
  if (value.includes('linkedin')) return 'linkedin';
  if (value.includes('mail') || value.includes('@')) return 'mail';
  return 'link';
}

export function prettyUrl(url: string): string {
  return url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '');
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '—';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/* ───────────── photo ───────────── */

export function photoRadius(config: ResumeConfig, size: number): number | string {
  if (config.photoShape === 'circle') return '50%';
  if (config.photoShape === 'rounded') return Math.round(size * 0.18);
  return 4;
}

export const Photo: React.FC<{
  personal: Personal;
  config: ResumeConfig;
  size: number;
  border?: string;
  bg?: string;
  fg?: string;
  radius?: number | string;
}> = ({ personal, config, size, border, bg = 'rgba(255,255,255,0.14)', fg = 'rgba(255,255,255,0.75)', radius }) => {
  const shape = radius ?? photoRadius(config, size);
  const base: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: shape,
    flexShrink: 0,
    objectFit: 'cover',
    border: border ?? 'none',
    display: 'block',
  };
  if (personal.photo) {
    return <img src={personal.photo} alt={personal.fullName} style={base} />;
  }
  return (
    <div
      style={{
        ...base,
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.33,
        fontWeight: 800,
        letterSpacing: '0.02em',
        fontFamily: FONT_OPTIONS[0].css,
      }}
    >
      {initials(personal.fullName)}
    </div>
  );
};

/* ───────────── section headings ───────────── */

export const HeadingBar: React.FC<{ children: React.ReactNode; s: SectionStyle; dense?: boolean }> = ({ children, s, dense }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: dense ? 7 : 10 }}>
    <div
      style={{
        width: 5,
        height: dense ? 12 : 14,
        borderRadius: 3,
        background: `linear-gradient(180deg, ${s.t.primary}, ${s.accent})`,
        flexShrink: 0,
      }}
    />
    <h2
      style={{
        fontSize: s.t.fs(dense ? 9.5 : 10.5),
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: s.heading,
        margin: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </h2>
    <div
      style={{
        flex: 1,
        height: 1,
        background: `linear-gradient(90deg, ${s.line}, transparent)`,
      }}
    />
  </div>
);

export const HeadingUnderline: React.FC<{ children: React.ReactNode; s: SectionStyle }> = ({ children, s }) => (
  <div style={{ borderBottom: `1.5px solid ${s.onDark ? s.line : hexToRgba(s.t.primary, 0.28)}`, paddingBottom: 5, marginBottom: 10 }}>
    <h2
      style={{
        fontSize: s.t.fs(10.5),
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: s.onDark ? s.heading : s.t.primary,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 7,
      }}
    >
      {children}
      <span style={{ flex: 1, height: 1, background: s.line, marginLeft: 4 }} />
    </h2>
  </div>
);

export const HeadingSide: React.FC<{ children: React.ReactNode; s: SectionStyle }> = ({ children, s }) => (
  <div style={{ marginBottom: 8 }}>
    <h2
      style={{
        fontSize: s.t.fs(9),
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color: s.onDark ? 'rgba(255,255,255,0.55)' : s.t.muted,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {children}
    </h2>
    <div style={{ height: 1, background: s.line, marginTop: 5 }} />
  </div>
);

export const HeadingSerif: React.FC<{ children: React.ReactNode; s: SectionStyle }> = ({ children, s }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
    <h2
      style={{
        fontSize: s.t.fs(13),
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: s.t.primary,
        margin: 0,
        fontVariant: 'small-caps',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </h2>
    <div style={{ flex: 1, height: 1, background: s.line }} />
  </div>
);

/* ───────────── bullet ───────────── */

export const Bullet: React.FC<{ s: SectionStyle; children: React.ReactNode }> = ({ s, children }) => (
  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
    {s.bullet === 'dot' && (
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: s.onDark ? s.accent : s.accent,
          marginTop: 6,
          flexShrink: 0,
        }}
      />
    )}
    {s.bullet === 'dash' && (
      <span style={{ color: s.faint, fontSize: s.t.fs(11), lineHeight: 1.5, flexShrink: 0 }}>—</span>
    )}
    {s.bullet === 'square' && (
      <span
        style={{
          width: 3.5,
          height: 3.5,
          background: s.accent,
          marginTop: 6,
          flexShrink: 0,
        }}
      />
    )}
    <span style={{ fontSize: s.t.fs(10.4), lineHeight: 1.55, color: s.body, flex: 1 }}>{children}</span>
  </div>
);

/* ───────────── date badge ───────────── */

export const DatePill: React.FC<{ children: React.ReactNode; s: SectionStyle; small?: boolean }> = ({ children, s, small }) => (
  <span
    style={{
      fontSize: s.t.fs(small ? 8.6 : 9.2),
      fontWeight: 700,
      color: s.chipText,
      background: s.chipBg,
      border: s.dateStyle === 'outline' ? `1px solid ${s.tagBorder}` : 'none',
      padding: '2.5px 8px',
      borderRadius: s.dateStyle === 'pill' ? 99 : 5,
      whiteSpace: 'nowrap',
      letterSpacing: '0.01em',
      flexShrink: 0,
    }}
  >
    {children}
  </span>
);

export const Divider: React.FC<{ s: SectionStyle; gap?: number }> = ({ s, gap = 12 }) => (
  <div style={{ height: 1, background: s.line, margin: `${gap}px 0` }} />
);

export const IconText: React.FC<{
  icon: IconName;
  children: React.ReactNode;
  color?: string;
  iconColor?: string;
  size?: number;
}> = ({ icon, children, color = '#fff', iconColor = 'rgba(255,255,255,0.6)', size = 11 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 5, color, fontSize: 10.2, lineHeight: 1.4 }}>
    <span style={{ color: iconColor, marginTop: 1, flexShrink: 0 }}>
      <Icon name={icon} size={size} strokeWidth={1.8} />
    </span>
    <span style={{ wordBreak: 'break-word' }}>{children}</span>
  </span>
);
