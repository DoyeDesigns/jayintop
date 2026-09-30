"use client";

import { useEffect, useRef, type ReactNode } from "react";

const SPEED = 48;

function wrap(value: number, width: number) {
  if (width <= 0) return value;
  const next = value % width;
  return next > 0 ? next - width : next;
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
  const trackRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        <div ref={loopRef} className="flex shrink-0">
          {children}
        </div>
        <div className="flex shrink-0" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
