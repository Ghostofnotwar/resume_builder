import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { EmptyState, Field, IconButton, Input } from '../ui';
import { AddButton, TipRow } from './FormKit';

export const CertificationsForm: React.FC = () => {
  const certifications = useResumeStore((s) => s.data.certifications);
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const removeCertification = useResumeStore((s) => s.removeCertification);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11.5px] leading-snug text-ink-mute">Сертификаты, курсы и лицензии с годом получения.</p>
        <AddButton label="Сертификат" onClick={() => addCertification()} />
      </div>

      {!certifications.length && (
        <EmptyState
          icon="award"
          title="Сертификатов пока нет"
          description="AWS, Scrum, Google, Coursera — всё, что подтверждает экспертизу."
        />
      )}

      <div className="space-y-2">
        {certifications.map((certification) => (
          <div key={certification.id} className="rounded-xl border border-line bg-surface p-2.5">
            <div className="flex items-start gap-1.5">
              <div className="min-w-0 flex-1 space-y-2">
                <Input
                  value={certification.name}
                  placeholder="Название сертификата"
                  onChange={(event) => updateCertification(certification.id, { name: event.target.value })}
                />
                <div className="grid grid-cols-[1fr_88px] gap-2">
                  <Field>
                    <Input
                      className="field-sm"
                      value={certification.issuer}
                      placeholder="Выдавшая организация"
                      onChange={(event) => updateCertification(certification.id, { issuer: event.target.value })}
                    />
                  </Field>
                  <Field>
                    <Input
                      className="field-sm"
                      value={certification.date}
                      placeholder="2024"
                      onChange={(event) => updateCertification(certification.id, { date: event.target.value })}
                    />
                  </Field>
                </div>
                <Input
                  className="field-sm"
                  value={certification.url}
                  placeholder="Ссылка на сертификат (необязательно)"
                  onChange={(event) => updateCertification(certification.id, { url: event.target.value })}
                />
              </div>
              <IconButton name="trash" label="Удалить" tone="danger" onClick={() => removeCertification(certification.id)} />
            </div>
          </div>
        ))}
      </div>

      {certifications.length > 0 && <TipRow>Не добавляйте сертификаты без даты — рекрутер может счесть их устаревшими.</TipRow>}
    </div>
  );
};
