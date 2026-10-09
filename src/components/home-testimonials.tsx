"use client";

import { useEffect, useRef, useState } from "react";
import { MarqueeRow } from "@/components/marquee-row";

const marquee = "TESTIMONIALS // ".repeat(8);
const strip = 56;
const step = strip;

export type HomeTestimonial = {
  quote: string;
  name: string;
  role: string;
};

function CardBody({ item }: { item: HomeTestimonial }) {
  return (
    <>
      <p className="font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white">
        {item.quote}
      </p>
      <div>
        <p className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
          {item.name}
        </p>
        <p className="font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-[#A4A7AE]">
          {item.role}
        </p>
      </div>
    </>
  );
}

function MobileStack({ items }: { items: HomeTestimonial[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(480);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const cards = () => [...root.querySelectorAll("article")];

    const layout = () => {
      const list = cards();
      const origin = root.getBoundingClientRect().top;
      const tops = list.map((card) => card.getBoundingClientRect().top - origin);

      let front = 0;
      list.forEach((_, index) => {
        if (tops[index] <= index * step + 8) front = index;
      });
      list.forEach((card, index) => {
        const behind = index < front;
        const depth = behind ? front - index : 0;
        const resting = index * step;
        const far = resting + 280;
        const y = tops[index];
        const arrival =
          index === 0
            ? 1
            : y >= far
              ? 0
              : y <= resting
                ? 1
                : (far - y) / (far - resting);

        const scale = behind
          ? Math.max(0.72, 1 - depth * 0.1)
          : Math.max(0.72, 1 - (1 - arrival) * 0.16);
        card.style.transform = `scaleX(${scale.toFixed(3)})`;
        card.style.transformOrigin = "top center";

        if (!behind) {
          card.style.clipPath = "none";
          return;
        }

        const hidden = Math.max(0, card.offsetHeight - strip);
        card.style.clipPath = `inset(0 0 ${hidden}px 0 round 12px 12px 0 0)`;
      });
    };

    const measure = () => {
      const list = cards();
      const next = list.reduce((max, card, index) => {
        return Math.max(max, index * step + card.offsetHeight);
      }, 0);
      setHeight((current) => (Math.abs(current - next) > 1 ? next : current));
      layout();
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    };

    measure();
    root.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(measure);
    cards().forEach((card) => observer.observe(card));
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [items]);

  return (
    <div
      ref={scrollerRef}
      className="overflow-y-auto overscroll-y-contain md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ height }}
    >
      {items.map((item, index) => (
        <article
          key={`${item.name}-${index}`}
          className="sticky flex flex-col justify-between gap-12 rounded-[12px] border border-[#E9EAEB] bg-[#1A1A1A] p-8"
          style={{ top: index * step, zIndex: index + 1 }}
        >
          <CardBody item={item} />
        </article>
      ))}
    </div>
  );
}

export function HomeTestimonials({ items }: { items: HomeTestimonial[] }) {
  return (
    <section>
      <MarqueeRow
        direction="rtl"
        className="relative left-1/2 flex h-[50px] w-screen -translate-x-1/2 items-center bg-[#E8B23D] md:h-[100px]"
      >
        <p className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap text-black uppercase md:text-[40px]">
          {marquee}
        </p>
      </MarqueeRow>

      <div className="py-16 md:py-20">
        <MobileStack items={items.slice(0, 4)} />
        <div className="hidden md:grid md:grid-cols-3 md:items-stretch md:gap-6">
          {items.slice(0, 6).map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="flex h-full flex-col justify-between gap-12 rounded-[12px] border border-[#E9EAEB] bg-[#1A1A1A] p-8"
            >
              <CardBody item={item} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
