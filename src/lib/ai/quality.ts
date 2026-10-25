import { QualityCheck, QualityReport, ResumeData } from '../../types';
import { filledCertifications, filledEducation, filledExperience, filledProjects } from '../sections';

const STOPWORDS = new Set([
  'и','в','во','не','что','он','на','я','с','со','как','а','то','все','она','так','его','но','да','ты','к','у','же','вы','за','бы','по','только','ее','мне','было','вот','от','меня','еще','нет','о','из','ему','теперь','когда','даже','ну','вдруг','ли','если','уже','или','ни','быть','был','него','до','вас','нибудь','опять','уж','вам','ведь','там','потом','себя','ничего','ей','может','они','тут','где','есть','надо','ней','для','мы','тебя','их','чем','была','сам','чтоб','без','будто','чего','раз','тоже','себе','под','будет','ж','тогда','кто','этот','того','потому','этого','какой','совсем','ним','здесь','этом','один','почти','мой','тем','чтобы','нее','сейчас','были','куда','зачем','всех','никогда','можно','при','наконец','два','об','другой','хоть','после','над','больше','тот','через','эти','нас','про','всего','них','какая','много','разве','три','эту','моя','впрочем','хорошо','свою','этой','перед','иногда','лучше','чуть','том','нельзя','такой','им','более','всегда','конечно','всю','между',
  'the','and','for','with','you','your','our','are','will','that','this','have','from','not','but','all','can','has','was','were','they','their','who','what','when','which','been','more','about','into','than','them','then','there','here','also','its','his','her','she','him','how','why','out','use','used','using','work','working','team','teams','role','company','experience','skills','ability','able','strong','good','great','must','should','would','could','need','needs','plus','nice','have','looking','join','new','years','year','month',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#.\s-]/gu, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[-.]+|[-.]+$/g, ''))
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

export function extractKeywords(text: string, limit = 25): string[] {
  const counts = new Map<string, number>();
  for (const word of tokenize(text)) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

export function resumeToText(data: ResumeData): string {
  const parts: string[] = [
    data.personal.fullName,
    data.personal.jobTitle,
    data.personal.location,
    data.summary,
  ];
  for (const exp of filledExperience(data)) {
    parts.push(exp.position, exp.company, exp.description, ...exp.highlights);
  }
  for (const edu of filledEducation(data)) parts.push(edu.institution, edu.degree, edu.field);
  for (const skill of data.skills) parts.push(skill.name);
  for (const project of filledProjects(data)) parts.push(project.name, project.role, project.description, ...project.highlights);
  for (const cert of filledCertifications(data)) parts.push(cert.name, cert.issuer);
  for (const section of data.customSections) {
    parts.push(section.title);
    for (const item of section.items) parts.push(item.title, item.subtitle, item.description);
  }
  return parts.filter(Boolean).join('\n');
}

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function analyzeResume(data: ResumeData, vacancy = ''): QualityReport {
  const checks: QualityCheck[] = [];
  const text = resumeToText(data);
  const experience = filledExperience(data);
  const bulletCount = experience.reduce(
    (sum, e) => sum + e.highlights.filter((h) => h.trim()).length,
    0
  );
  const allBullets = experience.flatMap((e) => e.highlights.filter(Boolean));
  const quantified = allBullets.filter((b) => /\d|%|₽|\$|€/.test(b)).length;
  const actionStart = allBullets.filter((b) =>
    /^[А-ЯA-Z][а-яa-z]+(л|ла|ли|н|а|ен|ил|ал|ся)\b/.test(b.trim()) ||
    /^(увелич|сниз|запуст|внедр|автоматиз|оптимиз|спроект|возглав|переработ|масштаб|ускор|сократ|разраб|созда|руковод|постро|выстро|наладил|улучшил|управлял)/i.test(b.trim())
  ).length;

  const push = (check: QualityCheck) => checks.push(check);

  push({
    id: 'identity',
    label: 'Имя и должность заполнены',
    status: data.personal.fullName.trim() && data.personal.jobTitle.trim() ? 'pass' : 'fail',
    hint: 'Рекрутер должен за 5 секунд понять, кто вы и на какую роль претендуете.',
    weight: 10,
  });

  const hasEmail = /\S+@\S+\.\S+/.test(data.personal.email);
  const hasPhone = data.personal.phone.replace(/\D/g, '').length >= 10;
  push({
    id: 'contacts',
    label: 'Контакты: email и телефон',
    status: hasEmail && hasPhone ? 'pass' : hasEmail || hasPhone ? 'warn' : 'fail',
    hint: 'Добавьте рабочий email и телефон — без них отклик теряется.',
    weight: 10,
  });

  const summaryWords = countWords(data.summary);
  push({
    id: 'summary',
    label: 'Резюме-профиль (3–5 строк)',
    status: summaryWords >= 25 && summaryWords <= 140 ? 'pass' : summaryWords > 0 ? 'warn' : 'fail',
    hint: 'Короткий профиль с ролью, опытом и сильными сторонами повышает отклик.',
    weight: 12,
  });

  push({
    id: 'experience',
    label: 'Опыт: не менее 2 мест или 1 подробное',
    status: experience.length >= 2 ? 'pass' : experience.length === 1 ? 'warn' : 'fail',
    hint: 'Опишите 2–5 последних мест работы, начиная с текущего.',
    weight: 12,
  });

  push({
    id: 'highlights',
    label: 'Достижения вместо обязанностей',
    status: bulletCount >= 4 ? 'pass' : bulletCount > 0 ? 'warn' : 'fail',
    hint: 'На каждое место — 3–5 пунктов с результатом, а не перечислением задач.',
    weight: 14,
  });

  push({
    id: 'metrics',
    label: 'Измеримые результаты',
    status: quantified >= Math.max(2, Math.ceil(bulletCount * 0.4)) ? 'pass' : quantified > 0 ? 'warn' : 'fail',
    hint: 'Цифры, проценты и сроки: «ускорил на 40%», «снизил с 5 до 2 дней».',
    weight: 14,
  });

  push({
    id: 'verbs',
    label: 'Сильные глаголы в начале пунктов',
    status: actionStart >= Math.max(2, Math.ceil(bulletCount * 0.5)) ? 'pass' : actionStart > 0 ? 'warn' : 'fail',
    hint: 'Начинайте с действия: «Запустил», «Оптимизировал», «Внедрил».',
    weight: 8,
  });

  push({
    id: 'skills',
    label: 'Навыки: 6–18 релевантных',
    status: data.skills.length >= 6 && data.skills.length <= 18 ? 'pass' : data.skills.length > 0 ? 'warn' : 'fail',
    hint: 'Укажите инструменты и технологии, которые встречаются в вакансиях.',
    weight: 10,
  });

  push({
    id: 'languages',
    label: 'Языки',
    status: data.languages.length >= 1 ? 'pass' : 'warn',
    hint: 'Даже родной язык + уровень английского добавляют ясности.',
    weight: 4,
  });

  push({
    id: 'links',
    label: 'Ссылки на профили и портфолио',
    status: data.personal.links.filter((l) => l.url.trim()).length >= 1 ? 'pass' : 'warn',
    hint: 'LinkedIn, GitHub, портфолио или кейсы — усиливают доверие.',
    weight: 6,
  });

  const words = countWords(text);
  push({
    id: 'length',
    label: 'Объём 300–900 слов',
    status: words >= 300 && words <= 900 ? 'pass' : words > 0 ? 'warn' : 'fail',
    hint: 'Идеально 1–2 страницы. Слишком коротко — мало данных, слишком длинно — не читают.',
    weight: 6,
  });

  const placeholders = /lorem ipsum|ваше имя|your name|должность компании|example\.com/i.test(text);
  push({
    id: 'placeholders',
    label: 'Нет шаблонных заглушек',
    status: placeholders ? 'fail' : 'pass',
    hint: 'Уберите демо-текст и заглушки — они сразу выдают шаблон.',
    weight: 6,
  });

  const resumeTokens = new Set(tokenize(text));
  const vacancyKeywords = vacancy.trim() ? extractKeywords(vacancy, 22) : [];
  const matchedKeywords = vacancyKeywords.filter((k) => resumeTokens.has(k));
  const missingKeywords = vacancyKeywords.filter((k) => !resumeTokens.has(k));

  if (vacancy.trim()) {
    const ratio = vacancyKeywords.length ? matchedKeywords.length / vacancyKeywords.length : 0;
    push({
      id: 'keywords',
      label: 'Совпадение с описанием вакансии',
      status: ratio >= 0.55 ? 'pass' : ratio >= 0.3 ? 'warn' : 'fail',
      hint: 'Добавьте ключевые технологии и термины из вакансии — ATS ищет их буквально.',
      weight: 16,
    });
  }

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earned = checks.reduce(
    (sum, c) => sum + c.weight * (c.status === 'pass' ? 1 : c.status === 'warn' ? 0.5 : 0),
    0
  );
  const score = Math.round((earned / totalWeight) * 100);

  return {
    score,
    checks,
    matchedKeywords,
    missingKeywords,
    wordCount: words,
    hasVacancy: Boolean(vacancy.trim()),
  };
}

export function scoreLabel(score: number): { label: string; tone: 'good' | 'ok' | 'bad' } {
  if (score >= 80) return { label: 'Отлично', tone: 'good' };
  if (score >= 55) return { label: 'Можно лучше', tone: 'ok' };
  return { label: 'Нужно доработать', tone: 'bad' };
}
