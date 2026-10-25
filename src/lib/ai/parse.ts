import { Certification, Education, Experience, Language, Proficiency, Project, ResumeData, Skill } from '../../types';
import { BLANK_DATA } from '../../constants/sample';
import { uid } from '../../utils';

export interface ParseResult {
  data: ResumeData;
  warnings: string[];
  confidence: number;
  stats: { experience: number; education: number; skills: number; sections: string[] };
}

type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certifications';

const SECTION_PATTERNS: { key: SectionKey; re: RegExp }[] = [
  { key: 'summary', re: /^(о себе|обо мне|профиль|summary|profile|about me|about|objective|цель|позиционирование)(?![\p{L}\p{N}])/iu },
  { key: 'experience', re: /^(опыт работы|опыт|трудовой опыт|experience|work experience|employment|professional experience|карьера|career)(?![\p{L}\p{N}])/iu },
  { key: 'education', re: /^(образование|education|обучение|академическое образование|academic)(?![\p{L}\p{N}])/iu },
  { key: 'skills', re: /^(навыки|ключевые навыки|технологии|стек|skills|key skills|tech stack|компетенции|technical skills|инструменты)(?![\p{L}\p{N}])/iu },
  { key: 'languages', re: /^(языки|languages|языковые навыки|language skills)(?![\p{L}\p{N}])/iu },
  { key: 'projects', re: /^(проекты|проект|projects|portfolio|портфолио|pet projects)(?![\p{L}\p{N}])/iu },
  { key: 'certifications', re: /^(сертификаты|сертификация|сертификаты и курсы|certificates|certifications|courses|курсы|licenses)(?![\p{L}\p{N}])/iu },
];

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/i;
const PHONE_RE = /(\+?\d[\d\s()-]{8,}\d)/;
const URL_RE = /((https?:\/\/)?(www\.)?([\w-]+\.)+(ru|com|io|dev|me|net|ai|app|co|design|tech|pro|site)(\/[\w#!:.?+=&%@~/[\]-]*)?)/i;
const KNOWN_LINK_RE = /(linkedin\.com|github\.com|gitlab\.com|t\.me|telegram|behance\.net|dribbble\.com|hh\.ru|medium\.com|notion\.(so|site)|youtube\.com|twitter\.com|x\.com|vk\.com|instagram\.com|facebook\.com|https?:\/\/|www\.)/i;

const MONTHS: Record<string, number> = {
  янв: 1, январь: 1, января: 1, feb: 2, фев: 2, февраль: 2, февраля: 2, mar: 3, мар: 3, март: 3, марта: 3,
  apr: 4, апр: 4, апрель: 4, апреля: 4, may: 5, май: 5, мая: 5, jun: 6, июн: 6, июнь: 6, июня: 6,
  jul: 7, июл: 7, июль: 7, июля: 7, aug: 8, авг: 8, август: 8, августа: 8, sep: 9, сент: 9, сен: 9, сентябрь: 9, сентября: 9,
  oct: 10, окт: 10, октябрь: 10, октября: 10, nov: 11, ноя: 11, ноябрь: 11, ноября: 11, dec: 12, дек: 12, декабрь: 12, декабря: 12,
  january: 1, february: 2, march: 3, april: 4, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

const CURRENT_TOKEN = /(наст\.?|настоящее|н\.?\s?в\.?|по н\.?\s?в\.?|сейчас|present|current|now|по настоящее время|today)/i;

const BULLET_RE = /^\s*([•·▪◦*\-–—]|\d+[.)])\s+/;

function normalizeLine(line: string): string {
  return line.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function stripBullet(line: string): string {
  return normalizeLine(line.replace(BULLET_RE, ''));
}

function isBullet(line: string): boolean {
  return BULLET_RE.test(line);
}

function matchSection(line: string): SectionKey | null {
  const clean = line
    .replace(/[:：]+$/, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .trim();
  if (clean.length > 42 || !clean) return null;
  for (const pattern of SECTION_PATTERNS) {
    if (pattern.re.test(clean)) return pattern.key;
  }
  return null;
}

/** Convert a human date token ("мар 2021", "03.2021", "2021") to YYYY-MM. */
function parseDateToken(token: string): string {
  const clean = token.toLowerCase().replace(/\.$/, '').trim();
  const numeric = clean.match(/^(\d{1,2})[./](\d{4})$/);
  if (numeric) return `${numeric[2]}-${numeric[1].padStart(2, '0')}`;
  const year = clean.match(/^(\d{4})$/);
  if (year) return year[1];
  const worded = clean.match(/^([\p{L}]+)\s*(\d{4})$/u);
  if (worded) {
    const month = MONTHS[worded[1].slice(0, 3)] ?? MONTHS[worded[1]];
    if (month) return `${worded[2]}-${String(month).padStart(2, '0')}`;
    return worded[2];
  }
  return '';
}

const DATE_TOKEN = String.raw`(\d{1,2}[./]\d{4}|\d{4}|[\p{L}]{3,12}\.?\s*\d{4})`;
const DATE_RANGE_RE = new RegExp(
  `${DATE_TOKEN}\\s*(?:[-–—]|по|to|until|до)\\s*(${DATE_TOKEN}|${CURRENT_TOKEN.source})`,
  'iu'
);

function extractDates(line: string): { start: string; end: string; current: boolean; matched: string } | null {
  const match = line.match(DATE_RANGE_RE);
  if (match) {
    const current = CURRENT_TOKEN.test(match[2]);
    return {
      start: parseDateToken(match[1]),
      end: current ? '' : parseDateToken(match[2]),
      current,
      matched: match[0],
    };
  }
  // single year — "2023" or "с 2020"
  const single = line.match(new RegExp(String.raw`(?:^|[\s(,|])(?:с\s+)?${DATE_TOKEN}(?=$|[\s),|])`, 'iu'));
  if (single) {
    const start = parseDateToken(single[1]);
    if (start && !CURRENT_TOKEN.test(line)) {
      return { start, end: '', current: false, matched: single[0] };
    }
  }
  return null;
}

function removeDates(line: string): string {
  return normalizeLine(
    line
      .replace(DATE_RANGE_RE, ' ')
      .replace(/\b(с|from|since)\s+\d{4}\b/gi, ' ')
      .replace(/\(\s*\)/g, ' ')
      .replace(/[|·•]\s*$/g, '')
      .replace(/^[\s|·•,-]+|[\s|·•,-]+$/g, '')
  );
}

const POSITION_HINTS =
  /(developer|engineer|manager|designer|analyst|specialist|consultant|director|lead|head|architect|intern|assistant|разработчик|инженер|менеджер|дизайнер|аналитик|специалист|консультант|директор|руководител|архитектор|стажер|стажёр|помощник|product|продакт|qa|тестировщик|маркетолог|бухгалтер|рекрутер|hr|smm|продавец|преподавател)/i;
const COMPANY_HINTS =
  /(ооо|оао|зао|ип|ао|llc|inc|ltd|corp|company|group|studio|agency|bank|банк|технолог|software|systems|digital|labs|lab|school|university|университет|институт|академия|компания|фирма)/i;
const LOCATION_HINTS =
  /^(москва|санкт-петербург|спб|питер|казань|новосибирск|екатеринбург|нижний новгород|самара|омск|ростов|уфа|красноярск|воронеж|пермь|волгоград|краснодар|сочи|тюмень|алматы|минск|киев|ташкент|бишкек|тбилиси|ереван|дубай|moscow|saint petersburg|remote|удаленн|удалённ|гибрид|hybrid|офис|office)/i;

function splitHeader(line: string): { position: string; company: string; location: string } {
  let rest = removeDates(line);
  let location = '';
  const pipeParts = rest.split(/\s*[|·•]\s*/).map((p) => normalizeLine(p)).filter(Boolean);
  if (pipeParts.length > 1) {
    const locPart = pipeParts.find((p) => LOCATION_HINTS.test(p) && p.split(' ').length <= 3);
    if (locPart) {
      location = locPart;
      rest = pipeParts.filter((p) => p !== locPart).join(' — ');
    }
  }

  const parts = rest
    .split(/\s+[—–]\s+|\s+-\s+|\s+@\s+|\s+at\s+|\s*,\s*/i)
    .map((p) => normalizeLine(p))
    .filter(Boolean);

  if (!parts.length) return { position: '', company: '', location };
  if (parts.length === 1) {
    const single = parts[0];
    if (POSITION_HINTS.test(single)) return { position: single, company: '', location };
    if (COMPANY_HINTS.test(single)) return { position: '', company: single, location };
    return { position: single, company: '', location };
  }

  const [first, second] = parts;
  const firstIsCompany = COMPANY_HINTS.test(first) || (!POSITION_HINTS.test(first) && POSITION_HINTS.test(second));
  if (firstIsCompany) {
    return { position: second, company: first, location };
  }
  if (LOCATION_HINTS.test(second) && second.split(' ').length <= 3) {
    return { position: first, company: '', location: second };
  }
  return { position: first, company: second, location };
}

function parseExperienceSection(lines: string[]): Experience[] {
  const dateLineIndexes: number[] = [];
  lines.forEach((line, index) => {
    if (extractDates(line) && !isBullet(line)) dateLineIndexes.push(index);
  });

  const blocks: string[][] = [];

  if (dateLineIndexes.length) {
    const consumed = new Set<number>();
    for (let d = 0; d < dateLineIndexes.length; d += 1) {
      const dateIndex = dateLineIndexes[d];
      if (consumed.has(dateIndex)) continue;
      const headerLines: number[] = [];
      // look back up to 2 non-bullet lines for the position / company
      for (let i = dateIndex - 1; i >= 0 && headerLines.length < 2; i -= 1) {
        if (consumed.has(i)) break;
        if (isBullet(lines[i])) break;
        if (!normalizeLine(lines[i])) break;
        headerLines.unshift(i);
      }
      const nextDate = dateLineIndexes[d + 1] ?? lines.length;
      const body: number[] = [];
      for (let i = dateIndex + 1; i < nextDate; i += 1) {
        const line = normalizeLine(lines[i]);
        if (!line) continue;
        if (!isBullet(line) && body.length > 0) break;
        if (!isBullet(line) && body.length === 0 && /[:]$/.test(line)) break;
        body.push(i);
      }
      const blockIndexes = [...headerLines, dateIndex, ...body];
      blockIndexes.forEach((i) => consumed.add(i));
      blocks.push(blockIndexes.map((i) => lines[i]));
    }
    // any leftover non-empty lines that look like entries (no dates) — attach as blocks
    const leftovers = lines.filter((_, i) => !consumed.has(i) && normalizeLine(lines[i]));
    if (leftovers.length && blocks.length === 0) blocks.push(leftovers);
  } else {
    let current: string[] = [];
    for (const line of lines) {
      if (!normalizeLine(line)) {
        if (current.length) {
          blocks.push(current);
          current = [];
        }
        continue;
      }
      if (!isBullet(line) && current.length > 0 && current.some((l) => isBullet(l)) && POSITION_HINTS.test(line)) {
        blocks.push(current);
        current = [line];
        continue;
      }
      current.push(line);
    }
    if (current.length) blocks.push(current);
  }

  return blocks
    .map((block) => {
      const nonEmpty = block.map((l) => normalizeLine(l)).filter(Boolean);
      if (!nonEmpty.length) return null;
      const dateEntry = nonEmpty.map((l) => extractDates(l)).find(Boolean) ?? null;
      const headerLine = nonEmpty.find((l) => !isBullet(l) && !extractDates(l)) ?? nonEmpty[0];
      const { position, company, location } = splitHeader(headerLine);
      const highlights = nonEmpty
        .filter((l) => isBullet(l))
        .map(stripBullet)
        .filter((l) => l.length > 2);
      const descriptionSource = nonEmpty.filter(
        (l) => !isBullet(l) && l !== headerLine && !extractDates(l)
      );
      if (!position && !company && !highlights.length) return null;
      return {
        id: uid(),
        position: position || '',
        company: company || '',
        location,
        startDate: dateEntry?.start ?? '',
        endDate: dateEntry?.end ?? '',
        current: dateEntry?.current ?? false,
        description: descriptionSource.join(' '),
        highlights,
      } as Experience;
    })
    .filter((item): item is Experience => Boolean(item));
}

function parseEducationSection(lines: string[]): Education[] {
  const blocks: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (!normalizeLine(line)) {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
      continue;
    }
    current.push(line);
  }
  if (current.length) blocks.push(current);

  return blocks
    .map((block) => {
      const text = block.map((l) => normalizeLine(l)).filter(Boolean);
      if (!text.length) return null;
      const joined = text.join(' ');
      const years = [...joined.matchAll(/\b(19|20)\d{2}\b/g)].map((m) => m[0]);
      const institutionLine =
        text.find((l) => /(университет|институт|академия|колледж|техникум|школа|university|institute|college|school|academy)/i.test(l)) ??
        text[0];
      const degreeLine =
        text.find((l) => /(бакалавр|магистр|специалист|аспирант|кандидат|доктор|bachelor|master|phd|associate|mba)/i.test(l)) ?? '';
      const fieldMatch = degreeLine.match(/(?:по\s+(?:специальности|направлению)\s+)?[«"](.+?)[»"]/) ??
        joined.match(/(?:факультет|специальность|направление|major|field)[:\s]+([^.,;|]+)/i);
      const degreeParts = degreeLine
        .replace(/[«"].+?[»"]/g, '')
        .replace(/\b(19|20)\d{2}\b/g, '')
        .split(/\s*[,;|·•]\s*/)
        .map((part) => part.trim())
        .filter(Boolean);
      const degree = degreeParts[0] ?? '';
      const degreeField = degreeParts.slice(1).join(', ');
      return {
        id: uid(),
        institution: institutionLine.replace(/\b(19|20)\d{2}\b/g, '').replace(/[,;|·•-]+\s*$/g, '').trim(),
        degree: degree || (degreeLine ? degreeLine : ''),
        field: (fieldMatch?.[1] ?? degreeField ?? '').trim(),
        startYear: years[0] ?? '',
        endYear: years[1] ?? '',
        location: '',
      } as Education;
    })
    .filter((item): item is Education => Boolean(item));
}

const LEVEL_WORDS: { re: RegExp; level: number }[] = [
  { re: /(эксперт|expert|advanced|продвинут|senior|профессионал)/i, level: 5 },
  { re: /(уверенн|продвинут|upper|сильный|strong|хорош)/i, level: 4 },
  { re: /(средн|intermediate|базов|base|basic|beginner|начал)/i, level: 2 },
];

function parseSkillsSection(lines: string[]): Skill[] {
  const raw = lines
    .map((l) => stripBullet(l))
    .filter(Boolean)
    .join(', ')
    .split(/[,;|·•\n]+/)
    .map((s) => normalizeLine(s))
    .filter(Boolean);

  const seen = new Set<string>();
  const skills: Skill[] = [];
  for (const item of raw) {
    let name = item;
    let level = 3;
    const levelNumber = item.match(/(?:^|\s)[—:(-]?\s*([1-5])\s*(?:\/\s*5)?\)?$/);
    if (levelNumber) {
      level = Number(levelNumber[1]);
      name = item.replace(/[—:(-]?\s*[1-5]\s*(?:\/\s*5)?\)?$/, '');
    } else {
      const found = LEVEL_WORDS.find((l) => l.re.test(item));
      if (found) level = found.level;
      name = item
        .replace(/\((?:[^)]*)\)/g, '')
        .replace(/\s*[—:-]\s*(эксперт|expert|advanced|продвинутый|уверенный|средний|intermediate|базовый|basic|beginner|начальный).*/i, '');
    }
    name = normalizeLine(name).replace(/[.,;:]$/, '');
    if (!name || name.length > 46) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    skills.push({ id: uid(), name, level });
  }
  return skills.slice(0, 30);
}

const PROFICIENCY_MAP: { re: RegExp; value: Proficiency }[] = [
  { re: /(native|родной|носител)/i, value: 'Native' },
  { re: /(c2|свободн|fluent|proficient)/i, value: 'C2' },
  { re: /(c1|advanced|продвинут)/i, value: 'C1' },
  { re: /(b2|upper[- ]?intermediate|выше среднего)/i, value: 'B2' },
  { re: /(b1|intermediate|средний)/i, value: 'B1' },
  { re: /(a2|elementary|базов|начальн)/i, value: 'A2' },
  { re: /(a1|beginner|начинающ)/i, value: 'A1' },
];

function parseLanguagesSection(lines: string[]): Language[] {
  return lines
    .map((l) => stripBullet(l))
    .filter(Boolean)
    .flatMap((line) => line.split(/[,;|•·]+/))
    .map((item) => normalizeLine(item))
    .filter(Boolean)
    .map((item) => {
      const proficiency = PROFICIENCY_MAP.find((p) => p.re.test(item))?.value ?? 'B2';
      const name = normalizeLine(
        item
          .replace(/\((?:[^)]*)\)/g, '')
          .replace(/[—:-]\s*.*$/, '')
          .replace(/\b(a1|a2|b1|b2|c1|c2|native|родной|свободн\w*|fluent|advanced|intermediate|upper|beginner|базов\w*)\b/gi, '')
          .replace(/[,;]/g, '')
      );
      if (!name || name.length > 30) return null;
      return { id: uid(), name, proficiency } as Language;
    })
    .filter((item): item is Language => Boolean(item));
}

function parseProjectsSection(lines: string[]): Project[] {
  const blocks: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (!normalizeLine(line)) {
      if (current.length) {
        blocks.push(current);
        current = [];
      }
      continue;
    }
    current.push(line);
  }
  if (current.length) blocks.push(current);

  return blocks
    .map((block) => {
      const rows = block.map((l) => normalizeLine(l)).filter(Boolean);
      if (!rows.length) return null;
      const titleLine = rows.find((l) => !isBullet(l)) ?? rows[0];
      const urlMatch = block.join(' ').match(URL_RE);
      const cleaned = removeDates(titleLine);
      const [name, role = ''] = cleaned.split(/\s+[—–|]\s+/).map((s) => s.trim());
      return {
        id: uid(),
        name: name || '',
        role,
        url: urlMatch?.[0] ?? '',
        startDate: '',
        endDate: '',
        description: rows.filter((l) => !isBullet(l) && l !== titleLine).join(' '),
        highlights: rows.filter(isBullet).map(stripBullet),
      } as Project;
    })
    .filter((item): item is Project => Boolean(item));
}

function parseCertificationsSection(lines: string[]): Certification[] {
  return lines
    .map((l) => stripBullet(l))
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*[—–|,]\s*/).map((p) => normalizeLine(p)).filter(Boolean);
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      return {
        id: uid(),
        name: parts[0] || line,
        issuer: parts[1] || '',
        date: yearMatch?.[0] ?? '',
        url: line.match(URL_RE)?.[0] ?? '',
      } as Certification;
    })
    .filter((c) => c.name.length > 2);
}

/** Main entry point: free-form CV text → structured resume. */
export function parseResumeText(raw: string): ParseResult {
  const warnings: string[] = [];
  const lines = raw.replace(/\r/g, '').split('\n').map(normalizeLine);
  const data: ResumeData = JSON.parse(JSON.stringify(BLANK_DATA)) as ResumeData;
  data.personal.links = [];

  const sections: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certifications: [],
  };

  const headerLines: string[] = [];
  let currentSection: SectionKey | null = null;
  let seenAnySection = false;

  for (const line of lines) {
    if (!line) {
      if (currentSection) sections[currentSection].push('');
      continue;
    }
    const section = matchSection(line);
    if (section) {
      currentSection = section;
      seenAnySection = true;
      continue;
    }
    if (currentSection) sections[currentSection].push(line);
    else headerLines.push(line);
  }

  /* ── contacts & links ── */
  const allText = lines.join('\n');
  const email = allText.match(EMAIL_RE)?.[0] ?? '';
  const phoneMatch = allText.match(PHONE_RE)?.[0] ?? '';
  const phone = phoneMatch.replace(/\s+/g, ' ').trim();
  if (email) data.personal.email = email;
  if (phone) data.personal.phone = phone;

  const linkLines = lines.filter(
    (l) =>
      URL_RE.test(l) &&
      KNOWN_LINK_RE.test(l) &&
      !EMAIL_RE.test(l) &&
      !matchSection(l) &&
      !/[—–]/.test(l)
  );
  const seenLinks = new Set<string>();
  for (const line of linkLines.slice(0, 6)) {
    const urlMatch = line.match(URL_RE)?.[0];
    if (!urlMatch) continue;
    if (seenLinks.has(urlMatch)) continue;
    seenLinks.add(urlMatch);
    const host = urlMatch.replace(/^https?:\/\//, '').split('/')[0];
    let label = 'Сайт';
    if (/linkedin/i.test(urlMatch)) label = 'LinkedIn';
    else if (/github/i.test(urlMatch)) label = 'GitHub';
    else if (/t\.me|telegram/i.test(urlMatch)) label = 'Telegram';
    else if (/behance/i.test(urlMatch)) label = 'Behance';
    else if (/dribbble/i.test(urlMatch)) label = 'Dribbble';
    else if (/hh\.ru/i.test(urlMatch)) label = 'hh.ru';
    else if (/gitlab/i.test(urlMatch)) label = 'GitLab';
    else label = host;
    data.personal.links.push({ id: uid(), label, url: urlMatch.replace(/^https?:\/\//, '') });
  }

  /* ── name / title / location ── */
  const headerCandidates = headerLines.filter(
    (l) => !EMAIL_RE.test(l) && !PHONE_RE.test(l) && !URL_RE.test(l)
  );
  const sectionTitles = new Set(SECTION_PATTERNS.map((p) => p.key));
  void sectionTitles;

  const nameCandidate = headerCandidates.find(
    (l) =>
      l.length <= 55 &&
      l.split(' ').length >= 2 &&
      l.split(' ').length <= 4 &&
      /^[\p{L}][\p{L}\s.'-]+$/u.test(l) &&
      !POSITION_HINTS.test(l)
  );
  if (nameCandidate) data.personal.fullName = nameCandidate;

  const titleCandidate = headerCandidates.find(
    (l) => l !== nameCandidate && l.length <= 80 && !LOCATION_HINTS.test(l) && !/^\d/.test(l)
  );
  if (titleCandidate) data.personal.jobTitle = titleCandidate;

  const locationCandidate = lines.find((l) => LOCATION_HINTS.test(l) && l.length <= 60 && !isBullet(l));
  if (locationCandidate) {
    const cleaned = locationCandidate
      .replace(EMAIL_RE, '')
      .replace(PHONE_RE, '')
      .replace(/\s*[|·•].*$/, '')
      .replace(/^[\s,•-]+|[\s,•-]+$/g, '');
    if (cleaned && cleaned.length <= 60) data.personal.location = cleaned;
  }

  /* ── sections ── */
  data.summary = sections.summary
    .map((l) => stripBullet(l))
    .filter(Boolean)
    .join(' ')
    .trim();

  if (sections.experience.filter(Boolean).length) {
    data.experience = parseExperienceSection(sections.experience);
  }
  if (sections.education.filter(Boolean).length) {
    data.education = parseEducationSection(sections.education);
  }
  if (sections.skills.filter(Boolean).length) {
    data.skills = parseSkillsSection(sections.skills);
  }
  if (sections.languages.filter(Boolean).length) {
    data.languages = parseLanguagesSection(sections.languages);
  }
  if (sections.projects.filter(Boolean).length) {
    data.projects = parseProjectsSection(sections.projects);
  }
  if (sections.certifications.filter(Boolean).length) {
    data.certifications = parseCertificationsSection(sections.certifications);
  }

  const foundSections = (Object.keys(sections) as SectionKey[]).filter(
    (key) => sections[key].filter(Boolean).length > 0
  );

  /* ── fallback: no headings at all ── */
  if (!seenAnySection) {
    warnings.push('Не нашли заголовки разделов — попробуйте добавить «Опыт работы», «Образование», «Навыки».');
    const blocks = raw.split(/\n\s*\n/).map((b) => b.split('\n')).filter((b) => b.length > 1);
    data.experience = parseExperienceSection(blocks.slice(1).flatMap((b) => [...b, '']));
    const guessedSkills = parseSkillsSection(
      lines.filter((l) => /,/.test(l) && l.length < 220 && !extractDates(l) && !isBullet(l))
    );
    data.skills = guessedSkills.slice(0, 12);
  } else if (!data.experience.length) {
    warnings.push('Не удалось разобрать опыт работы: проверьте формат дат и разделы.');
  }

  if (!data.personal.fullName) warnings.push('Имя не найдено — заполните вручную.');
  if (!data.personal.email && !data.personal.phone) warnings.push('Контакты не найдены — добавьте email и телефон.');
  if (!data.skills.length) warnings.push('Навыки не распознаны — добавьте их вручную или загрузите список.');
  if (!data.education.length) warnings.push('Образование не найдено.');
  if (data.experience.length && data.experience.every((e) => !e.startDate)) {
    warnings.push('Даты в опыте не распознаны — проверьте формат «Мар 2021 — Мар 2023».');
  }
  if (data.summary && data.summary.length > 900) {
    data.summary = `${data.summary.slice(0, 897)}…`;
    warnings.push('Профиль обрезан до 900 символов.');
  }

  let confidence = 35;
  if (data.personal.fullName) confidence += 15;
  if (data.personal.email || data.personal.phone) confidence += 15;
  if (data.personal.jobTitle) confidence += 10;
  if (data.experience.length) confidence += 15;
  if (data.skills.length) confidence += 10;

  return {
    data,
    warnings,
    confidence: Math.min(98, confidence),
    stats: {
      experience: data.experience.length,
      education: data.education.length,
      skills: data.skills.length,
      sections: foundSections,
    },
  };
}

export const SAMPLE_IMPORT_TEXT = `Александр Иванов
Senior Frontend Developer
Москва, Россия · alex.ivanov@email.com · +7 (999) 123-45-67
linkedin.com/in/alexivanov · github.com/alexivanov

О себе
Frontend-разработчик с 6+ годами опыта в продуктовых командах. Специализируюсь на React, TypeScript и дизайн-системах. Снижал время загрузки ключевых сценариев на 40%.

Опыт работы
TechCorp — Senior Frontend Developer
Мар 2021 — настоящее время
• Снизил время загрузки дашборда с 4.2 до 2.5 секунд за счёт code-splitting
• Спроектировал дизайн-систему из 60+ компонентов
• Руководил командой из 5 разработчиков

StartupXYZ — Frontend Developer
Июн 2019 — Фев 2021
• Перевёл интерфейс с jQuery на React и TypeScript
• Оптимизировал таблицы с 10k+ строк — рендер ускорился в 6 раз

Образование
МГУ им. М. В. Ломоносова
Бакалавр, Прикладная математика и информатика
2015 — 2019

Навыки
React, TypeScript, Next.js, Node.js, GraphQL, Docker, Figma

Языки
Русский — родной, Английский — C1

Сертификаты
AWS Certified Developer — Amazon Web Services, 2023
Professional Scrum Master I — Scrum.org, 2022`;
