import React, { useState } from 'react';

interface Options {
  onReorder: (from: number, to: number) => void;
}

/**
 * Minimal native HTML5 drag & drop for card lists (no dependencies).
 * Attach `containerProps` to the list, then spread `itemProps(index)` on each card
 * and put `handleProps` on the grip element.
 */
export function useDragReorder({ onReorder }: Options) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const containerProps: React.HTMLAttributes<HTMLDivElement> = {
    onDragOver: (event) => {
      if (dragIndex === null) return;
      event.preventDefault();
    },
    onDrop: () => {
      if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
        onReorder(dragIndex, overIndex);
      }
      setDragIndex(null);
      setOverIndex(null);
    },
  };

  const itemProps = (index: number) => ({
    onDragOver: (event: React.DragEvent) => {
      if (dragIndex === null) return;
      event.preventDefault();
      if (overIndex !== index) setOverIndex(index);
    },
    onDragLeave: () => {
      if (overIndex === index) setOverIndex(null);
    },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (dragIndex !== null && dragIndex !== index) onReorder(dragIndex, index);
      setDragIndex(null);
      setOverIndex(null);
    },
  });

  const handleProps = (index: number) => ({
    draggable: true,
    onDragStart: (event: React.DragEvent) => {
      setDragIndex(index);
      event.dataTransfer.effectAllowed = 'move';
      try {
        event.dataTransfer.setData('text/plain', String(index));
      } catch {
        /* Safari */
      }
    },
    onDragEnd: () => {
      setDragIndex(null);
      setOverIndex(null);
    },
  });

  return {
    containerProps,
    itemProps,
    handleProps,
    draggingIndex: dragIndex,
    overIndex,
    isDragging: dragIndex !== null,
  };
}
