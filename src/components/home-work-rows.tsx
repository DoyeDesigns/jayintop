"use client";

import Image from "next/image";
import Link from "next/link";
import { MarqueeRow } from "@/components/marquee-row";
import { selectedWork } from "@/lib/work";

const rulerPhrase = "Selected works // ".repeat(8);

export function SelectedWorksRuler() {
  return (
    <MarqueeRow
      direction="ltr"
      className="pointer-events-none bg-[#F5F1E8] py-2 md:py-3"
    >
      <span className="font-tanker text-[22px] leading-none font-normal tracking-normal whitespace-nowrap text-[#111111] uppercase md:text-[36px]">
        {rulerPhrase}
      </span>
    </MarqueeRow>
  );
}

export function SelectedWorksStrip({
  direction,
  tall = false,
}: {
  direction: "rtl" | "ltr";
  tall?: boolean;
}) {
  const cardClass = tall
    ? "relative block h-[220px] w-[200px] shrink-0 overflow-hidden md:h-[340px] md:w-[260px]"
    : "relative block h-[180px] w-[280px] shrink-0 overflow-hidden md:h-[260px] md:w-[400px]";

  return (
    <MarqueeRow direction={direction}>
      <ul className="flex items-center gap-3 pr-3">
        {selectedWork.map((item) => (
          <li key={item.id} className="shrink-0">
            <Link
              href={`/selected-work/${item.id}`}
              draggable={false}
              className={`group ${cardClass}`}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes={tall ? "260px" : "400px"}
                draggable={false}
                className="pointer-events-none object-cover"
              />
              <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40 group-focus-visible:bg-black/40">
                <span className="px-4 text-center font-inter text-[22px] leading-none font-medium text-[#DEDAD2] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:text-[32px]">
                  {item.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </MarqueeRow>
  );
}
