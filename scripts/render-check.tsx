import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TemplateRenderer } from '../src/components/TemplateRenderer';
import { DEMO_DATA, DEFAULT_CONFIG, BLANK_DATA } from '../src/constants/sample';
import { TEMPLATES, PALETTES, FONT_OPTIONS } from '../src/constants';
import { ResumeConfig } from '../src/types';
import { parseResumeText, SAMPLE_IMPORT_TEXT } from '../src/lib/ai/parse';
import { analyzeResume } from '../src/lib/ai/quality';

const parsed = parseResumeText(SAMPLE_IMPORT_TEXT);
console.log('PARSE confidence:', parsed.confidence);
console.log('  name:', parsed.data.personal.fullName, '| title:', parsed.data.personal.jobTitle);
console.log('  contacts:', parsed.data.personal.email, parsed.data.personal.phone, parsed.data.personal.location);
console.log('  links:', parsed.data.personal.links.map((l) => `${l.label}=${l.url}`).join(', '));
console.log('  experience:', parsed.data.experience.map((e) => `${e.position}@${e.company} ${e.startDate}-${e.endDate}${e.current ? ' (now)' : ''} [${e.highlights.length}]`));
console.log('  education:', parsed.data.education.map((e) => `${e.institution} / ${e.degree} / ${e.field} / ${e.startYear}-${e.endYear}`));
console.log('  skills:', parsed.data.skills.map((s) => s.name).join(', '));
console.log('  languages:', parsed.data.languages.map((l) => `${l.name}:${l.proficiency}`).join(', '));
console.log('  certs:', parsed.data.certifications.map((c) => `${c.name} / ${c.issuer} / ${c.date}`).join(' | '));
console.log('  warnings:', parsed.warnings);

const report = analyzeResume(DEMO_DATA, 'Ищем React разработчика с TypeScript, GraphQL, Docker и опытом дизайн-систем');
console.log('QUALITY score:', report.score, '| words:', report.wordCount, '| missing:', report.missingKeywords.join(','));

let failures = 0;
for (const template of TEMPLATES) {
  for (const palette of PALETTES.slice(0, 2)) {
    for (const font of FONT_OPTIONS.slice(0, 2)) {
      const config: ResumeConfig = { ...DEFAULT_CONFIG, templateId: template.id, colorScheme: palette, font: font.value };
      for (const data of [DEMO_DATA, BLANK_DATA]) {
        try {
          const html = renderToStaticMarkup(<TemplateRenderer data={data} config={config} />);
          if (html.length < 200) {
            failures += 1;
            console.log('TOO SHORT', template.id, palette.id, font.value, html.length);
          }
        } catch (error) {
          failures += 1;
          console.log('RENDER FAIL', template.id, palette.id, font.value, (error as Error).message);
        }
      }
    }
  }
  const html = renderToStaticMarkup(
    <TemplateRenderer data={DEMO_DATA} config={{ ...DEFAULT_CONFIG, templateId: template.id }} />
  );
  console.log(template.id, 'ok, html length', html.length);
}

console.log(failures === 0 ? 'ALL TEMPLATES OK' : `${failures} FAILURES`);
