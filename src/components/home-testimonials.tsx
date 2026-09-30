"use client";

import { useEffect, useRef, useState } from "react";
import { MarqueeRow } from "@/components/marquee-row";

const marquee = "TESTIMONIALS // ".repeat(8);
const strip = 56;
const gap = 16;
const step = strip + gap;

const items = [
  {
    quote:
      "Yinka served as our sole design partner from pre-seed through launch, delivering over 120 screens across onboarding, quotation, messaging and payments. Following an extensive user research programme, quote-to-booking conversion improved by 35%. Version 1.0 reached 10,000 downloads.",
    name: "Nikolas Gibbons",
    role: "Founder, FixMyBuild",
  },
  {
    quote:
      "He is patient, and therefore can produce exactly what I need at high quality. He has done a great job designing our site and I am very happy. The logo designs are professional and I will definitely be using his services again.",
    name: "Brett Henry Murphy",
    role: "Product Manager",
  },
  {
    quote:
      "I came to Yinka with a completely different task, but he suggested changing my initial logo first. The new one beat my original more than ten times over. I received more value than the amount I paid.",
    name: "Design Magic",
    role: "Powersurge",
  },
];

function CardBody({ item }: { item: (typeof items)[number] }) {
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

function MobileStack() {
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
        card.style.clipPath = `inset(0 0 ${hidden}px 0 round 12px)`;
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
  }, []);

  return (
    <div
      ref={scrollerRef}
      className="overflow-y-auto overscroll-y-contain md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ height }}
    >
      {items.map((item, index) => (
        <article
          key={item.name}
          className="sticky mb-4 flex flex-col justify-between gap-12 rounded-[12px] border border-[#E9EAEB] bg-[#1A1A1A] p-8 last:mb-0"
          style={{ top: index * step, zIndex: index + 1 }}
        >
          <CardBody item={item} />
        </article>
      ))}
    </div>
  );
}

export function HomeTestimonials() {
  return (
    <section>
      <MarqueeRow
        direction="rtl"
        className="relative left-1/2 w-screen -translate-x-1/2 bg-[#E8B23D] py-2"
      >
        <p className="font-tanker text-[24px] leading-[1.2] font-normal tracking-normal whitespace-nowrap text-black uppercase md:text-[40px]">
          {marquee}
        </p>
      </MarqueeRow>

      <div className="py-16 md:py-20">
        <MobileStack />
        <div className="hidden md:grid md:grid-cols-3 md:items-stretch md:gap-6">
          {items.map((item) => (
            <article
              key={item.name}
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
