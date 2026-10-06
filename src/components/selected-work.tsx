"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContentImage } from "@/components/content-image";
import { matchesWorkFilter } from "@/lib/public-work";
import type { WorkItem } from "@/lib/work";

const tabClass =
  "inline-flex h-[42px] shrink-0 items-center gap-[6.66px] rounded-tl-[8px] rounded-tr-[666px] rounded-br-[666px] rounded-bl-[8px] border-b-2 pt-[8px] pb-[8px] font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap uppercase";

export function SelectedWork({
  items,
  filters = [],
}: {
  items: WorkItem[];
  filters?: string[];
}) {
  const options = filters.length ? filters : ["All"];
  const [filter, setFilter] = useState(options[0]);
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeFilter = options.find((item) => item === filter) ?? options[0];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      {
        rootMargin: window.matchMedia("(min-width: 768px)").matches
          ? "-84px 0px 0px 0px"
          : "-93px 0px 0px 0px",
      },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const visible = items.filter((item) =>
    matchesWorkFilter(item, filter, filter === options[0]),
  );

  return (
    <div className="mt-10">
      <div ref={sentinelRef} aria-hidden className="h-px" />
      <div
        className={`sticky top-[93px] z-30 md:top-[84px] ${
          stuck
            ? "bg-[#131313] bg-[url('/backgrounds/default.svg')] bg-cover bg-fixed bg-center"
            : ""
        }`}
      >
        <div className="py-4">
          <div className="relative md:hidden">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-full items-center justify-between rounded-[4px] border border-[#D5D7DA] bg-brand px-3 py-2 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase"
            >
              {activeFilter}
              <ChevronDown size={20} strokeWidth={1.75} />
            </button>
            {menuOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close project filters"
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 z-20 cursor-default"
                />
                <ul
                  role="listbox"
                  aria-label="Filter projects"
                  className="absolute top-[calc(100%+8px)] right-0 left-0 z-30 overflow-hidden rounded-[4px] border border-[#D5D7DA] bg-[#1A1A1A] py-1 px-3"
                >
                  {options.map((item) => {
                    const active = filter === item;
                    return (
                      <li key={item}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setFilter(item);
                            setMenuOpen(false);
                          }}
                          className={`flex w-full pr-3 py-2 text-left font-tanker text-[20px] leading-[1.2] font-normal tracking-normal uppercase ${
                            active ? "text-brand" : "text-brand-white"
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </div>

          <nav
            aria-label="Filter projects"
            className={`hidden gap-6 overflow-x-auto md:flex ${
              stuck ? "md:justify-start" : "md:justify-center"
            }`}
          >
            {options.map((item) => {
              const active = filter === item;
              const stuckActive = stuck && active;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item)}
                  className={`${tabClass} ${
                    stuck
                      ? stuckActive
                        ? "border-transparent bg-brand px-[12px] text-brand-white"
                        : "border-transparent px-[12px] text-brand-white"
                      : active
                        ? "border-brand pr-[12px] pl-0 text-brand-white"
                        : "border-transparent pr-[12px] pl-0 text-brand-white"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <ul className="mt-8 flex flex-col gap-12">
        {visible.map((item) => (
          <li key={item.id}>
            <article>
              <Link href={`/selected-work/${item.id}`} className="block">
              <div className="relative aspect-square w-full max-w-[370px] overflow-hidden rounded-lg bg-[#1A1A1A] md:aspect-[1380/640] md:max-w-none">
                <ContentImage
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 1200px, 370px"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex flex-col items-start gap-1 text-left md:flex-row md:items-end md:justify-between">
                <h2 className="font-tanker md:text-[40px] text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
                  {item.title}
                </h2>
                <p className="font-bespoke md:text-[24px] text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white">
                  {item.category}
                </p>
              </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
