"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  selectedWork,
  workFilters,
  type WorkFilter,
  type WorkItem,
} from "@/lib/work";

const tabClass =
  "inline-flex h-[42px] shrink-0 items-center gap-[6.66px] rounded-tl-[8px] rounded-tr-[666px] rounded-br-[666px] rounded-bl-[8px] border-b-2 pt-[8px] pb-[8px] font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap uppercase";

export function SelectedWork({ items = selectedWork }: { items?: WorkItem[] }) {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const activeFilter = workFilters.find((item) => item.id === filter) ?? workFilters[0];

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      setStuck(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const visible =
    filter === "all"
      ? items
      : items.filter((item) => item.filters.includes(filter));

  return (
    <div className="mt-10">
      <div ref={sentinelRef} aria-hidden className="h-px" />
      <div
        className={`sticky top-0 z-30 ${
          stuck
            ? "bg-[#131313] bg-[url('/backgrounds/default.svg')] bg-cover bg-fixed bg-center"
            : ""
        }`}
      >
        <div className="px-8 py-4 md:px-10">
          <div className="relative md:hidden">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-full items-center justify-between rounded-[4px] border border-[#D5D7DA] bg-brand px-3 py-2 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase"
            >
              {activeFilter.label}
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
                  {workFilters.map((item) => {
                    const active = filter === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setFilter(item.id);
                            setMenuOpen(false);
                          }}
                          className={`flex w-full pr-3 py-2 text-left font-tanker text-[20px] leading-[1.2] font-normal tracking-normal uppercase ${
                            active ? "text-brand" : "text-brand-white"
                          }`}
                        >
                          {item.label}
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
            {workFilters.map((item) => {
              const active = filter === item.id;
              const stuckActive = stuck && active;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.id)}
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
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <ul className="mt-8 flex flex-col gap-12 px-8 md:px-10">
        {visible.map((item) => (
          <li key={item.id}>
            <article>
              <Link href={`/selected-work/${item.id}`} className="block">
              <div className="relative aspect-[1380/640] overflow-hidden rounded-lg">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 1200px, 100vw"
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
