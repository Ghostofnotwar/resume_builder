import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { FONT_OPTIONS, LOCALES, PALETTES, PHOTO_SHAPES, SPACING_OPTIONS, TEMPLATES } from '../../constants';
import { FontOption, SpacingOption, Template } from '../../types';
import { allSectionIds, sectionIcon, sectionLabel } from '../../lib/sections';
import { Button, Field, IconButton, Segmented, Toggle } from '../ui';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils';
import { toast } from '../ui/Toast';

/* ── miniature template previews ───────────────────────────── */

const Line: React.FC<{ w?: string; color?: string; h?: number; className?: string }> = ({
  w = '100%',
  color = 'rgba(15,23,42,.16)',
  h = 2,
  className,
}) => <div className={className} style={{ width: w, height: h, borderRadius: 2, background: color }} />;

const TemplateThumb: React.FC<{ template: Template; primary: string; accent: string; active: boolean }> = ({
  template,
  primary,
  accent,
  active,
}) => {
  const band = `linear-gradient(120deg, ${primary}, ${accent})`;
  const body = (
    <div className="flex h-full w-full flex-col gap-[3px] overflow-hidden rounded-[5px] bg-white p-[5px]">
      {template.id === 'classic' && (
        <>
          <div className="-m-[5px] mb-[3px] px-[5px] py-[7px]" style={{ background: band }}>
            <div style={{ width: '58%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,.9)' }} />
            <div style={{ width: '38%', height: 2, borderRadius: 2, background: 'rgba(255,255,255,.6)', marginTop: 3 }} />
          </div>
          <Line w="34%" color={accent} />
          <Line /><Line w="92%" /><Line w="78%" />
          <Line w="30%" color={accent} className="mt-1" />
          <Line w="88%" /><Line w="70%" />
        </>
      )}
      {template.id === 'modern' && (
        <div className="flex h-full gap-[4px]">
          <div className="-my-[5px] -ml-[5px] w-[34%] rounded-r-[3px]" style={{ background: band }} />
          <div className="flex flex-1 flex-col gap-[3px] py-[2px]">
            <Line w="40%" color={accent} />
            <Line /><Line w="90%" /><Line w="75%" />
            <Line w="34%" color={accent} className="mt-1" />
            <Line w="92%" /><Line w="80%" /><Line w="60%" />
          </div>
        </div>
      )}
      {template.id === 'executive' && (
        <>
          <Line w="62%" color="rgba(15,23,42,.65)" h={4} />
          <Line w="40%" color={accent} />
          <div className="mt-[3px] flex flex-1 gap-[4px]">
            <div className="flex flex-1 flex-col gap-[3px]">
              <Line w="40%" color={accent} />
              <Line /><Line w="92%" /><Line w="70%" />
              <Line w="46%" color={accent} className="mt-1" />
              <Line w="88%" /><Line w="60%" />
            </div>
            <div className="w-[33%] rounded-[3px]" style={{ background: `${accent}18` }} />
          </div>
        </>
      )}
      {template.id === 'minimal' && (
        <>
          <Line w="55%" color="rgba(15,23,42,.75)" h={4} />
          <Line w="36%" color="rgba(15,23,42,.4)" />
          <div style={{ height: 1.5, background: 'rgba(15,23,42,.7)', margin: '3px 0' }} />
          <Line w="30%" color="rgba(15,23,42,.6)" />
          <Line /><Line w="93%" /><Line w="84%" />
          <Line w="26%" color="rgba(15,23,42,.6)" className="mt-1" />
          <Line w="88%" /><Line w="72%" />
        </>
      )}
      {template.id === 'timeline' && (
        <>
          <div className="mb-[2px] flex items-center gap-[4px]">
            <div style={{ width: 3, height: 12, borderRadius: 2, background: accent }} />
            <div className="flex-1">
              <Line w="62%" color="rgba(15,23,42,.7)" h={3.5} />
              <Line w="40%" color={accent} className="mt-[2px]" />
            </div>
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-[4px]">
              <div className="flex w-[26%] flex-col items-end gap-[2px] pt-[1px]">
                <Line w="80%" color="rgba(15,23,42,.25)" />
                <Line w="60%" color="rgba(15,23,42,.18)" />
              </div>
              <div className="relative flex flex-col items-center self-stretch">
                <span style={{ width: 4, height: 4, borderRadius: 9, border: `1px solid ${accent}`, marginTop: 1 }} />
                <span style={{ width: 1, flex: 1, background: `${accent}55` }} />
              </div>
              <div className="flex flex-1 flex-col gap-[2px] pb-[4px]">
                <Line w="70%" color="rgba(15,23,42,.5)" />
                <Line w="92%" />
                <Line w="80%" />
              </div>
            </div>
          ))}
        </>
      )}
      {template.id === 'elegant' && (
        <>
          <div className="flex flex-col items-center gap-[2px] py-[2px]">
            <div style={{ width: 10, height: 10, borderRadius: 9, background: `${accent}33` }} />
            <Line w="52%" color="rgba(15,23,42,.7)" h={4} />
            <Line w="32%" color={accent} />
            <div style={{ width: '56%', height: 1, background: 'rgba(15,23,42,.2)', marginTop: 2 }} />
          </div>
          <div className="flex flex-1 gap-[4px]">
            <div className="flex flex-1 flex-col gap-[3px]">
              <Line w="34%" color={accent} />
              <Line /><Line w="90%" /><Line w="72%" />
            </div>
            <div className="w-[30%] rounded-[3px]" style={{ background: `${primary}12` }} />
          </div>
        </>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border-2 bg-white transition-all',
        active ? 'border-brand-500 shadow-ring' : 'border-line hover:border-brand-300'
      )}
      style={{ aspectRatio: '3 / 4' }}
    >
      {body}
      {active && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white shadow">
          <Icon name="check" size={9} strokeWidth={3.6} />
        </span>
      )}
    </div>
  );
};

/* ── main settings ─────────────────────────────────────────── */

export const DesignSettings: React.FC = () => {
  const config = useResumeStore((s) => s.config);
  const data = useResumeStore((s) => s.data);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const setPalette = useResumeStore((s) => s.setPalette);
  const setAccent = useResumeStore((s) => s.setAccent);
  const setFont = useResumeStore((s) => s.setFont);
  const setSpacing = useResumeStore((s) => s.setSpacing);
  const setLocale = useResumeStore((s) => s.setLocale);
  const setPhotoShape = useResumeStore((s) => s.setPhotoShape);
  const setShowPhoto = useResumeStore((s) => s.setShowPhoto);
  const setTextScale = useResumeStore((s) => s.setTextScale);
  const setPaperTint = useResumeStore((s) => s.setPaperTint);
  const setShowSkillLevels = useResumeStore((s) => s.setShowSkillLevels);
  const toggleSection = useResumeStore((s) => s.toggleSection);
  const moveSection = useResumeStore((s) => s.moveSection);
  const resetDesign = useResumeStore((s) => s.resetDesign);

  const sections = allSectionIds(data, config);

  return (
    <div className="space-y-5">
      {/* templates */}
      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-[12.5px] font-bold text-ink">Шаблон</h3>
          <span className="text-[11px] text-ink-faint">6 вариантов</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TEMPLATES.map((template) => (
            <button key={template.id} type="button" onClick={() => setTemplate(template.id)} className="text-left">
              <TemplateThumb
                template={template}
                primary={config.colorScheme.primary}
                accent={config.colorScheme.accent}
                active={config.templateId === template.id}
              />
              <p
                className={cn(
                  'mt-1 truncate text-[11.5px] font-semibold',
                  config.templateId === template.id ? 'text-brand-600 dark:text-brand-300' : 'text-ink-soft'
                )}
              >
                {template.name}
              </p>
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] leading-snug text-ink-faint">
          {TEMPLATES.find((template) => template.id === config.templateId)?.description}
        </p>
      </section>

      {/* palette */}
      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-[12.5px] font-bold text-ink">Палитра</h3>
          <span className="text-[11px] text-ink-faint">{config.colorScheme.name}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PALETTES.map((palette) => {
            const active = config.colorScheme.primary === palette.primary && config.colorScheme.accent === palette.accent;
            return (
              <button
                key={palette.id}
                type="button"
                title={palette.name}
                onClick={() => setPalette(palette)}
                className={cn(
                  'relative h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                  active ? 'border-ink shadow-md' : 'border-transparent'
                )}
                style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})` }}
              >
                {active && (
                  <span className="absolute inset-0 flex items-center justify-center text-white">
                    <Icon name="check" size={13} strokeWidth={3.2} />
                  </span>
                )}
              </button>
            );
          })}

          <label
            className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-line-strong text-ink-faint transition hover:border-brand-400 hover:text-brand-500"
            title="Свой акцент"
          >
            <Icon name="palette" size={14} />
            <input
              type="color"
              value={config.colorScheme.accent}
              onChange={(event) => setAccent(event.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>
      </section>

      {/* font */}
      <section>
        <h3 className="mb-2 text-[12.5px] font-bold text-ink">Типографика</h3>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => setFont(font.value as FontOption)}
              className={cn(
                'rounded-xl border px-2.5 py-2 text-left transition',
                config.font === font.value
                  ? 'border-brand-500 bg-brand-500/[0.06] shadow-ring'
                  : 'border-line bg-surface hover:border-line-strong'
              )}
            >
              <p className="text-[13px] font-semibold text-ink" style={{ fontFamily: font.css }}>
                {font.label.split(' — ')[0]}
              </p>
              <p className="mt-0.5 truncate text-[10.5px] text-ink-mute" style={{ fontFamily: font.css }}>
                {font.sample}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-2.5 space-y-2">
          <div>
            <span className="label">Плотность</span>
            <Segmented<SpacingOption>
              value={config.spacing}
              onChange={setSpacing}
              options={SPACING_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="label mb-0">Размер текста</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0.9}
                max={1.12}
                step={0.02}
                value={config.textScale}
                onChange={(event) => setTextScale(Number(event.target.value))}
                className="w-28"
              />
              <span className="w-9 text-right text-[11px] font-semibold tabular-nums text-ink-soft">
                {Math.round(config.textScale * 100)}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* photo */}
      <section className="space-y-2">
        <h3 className="text-[12.5px] font-bold text-ink">Фотография и язык</h3>
        <Toggle
          checked={config.showPhoto}
          onChange={setShowPhoto}
          label="Показывать фото в резюме"
          description="В некоторых странах фото в CV не принято — можно выключить."
        />
        {config.showPhoto && (
          <div className="pl-1">
            <Segmented
              size="sm"
              value={config.photoShape}
              onChange={setPhotoShape}
              options={PHOTO_SHAPES.map((shape) => ({ value: shape.value, label: shape.label }))}
            />
          </div>
        )}
        <Field label="Язык заголовков">
          <Segmented
            value={config.locale}
            onChange={setLocale}
            options={LOCALES.map((locale) => ({ value: locale.value, label: `${locale.flag} ${locale.label}` }))}
            className="w-full"
          />
        </Field>
      </section>

      {/* extras */}
      <section className="space-y-1 rounded-2xl border border-line bg-surface p-3">
        <h3 className="mb-1 text-[12.5px] font-bold text-ink">Детали</h3>
        <Toggle
          checked={config.paperTint}
          onChange={setPaperTint}
          label="Лёгкий фон под палитру"
          description="Выключите для максимально белого листа."
        />
        <Toggle
          checked={config.showSkillLevels}
          onChange={setShowSkillLevels}
          label="Полоски уровней у навыков"
          description="Выключено — навыки показываются тегами."
        />
      </section>

      {/* sections */}
      <section>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-[12.5px] font-bold text-ink">Разделы</h3>
          <span className="text-[11px] text-ink-faint">порядок и видимость</span>
        </div>
        <div className="space-y-1">
          {sections.map((id, index) => {
            const hidden = config.hiddenSections.includes(id);
            return (
              <div
                key={id}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition',
                  hidden ? 'border-line bg-surface-2 opacity-60' : 'border-line bg-surface'
                )}
              >
                <span className="text-ink-mute">
                  <Icon name={sectionIcon(id)} size={14} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">
                  {sectionLabel(id, config.locale, data)}
                </span>
                <IconButton name="arrow-up" label="Выше" size={13} disabled={index === 0} onClick={() => moveSection(id, -1)} />
                <IconButton
                  name="arrow-down"
                  label="Ниже"
                  size={13}
                  disabled={index === sections.length - 1}
                  onClick={() => moveSection(id, 1)}
                />
                <IconButton
                  name={hidden ? 'eye' : 'check'}
                  label={hidden ? 'Показать' : 'Скрыть'}
                  size={14}
                  onClick={() => toggleSection(id)}
                  className={hidden ? '' : 'text-brand-500'}
                />
              </div>
            );
          })}
        </div>
      </section>

      <Button
        variant="secondary"
        size="sm"
        icon="refresh"
        full
        onClick={() => {
          resetDesign();
          toast('Оформление сброшено', { description: 'Данные резюме остались на месте.', tone: 'info' });
        }}
      >
        Сбросить оформление
      </Button>

      <div className="rounded-2xl border border-dashed border-line p-3">
        <p className="text-[11px] font-semibold text-ink-soft">Совет</p>
        <p className="mt-0.5 text-[11px] leading-snug text-ink-mute">
          Для откликов через ATS выбирайте шаблон <strong>Minimal ATS</strong>: без колонок, иконок и графики — парсеры читают его лучше всего.
        </p>
      </div>
    </div>
  );
};
