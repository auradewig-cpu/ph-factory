'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  storageKey: string;
  minWidth?: number;
  defaultWidth?: number;
}

export function ResizablePanel({ children, storageKey, minWidth = 600, defaultWidth = 896 }: Props) {
  const [width, setWidth] = useState(defaultWidth);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`resizable-${storageKey}`);
    if (saved) setWidth(Number(saved));
  }, [storageKey]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(minWidth, Math.min(window.innerWidth - rect.left - 20, e.clientX - rect.left));
      setWidth(newWidth);
    };
    const handleMouseUp = () => {
      setDragging(false);
      localStorage.setItem(`resizable-${storageKey}`, String(width));
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, minWidth, storageKey, width]);

  return (
    <div ref={containerRef} style={{ width: `${width}px`, maxWidth: '100%' }} className="relative">
      {children}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 right-[-10px] w-[10px] h-full cursor-col-resize flex items-center justify-center group ${dragging ? 'bg-ph-amber/10' : ''}`}
      >
        <div className={`w-[3px] h-12 rounded-full transition-colors ${dragging ? 'bg-ph-amber' : 'bg-ph-border group-hover:bg-ph-muted'}`} />
      </div>
    </div>
  );
}
