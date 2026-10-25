import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { TemplateRenderer } from './TemplateRenderer';
import { A4 } from '../utils';

interface Props {
  scale?: number;
  showPageBreaks?: boolean;
  onPagesChange?: (pages: number) => void;
}

/**
 * Renders the resume twice:
 *  1. a hidden 1:1 copy (ref forwarded) used for raster PDF / PNG capture;
 *  2. the visible scaled copy the user interacts with.
 * Page-break guides are drawn from the measured content height.
 */
export const ResumePreview = forwardRef<HTMLDivElement, Props>(
  ({ scale = 1, showPageBreaks = true, onPagesChange }, ref) => {
    const data = useResumeStore((s) => s.data);
    const config = useResumeStore((s) => s.config);
    const measureRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(A4.height);

    useEffect(() => {
      const el = measureRef.current;
      if (!el) return;
      const update = () => setHeight(Math.max(A4.height, el.scrollHeight));
      update();
      const observer = new ResizeObserver(update);
      observer.observe(el);
      const timer = setTimeout(update, 120);
      return () => {
        observer.disconnect();
        clearTimeout(timer);
      };
    }, [data, config]);

    const pages = Math.max(1, Math.ceil((height - 2) / A4.height));

    useEffect(() => {
      onPagesChange?.(pages);
    }, [pages, onPagesChange]);

    const paper = (
      <div
        ref={measureRef}
        style={{
          width: A4.width,
          minHeight: A4.height,
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <TemplateRenderer data={data} config={config} />
      </div>
    );

    return (
      <>
        {/* hidden 1:1 capture target */}
        <div
          ref={ref}
          data-pdf-capture="true"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: -20000,
            width: A4.width,
            minHeight: A4.height,
            background: '#ffffff',
            pointerEvents: 'none',
          }}
        >
          <TemplateRenderer data={data} config={config} />
        </div>

        {/* visible scaled page(s) */}
        <div
          style={{
            width: A4.width * scale,
            height: height * scale,
            position: 'relative',
            transition: 'width .18s ease, height .18s ease',
          }}
        >
          <div
            style={{
              width: A4.width,
              height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
              background: '#ffffff',
              boxShadow: '0 1px 2px rgba(15,23,42,.1), 0 30px 60px -30px rgba(15,23,42,.4)',
              overflow: 'hidden',
            }}
          >
            {paper}

            {/* page break guides */}
            {showPageBreaks &&
              Array.from({ length: pages - 1 }).map((_, index) => {
                const top = (index + 1) * A4.height;
                return (
                  <div
                    key={top}
                    style={{
                      position: 'absolute',
                      top,
                      left: 0,
                      right: 0,
                      height: 0,
                      borderTop: '1.5px dashed rgba(99,102,241,.55)',
                      pointerEvents: 'none',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        right: 6,
                        top: -9,
                        fontSize: 8,
                        fontFamily: 'Inter, sans-serif',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        background: 'rgba(99,102,241,.85)',
                        padding: '1px 5px',
                        borderRadius: 3,
                      }}
                    >
                      стр. {index + 2}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
