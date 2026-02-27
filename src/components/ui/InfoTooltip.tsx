"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

export default function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top: rect.top - 8, // 8px above the button
      right: window.innerWidth - rect.right,
    });
  }, []);

  const handleEnter = () => {
    updatePos();
    setShow(true);
  };

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        ref={btnRef}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setShow(false)}
        onClick={() => {
          if (!show) updatePos();
          setShow(!show);
        }}
        className="ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[9px] leading-none text-[var(--muted)] transition-colors hover:bg-[var(--border-light)] hover:text-[var(--foreground)]"
        aria-label="More info"
      >
        i
      </button>
      {show &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            className="pointer-events-none fixed z-[9999] w-max max-w-[220px] rounded-md bg-[var(--foreground)] px-3 py-1.5 font-mono text-[10px] leading-snug text-[var(--background)] shadow-lg"
            style={{
              top: pos.top,
              right: pos.right,
              transform: "translateY(-100%)",
            }}
          >
            {text}
            <span className="absolute right-3 top-full border-4 border-transparent border-t-[var(--foreground)]" />
          </span>,
          document.body
        )}
    </span>
  );
}
