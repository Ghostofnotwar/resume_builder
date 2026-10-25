import React from 'react';
import { createPortal } from 'react-dom';
import { useResumeStore } from '../store/resumeStore';
import { TemplateRenderer } from './TemplateRenderer';

/**
 * Rendered outside #root (via portal) and visible only in @media print.
 * Gives a vector PDF with a real, selectable text layer.
 */
export const PrintRoot: React.FC = () => {
  const data = useResumeStore((s) => s.data);
  const config = useResumeStore((s) => s.config);
  if (typeof document === 'undefined' || !document.body || !document.body.nodeType) return null;
  return createPortal(
    <div id="print-root" aria-hidden="true">
      <TemplateRenderer data={data} config={config} />
    </div>,
    document.body
  );
};
