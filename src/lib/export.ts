import { ResumeConfig, ResumeData } from '../types';
import { A4, downloadBlob, downloadText, slugify } from '../utils';

/** Wait for web fonts + images so the capture matches what the user sees. */
async function prepareForCapture(root: HTMLElement): Promise<void> {
  if ('fonts' in document) {
    await document.fonts.ready;
  }
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

export async function captureResumeCanvas(root: HTMLElement, scale = 2): Promise<HTMLCanvasElement> {
  await prepareForCapture(root);
  const html2canvas = (await import('html2canvas')).default;
  return html2canvas(root, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: A4.width,
    scrollX: 0,
    scrollY: 0,
    windowWidth: A4.width,
  });
}

/** Find a nearly-uniform horizontal line close to the target to avoid cutting text. */
function findSafeBreak(
  ctx: CanvasRenderingContext2D,
  width: number,
  targetY: number,
  minY: number,
  maxY: number
): number {
  const searchRadius = 90;
  const from = Math.max(minY, targetY - searchRadius);
  const to = Math.min(maxY, targetY + 40);
  let best = targetY;
  let bestScore = Infinity;

  for (let y = to; y >= from; y -= 2) {
    const row = ctx.getImageData(0, y, width, 1).data;
    let min = 255;
    let max = 0;
    for (let i = 0; i < row.length; i += 4) {
      const value = (row[i] + row[i + 1] + row[i + 2]) / 3;
      if (value < min) min = value;
      if (value > max) max = value;
    }
    const uniform = max - min;
    const distance = Math.abs(targetY - y);
    const score = uniform * 4 + distance;
    if (score < bestScore) {
      bestScore = score;
      best = y;
    }
    if (uniform < 6) return y;
  }
  return best;
}

function trimCanvasBottom(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const { width, height } = canvas;
  let lastContent = height - 1;
  for (let y = height - 1; y > height * 0.3; y -= 2) {
    const row = ctx.getImageData(0, y, width, 1).data;
    let hasContent = false;
    for (let i = 0; i < row.length; i += 4) {
      if (row[i] < 245 || row[i + 1] < 245 || row[i + 2] < 245) {
        hasContent = true;
        break;
      }
    }
    if (hasContent) {
      lastContent = Math.min(height, y + 48);
      break;
    }
  }
  if (lastContent >= height - 2) return canvas;
  const trimmed = document.createElement('canvas');
  trimmed.width = width;
  trimmed.height = lastContent;
  const trimmedCtx = trimmed.getContext('2d');
  if (trimmedCtx) {
    trimmedCtx.fillStyle = '#ffffff';
    trimmedCtx.fillRect(0, 0, width, lastContent);
    trimmedCtx.drawImage(canvas, 0, 0);
  }
  return trimmed;
}

export async function exportResumePdf(
  root: HTMLElement,
  data: ResumeData,
  options: { filename?: string } = {}
): Promise<void> {
  const canvas = trimCanvasBottom(await captureResumeCanvas(root, 2));
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

  const pageWidth = 210;
  const pageHeight = 297;
  const pxPerPage = Math.round((canvas.width * pageHeight) / pageWidth);
  const ctx = canvas.getContext('2d');

  const name = options.filename || data.personal.fullName || 'resume';
  pdf.setProperties({
    title: `Резюме — ${data.personal.fullName}`.trim(),
    subject: data.personal.jobTitle,
    author: data.personal.fullName,
    creator: 'Resume Studio',
  });

  let offset = 0;
  let page = 0;
  while (offset < canvas.height && page < 12) {
    const targetEnd = Math.min(canvas.height, offset + pxPerPage);
    const end =
      targetEnd < canvas.height && ctx
        ? findSafeBreak(ctx, canvas.width, targetEnd, offset + Math.floor(pxPerPage * 0.5), targetEnd)
        : targetEnd;

    const sliceHeight = Math.max(1, end - offset);
    const slice = document.createElement('canvas');
    slice.width = canvas.width;
    slice.height = sliceHeight;
    const sliceCtx = slice.getContext('2d');
    if (sliceCtx) {
      sliceCtx.fillStyle = '#ffffff';
      sliceCtx.fillRect(0, 0, canvas.width, sliceHeight);
      sliceCtx.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
    }

    if (page > 0) pdf.addPage();
    pdf.addImage(
      slice.toDataURL('image/jpeg', 0.96),
      'JPEG',
      0,
      0,
      pageWidth,
      (sliceHeight / canvas.width) * pageWidth,
      undefined,
      'FAST'
    );

    offset = end;
    page += 1;
    if (page >= 12) break;
  }

  pdf.save(`${slugify(name) || 'resume'}.pdf`);
}

export async function exportResumePng(
  root: HTMLElement,
  data: ResumeData,
  backgroundColor = '#ffffff'
): Promise<void> {
  const canvas = trimCanvasBottom(await captureResumeCanvas(root, 2));
  const withBg = document.createElement('canvas');
  withBg.width = canvas.width;
  withBg.height = canvas.height;
  const ctx = withBg.getContext('2d');
  if (ctx) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, withBg.width, withBg.height);
    ctx.drawImage(canvas, 0, 0);
  }
  await new Promise<void>((resolve) => {
    withBg.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `${slugify(data.personal.fullName) || 'resume'}.png`);
      }
      resolve();
    }, 'image/png');
  });
}

/** Native print → vector, selectable text PDF. */
export async function printResume(): Promise<void> {
  if ('fonts' in document) await document.fonts.ready;
  window.print();
}

export function exportResumeJson(
  data: ResumeData,
  config: ResumeConfig,
  docName: string
): void {
  const payload = {
    app: 'resume-studio',
    version: 2,
    exportedAt: new Date().toISOString(),
    docName,
    data,
    config,
  };
  downloadText(JSON.stringify(payload, null, 2), `${slugify(docName) || 'resume'}.json`);
}

export async function readJsonFile(file: File): Promise<{
  data?: ResumeData;
  config?: ResumeConfig;
  docName?: string;
}> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const payload = parsed?.data ? parsed : { data: parsed };
  return {
    data: payload.data,
    config: payload.config,
    docName: payload.docName,
  };
}

export function exportMarkdown(data: ResumeData): void {
  const lines: string[] = [`# ${data.personal.fullName}`, data.personal.jobTitle, ''];
  const contacts = [data.personal.email, data.personal.phone, data.personal.location]
    .filter(Boolean)
    .join(' · ');
  if (contacts) lines.push(contacts, '');
  if (data.personal.links.length) {
    lines.push(data.personal.links.map((l) => `[${l.label || l.url}](${l.url})`).join(' · '), '');
  }
  if (data.summary) lines.push('## О себе', data.summary, '');
  if (data.experience.length) {
    lines.push('## Опыт работы');
    for (const exp of data.experience) {
      lines.push(
        `### ${exp.position} — ${exp.company}`,
        `${exp.startDate} — ${exp.current ? 'наст. время' : exp.endDate}`,
        exp.description,
        ...exp.highlights.map((h) => `- ${h}`),
        ''
      );
    }
  }
  if (data.skills.length) {
    lines.push('## Навыки', data.skills.map((s) => s.name).join(', '), '');
  }
  if (data.education.length) {
    lines.push('## Образование');
    for (const edu of data.education) {
      lines.push(`- ${edu.institution} — ${edu.degree} ${edu.field} (${edu.startYear}–${edu.endYear})`);
    }
    lines.push('');
  }
  if (data.projects.length) {
    lines.push('## Проекты');
    for (const p of data.projects) {
      lines.push(`- **${p.name}** ${p.url} — ${p.description}`);
    }
    lines.push('');
  }
  if (data.languages.length) {
    lines.push('## Языки', data.languages.map((l) => `${l.name} — ${l.proficiency}`).join(', '));
  }
  downloadText(lines.join('\n'), `${slugify(data.personal.fullName) || 'resume'}.md`, 'text/markdown');
}
