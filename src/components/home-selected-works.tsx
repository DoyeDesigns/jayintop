"use client";

import Link from "next/link";
import { ContentImage } from "@/components/content-image";
import { useMarqueeRepeat } from "@/components/marquee-row";
import { useEffect, useRef, useState, type RefObject } from "react";
import type { WorkItem } from "@/lib/work";

const SPEED = 48;
const rulerPhrase = "Selected work // ";

function wrap(value: number, width: number) {
  if (width <= 0) return 0;
  const next = value % width;
  return next > 0 ? next - width : next;
}

function ProjectCard({
  item,
  hidden = false,
}: {
  item: WorkItem;
  hidden?: boolean;
}) {
  return (
    <li className="shrink-0">
      <Link
        href={`/selected-work/${item.id}`}
        tabIndex={hidden ? -1 : undefined}
        draggable={false}
        className="group relative block h-[240px] w-[178px] overflow-hidden md:h-[668px] md:w-[494px]"
      >
        {item.image ? (
          <ContentImage
            src={item.image}
            alt=""
            fill
            sizes="494px"
            className="pointer-events-none object-cover"
          />
        ) : (
          <span className="absolute inset-0 bg-[#1A1A1A]" />
        )}
        <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40 group-focus-visible:bg-black/40">
          <span
            className={`px-3 text-center font-inter text-[18px] leading-none font-medium text-[#DEDAD2] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:px-6 md:text-[35px] ${item.image ? "opacity-0" : "opacity-100"}`}
          >
            {item.title}
          </span>
        </span>
      </Link>
    </li>
  );
}

function Sequence({
  items,
  hidden = false,
  unitRef,
}: {
  items: WorkItem[];
  hidden?: boolean;
  unitRef?: RefObject<HTMLUListElement | null>;
}) {
  return (
    <ul
      ref={unitRef}
      aria-hidden={hidden || undefined}
      className="flex h-full shrink-0 items-center gap-3 pr-3 md:gap-5 md:pr-5"
    >
      {items.map((item) => (
        <ProjectCard key={item.id} item={item} hidden={hidden} />
      ))}
    </ul>
  );
}

function Ruler() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const repeat = useMarqueeRepeat(viewportRef, unitRef);
  const copies = Array.from({ length: repeat }, (_, index) => index);

  useEffect(() => {
    const track = trackRef.current;
    const loop = loopRef.current;
    if (!track || !loop) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let last = performance.now();
    let offset = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) {
        offset = wrap(offset + SPEED * dt, loop.offsetWidth);
        track.style.transform = `translate3d(${offset}px,0,0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={viewportRef}
      aria-hidden
      className="pointer-events-none relative z-20 h-[36px] w-[255%] shrink-0 overflow-hidden bg-[rgba(54,54,54,0.3)] md:h-[93px] md:w-[170%]"
      style={{
        transform: "perspective(1200px) rotateX(35deg) rotateY(20.6deg)",
        maskImage:
          "linear-gradient(to right, transparent, #000 12.5%, #000 87.5%, transparent)",
      }}
    >
      <div
        ref={trackRef}
        className="flex h-full w-max shrink-0 items-center will-change-transform"
      >
        <div ref={loopRef} className="flex shrink-0">
          {copies.map((index) => (
            <span
              key={index}
              ref={index === 0 ? unitRef : undefined}
              className="font-tanker text-[20px] leading-none font-normal tracking-normal whitespace-nowrap text-[#DEDAD2] uppercase md:text-[81px]"
            >
              {rulerPhrase}
            </span>
          ))}
        </div>
        <div className="flex shrink-0">
          {copies.map((index) => (
            <span
              key={index}
              className="font-tanker text-[20px] leading-none font-normal tracking-normal whitespace-nowrap text-[#DEDAD2] uppercase md:text-[81px]"
            >
              {rulerPhrase}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeSelectedWorks({ items }: { items: WorkItem[] }) {
  const projects = items;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLUListElement>(null);
  const repeat = useMarqueeRepeat(viewportRef, unitRef, projects.length);
  const copies = Array.from({ length: repeat }, (_, index) => index);
  const offset = useRef(0);
  const dragging = useRef(false);
  const moved = useRef(false);
  const velocity = useRef(0);
  const pointer = useRef({ x: 0, last: 0, time: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let last = performance.now();

    const apply = (value: number) => {
      const width = loopRef.current?.offsetWidth ?? 0;
      const next = wrap(value, width);
      offset.current = next;
      track.style.transform = `translate3d(${next}px,0,0)`;
    };

    apply(0);
    setVisible(true);

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging.current && Math.abs(velocity.current) > 20) {
        apply(offset.current + velocity.current * dt);
        velocity.current *= Math.pow(0.04, dt);
      } else if (!reduced && !dragging.current) {
        velocity.current = 0;
        apply(offset.current - SPEED * dt);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      velocity.current = 0;
      apply(offset.current - event.deltaX);
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("wheel", onWheel);
    };
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <section
      aria-label="Selected works"
      className={`relative left-1/2 flex w-screen -translate-x-1/2 flex-col items-center overflow-hidden py-10 transition-opacity duration-700 md:py-20 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <Ruler />
      <Ruler />
      <div
        className="-mt-[14px] h-[300px] w-[255%] shrink-0 md:-mt-[40px] md:h-[660px] md:w-[170%]"
        style={{
          transform: "perspective(1200px) rotateX(20deg) rotateY(20deg)",
        }}
      >
        <div
          ref={viewportRef}
          className="h-full w-full cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            dragging.current = true;
            moved.current = false;
            velocity.current = 0;
            pointer.current = {
              x: event.clientX,
              last: event.clientX,
              time: performance.now(),
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragging.current) return;
            const now = performance.now();
            const dx = event.clientX - pointer.current.last;
            const dt = now - pointer.current.time || 16;
            if (Math.abs(event.clientX - pointer.current.x) > 6) {
              moved.current = true;
            }
            velocity.current = (dx / dt) * 1000;
            pointer.current.last = event.clientX;
            pointer.current.time = now;
            const width = loopRef.current?.offsetWidth ?? 0;
            const next = wrap(offset.current + dx, width);
            offset.current = next;
            if (trackRef.current) {
              trackRef.current.style.transform = `translate3d(${next}px,0,0)`;
            }
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onClickCapture={(event) => {
            if (!moved.current) return;
            event.preventDefault();
            event.stopPropagation();
            moved.current = false;
          }}
        >
          <div
            ref={trackRef}
            className="flex h-full w-max shrink-0 items-center will-change-transform"
          >
            <div ref={loopRef} className="flex h-full shrink-0">
              {copies.map((index) => (
                <Sequence
                  key={index}
                  items={projects}
                  unitRef={index === 0 ? unitRef : undefined}
                />
              ))}
            </div>
            <div className="flex h-full shrink-0" aria-hidden>
              {copies.map((index) => (
                <Sequence key={index} items={projects} hidden />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
