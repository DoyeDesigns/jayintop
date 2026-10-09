"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

const SPEED = 48;

function wrap(value: number, width: number) {
  if (width <= 0) return 0;
  const next = value % width;
  return next > 0 ? next - width : next;
}

export function useMarqueeRepeat(
  viewportRef: RefObject<HTMLElement | null>,
  unitRef: RefObject<HTMLElement | null>,
  version = 0,
) {
  const [repeat, setRepeat] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    const unit = unitRef.current;
    if (!viewport || !unit) return;

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const unitWidth = unit.offsetWidth;
      const viewWidth = viewport.clientWidth;
      if (unitWidth <= 0 || viewWidth <= 0) return;
      const needed = Math.max(1, Math.ceil((viewWidth + 2) / unitWidth));
      setRepeat((current) => (current === needed ? current : needed));
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(unit);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [viewportRef, unitRef, repeat, version]);

  return repeat;
}

export function MarqueeRow({
  direction,
  children,
  className = "",
}: {
  direction: "rtl" | "ltr";
  children: ReactNode;
  className?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);
  const repeat = useMarqueeRepeat(viewportRef, unitRef);

  useEffect(() => {
    const track = trackRef.current;
    const loop = loopRef.current;
    if (!track || !loop) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const speed = direction === "ltr" ? SPEED : -SPEED;
    let frame = 0;
    let last = performance.now();
    let offset = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) {
        offset = wrap(offset + speed * dt, loop.offsetWidth);
        track.style.transform = `translate3d(${offset}px,0,0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [direction]);

  const copies = Array.from({ length: repeat }, (_, index) => index);

  return (
    <div ref={viewportRef} className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max shrink-0 will-change-transform">
        <div ref={loopRef} className="flex shrink-0">
          {copies.map((index) => (
            <div
              key={index}
              ref={index === 0 ? unitRef : undefined}
              className="flex shrink-0"
            >
              {children}
            </div>
          ))}
        </div>
        <div className="flex shrink-0" aria-hidden inert>
          {copies.map((index) => (
            <div key={index} className="flex shrink-0">
              {children}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
