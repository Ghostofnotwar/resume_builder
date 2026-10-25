import React from 'react';

export type IconName =
  | 'user'
  | 'briefcase'
  | 'graduation'
  | 'folder'
  | 'award'
  | 'zap'
  | 'globe'
  | 'layers'
  | 'palette'
  | 'sparkles'
  | 'library'
  | 'gauge'
  | 'eye'
  | 'download'
  | 'undo'
  | 'redo'
  | 'sun'
  | 'moon'
  | 'plus'
  | 'trash'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'check'
  | 'x'
  | 'upload'
  | 'print'
  | 'image'
  | 'file'
  | 'wand'
  | 'grip'
  | 'mail'
  | 'phone'
  | 'map-pin'
  | 'link'
  | 'github'
  | 'linkedin'
  | 'star'
  | 'clock'
  | 'target'
  | 'alert'
  | 'info'
  | 'copy'
  | 'layout'
  | 'settings'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-right'
  | 'search'
  | 'external'
  | 'type'
  | 'refresh'
  | 'save'
  | 'zoom-in'
  | 'zoom-out'
  | 'maximize'
  | 'key'
  | 'edit'
  | 'grid'
  | 'sliders'
  | 'shield'
  | 'translate'
  | 'clipboard';

const PATHS: Record<IconName, React.ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7v1" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
      <path d="M9 7V5.5A2.5 2.5 0 0 1 11.5 3h1A2.5 2.5 0 0 1 15 5.5V7M2.5 12.5h19" />
    </>
  ),
  graduation: (
    <>
      <path d="M22 9 12 4 2 9l10 5 10-5Z" />
      <path d="M6 11.5V17c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5" />
    </>
  ),
  folder: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.2c.7 0 1.3.3 1.8.8l1 1.2h7A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />,
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5" />
    </>
  ),
  zap: <path d="M13 2 4.5 13.5H11l-1 8.5 9-12h-6.5L13 2Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9Z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5M3 17.5l9 5 9-5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-2 0-1-.6-1.6-.6-2.4 0-.9.7-1.6 1.6-1.6H18a3 3 0 0 0 3-3c0-4.5-4-9-9-9Z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M18.5 14.5l.9 2.2 2.1.8-2.1.8-.9 2.2-.9-2.2-2.1-.8 2.1-.8.9-2.2ZM5 15l.7 1.7L7.5 17l-1.8.7L5 19.5l-.7-1.8L2.5 17l1.8-.3L5 15Z" />
    </>
  ),
  library: (
    <>
      <path d="M4 4h4v16H4zM10 4h4v16h-4z" />
      <path d="m16.5 5 3.4-.9 3 15.4-3.4.9z" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18a9 9 0 1 1 16 0" />
      <path d="m12 14 4-4" />
      <circle cx="12" cy="15.5" r="1.6" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  download: <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
  undo: <path d="M9 7H5V3M5 7a8 8 0 1 1-1.6 9" />,
  redo: <path d="M15 7h4V3M19 7a8 8 0 1 0 1.6 9" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" />,
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  'chevron-up': <path d="m6 14.5 6-6 6 6" />,
  'chevron-left': <path d="m14.5 6-6 6 6 6" />,
  'chevron-right': <path d="m9.5 6 6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  upload: <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
  print: (
    <>
      <path d="M7 8V3h10v5" />
      <rect x="3.5" y="8" width="17" height="8" rx="2" />
      <path d="M7 16h10v5H7z" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </>
  ),
  file: <path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6" />,
  wand: (
    <>
      <path d="m4 20 11-11" />
      <path d="M14 4.5 15.5 3M18 8h2M15 6.5 16.5 5M20 11l1.5-1.5M9 3.5 8 2" />
    </>
  ),
  grip: (
    <>
      <circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: <path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6L16 13l5 1.5V18a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />,
  'map-pin': (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  link: <path d="M9.5 14.5 14.5 9.5M8 16l-1.5 1.5a3.5 3.5 0 0 1-5-5L5 9m11 6 3.5-3.5a3.5 3.5 0 0 0-5-5L12 8" />,
  github: (
    <path d="M9 21v-3.2c-3 .6-4-1.4-4-1.4-.3-.9-.9-1.4-.9-1.4-1-.7 0-.7 0-.7 1 0 1.6 1 1.6 1 1 1.7 2.6 1.2 3.2.9.1-.8.4-1.2.7-1.5-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.1 1-2.9-.1-.3-.4-1.4.1-2.8 0 0 .9-.3 3 1.1a10.3 10.3 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.5 1.4.2 2.5.1 2.8.6.8 1 1.7 1 2.9 0 4.2-2.5 5.1-4.9 5.4.4.4.8 1.1.8 2.2V21" />
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10v7M7.5 7.2v.2M11.5 17v-4a2.3 2.3 0 0 1 4.6 0v4" />
    </>
  ),
  star: <path d="m12 3.5 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 10l6.1-.9L12 3.5Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  alert: <path d="M12 3.5 22 20H2L12 3.5Zm0 5.5v5m0 3v.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
      <path d="M15.5 5.5A2 2 0 0 0 13.5 3.5h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
      <path d="M3 9h18M9 9v11.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 2.6 15H2.4a2 2 0 1 1 0-4h.2A1.7 1.7 0 0 0 4.5 8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.5V4a2 2 0 1 1 4 0v.5A1.7 1.7 0 0 0 16.9 6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1.3Z" />
    </>
  ),
  'arrow-up': <path d="M12 19V5m0 0-6 6m6-6 6 6" />,
  'arrow-down': <path d="M12 5v14m0 0 6-6m-6 6-6-6" />,
  'arrow-right': <path d="M5 12h14m0 0-6-6m6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </>
  ),
  external: <path d="M14 4h6v6M20 4l-8 8M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
  type: <path d="M5 6h14M12 6v13M9 19h6M8 6V4h8v2" />,
  refresh: <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />,
  save: (
    <>
      <path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M8 3v6h7V3M8 21v-7h8v7" />
    </>
  ),
  'zoom-in': (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4M11 8v6M8 11h6" />
    </>
  ),
  'zoom-out': (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4M8 11h6" />
    </>
  ),
  maximize: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  key: (
    <>
      <circle cx="8" cy="8" r="4.5" />
      <path d="m11.5 11.5 8 8M17 17l-2 2M14.5 14.5 12.5 16.5" />
    </>
  ),
  edit: <path d="M15.5 4.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L15.5 4.5Z" />,
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>
  ),
  sliders: <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2M14 4v4M8 10v4M14 16v4" />,
  shield: <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Zm-2.5 9 2 2 4-4" />,
  translate: (
    <>
      <path d="M3 6h9M7.5 6v-3M9.5 6c0 4-2.5 7-5.5 9M5 10c1 2.5 3 4.5 5.5 5.5" />
      <path d="m13 20 4-11 4 11M14.5 16h5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="17" rx="2.5" />
      <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h3" />
    </>
  ),
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName | string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 18, strokeWidth = 1.7, ...rest }) => {
  const content = PATHS[name as IconName] ?? PATHS.file;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {content}
    </svg>
  );
};
