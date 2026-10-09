"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContentImage } from "@/components/content-image";

export type HomeUseCase = {
  title: string;
  href: string;
  imageSrc: string;
  videoSrc?: string;
  brand: string;
  tag: string;
};

export type HomeCategory = {
  title: string;
  body: string;
  imageSrc: string;
  videoSrc?: string;
  tags: string[];
  corners: HomeUseCase[];
};

const slots = [
  "absolute top-4 left-2 md:top-6 md:left-4 xl:top-10 xl:left-10",
  "absolute top-4 right-2 md:top-6 md:right-4 xl:top-10 xl:right-10",
  "absolute bottom-20 left-2 md:bottom-24 md:left-4 xl:bottom-10 xl:left-10",
  "absolute right-2 bottom-20 md:right-4 md:bottom-24 xl:right-10 xl:bottom-10",
];

const CARD_WIDTH_MIN = 7.5;
const CARD_WIDTH_MAX = 14;
const CARD_POS_MIN = 28;
const CARD_POS_MAX = 72;

/** Shared pace so corner cards and the middle stack start and finish together. */
const PACE = {
  out: 340,
  gap: 40,
  in: 640,
} as const;
/** Steady exit — no ease-out crawl that looks like a mid-slide hook. */
const EXIT_EASE = "cubic-bezier(0.4, 0, 0.6, 1)";
const ENTER_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const PACE_EASE = ENTER_EASE;

type CardPose = {
  top: number;
  left: number;
  width: number;
  tick: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomPose(tick: number, band: "top" | "bottom"): CardPose {
  // Keep each side's pair in separate vertical bands so they never overlap.
  const top =
    band === "top" ? rand(CARD_POS_MIN, 44) : rand(56, CARD_POS_MAX);

  return {
    top,
    left: rand(CARD_POS_MIN, CARD_POS_MAX),
    width: rand(CARD_WIDTH_MIN, CARD_WIDTH_MAX),
    tick,
  };
}

function randomPoses(count: number, tick: number): CardPose[] {
  // Slot order: top-left, top-right, bottom-left, bottom-right
  const poses = [
    randomPose(tick, "top"),
    randomPose(tick, "top"),
    randomPose(tick, "bottom"),
    randomPose(tick, "bottom"),
  ];
  return poses.slice(0, count);
}

function Media({
  imageSrc,
  videoSrc,
  alt,
  mirror = false,
  fillFrame = false,
}: {
  imageSrc: string;
  videoSrc?: string;
  alt: string;
  mirror?: boolean;
  fillFrame?: boolean;
}) {
  const frame = mirror
    ? "absolute inset-0 scale-x-[-1] overflow-hidden rounded-md"
    : fillFrame
      ? "absolute inset-0 overflow-hidden rounded-lg"
      : "relative aspect-square w-full overflow-hidden rounded-md";

  return (
    <div className={frame}>
      {videoSrc ? (
        <video
          src={mirror ? `${videoSrc}#t=0.1` : videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          loop={!mirror}
          autoPlay={!mirror}
          muted
          playsInline
        />
      ) : (
        <ContentImage src={imageSrc} alt={alt} fill sizes="(min-width: 1024px) 400px, 90vw" className="object-cover" />
      )}
    </div>
  );
}

function UseCaseCard({
  item,
  place,
  pose,
}: {
  item: HomeUseCase;
  place: string;
  pose: CardPose;
}) {
  const [display, setDisplay] = useState(pose);
  const [visible, setVisible] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    let frame = 0;

    if (first.current) {
      first.current = false;
      setDisplay(pose);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const swap = window.setTimeout(() => {
      setDisplay(pose);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setVisible(true));
      });
    }, PACE.out);

    return () => {
      window.clearTimeout(swap);
      cancelAnimationFrame(frame);
    };
  }, [pose.tick, pose.top, pose.left, pose.width]);

  return (
    <div className={`h-[40%] w-[28%] md:h-[45%] md:w-[30%] ${place}`}>
      <div
        className="absolute origin-center will-change-[transform,opacity]"
        style={{
          top: `${display.top}%`,
          left: `${display.left}%`,
          width: `${display.width}rem`,
          opacity: visible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.55})`,
          transition: visible
            ? `opacity ${PACE.in}ms ease-out, transform ${PACE.in}ms ${PACE_EASE}`
            : `opacity ${PACE.out}ms ease-in, transform ${PACE.out}ms ease-in`,
        }}
      >
        <Link
          href={item.href}
          className="flip-scene group relative block w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <div className="flip-card grid w-full">
            <div className="flip-face flip-front relative col-start-1 row-start-1 rounded-lg border border-[#B9B9B9] bg-white p-1.5 shadow-sm md:p-2">
              <div className="flip-tag absolute top-2 right-px z-[2] max-w-[calc(100%-8px)] rounded-sm bg-[#F9A000] px-2 py-1 font-tanker text-[9px] leading-[1.1] font-normal tracking-normal text-[#131313] uppercase md:top-4 md:px-4 md:py-2 md:text-[12px]">
                {item.title}
              </div>
              <Media imageSrc={item.imageSrc} videoSrc={item.videoSrc} alt={item.title} />
            </div>

            <div className="flip-face flip-back relative col-start-1 row-start-1 rounded-lg border border-[#B9B9B9] bg-white p-1.5 md:p-2">
              <div className="absolute inset-1.5 md:inset-2">
                <Media imageSrc={item.imageSrc} videoSrc={item.videoSrc} alt="" mirror />
                <div className="absolute inset-0 rounded-md bg-black/60 backdrop-blur-[4px]" />
                <div className="absolute inset-0 flex flex-col items-start justify-center gap-1.5 p-2 md:gap-2 md:p-3">
                  <span className="font-tanker text-[9px] leading-[1.2] font-normal tracking-wider text-brand-white uppercase md:text-[12px]">
                    {item.brand}
                  </span>
                  <span className="inline-block max-w-full rounded-sm bg-[#F9A000] px-1.5 py-0.5 font-tanker text-[8px] leading-[1.2] font-normal tracking-normal text-[#131313] uppercase md:px-2 md:py-1 md:text-[10px]">
                    {item.tag}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

const STACK_Y = 6;
const STACK_Z = 5;

type StackMotion = {
  y: number;
  z: number;
  opacity: number;
  zIndex: number;
  transition: string;
};

function restMotion(depth: number, total: number): StackMotion {
  const front = depth === 0;
  return {
    y: front ? 0 : -STACK_Y * depth,
    z: front ? 0 : -STACK_Z * depth,
    opacity: 1,
    zIndex: total - depth,
    transition: `transform ${PACE.in}ms ${ENTER_EASE}`,
  };
}

function CategoryCard({
  item,
  motion,
  onSelect,
  sizer = false,
}: {
  item: HomeCategory;
  motion: StackMotion;
  onSelect: () => void;
  sizer?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      tabIndex={sizer ? -1 : undefined}
      aria-hidden={sizer || undefined}
      className={`flex w-[90vw] max-w-[400px] flex-col items-start overflow-hidden rounded-lg bg-white p-2 text-left shadow-[0px_4px_4px_0px_#00000040] lg:w-[400px] ${
        sizer
          ? "relative invisible pointer-events-none"
          : "absolute top-0 left-1/2 cursor-pointer"
      }`}
      style={
        sizer
          ? undefined
          : {
              zIndex: motion.zIndex,
              opacity: motion.opacity,
              transform: `translateX(-50%) translateY(${motion.y}rem) translateZ(${motion.z}rem)`,
              transition: motion.transition,
              pointerEvents: motion.opacity < 0.5 ? "none" : "auto",
            }
      }
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Media imageSrc={item.imageSrc} videoSrc={item.videoSrc} alt={item.title} fillFrame />
      </div>
      <div className="mt-4 flex w-full flex-col gap-2">
        <h3 className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-black uppercase md:text-[30px]">
          {item.title}
        </h3>
        <p className="font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-black">
          {item.body}
        </p>
      </div>
    </button>
  );
}

type DeckAnim = {
  dir: "next" | "prev";
  from: number;
  to: number;
  mover: number;
  phase: 0 | 1 | 2;
};

function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: HomeCategory[];
  active: number;
  onChange: (index: number) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 8, w: 84 });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const button = row.querySelectorAll("button")[active] as HTMLButtonElement | undefined;
    if (!button) return;
    setPill({ x: button.offsetLeft, w: button.offsetWidth });
  }, [active, categories.length]);

  return (
    <div className="relative z-30 mx-auto h-[52px] w-full max-w-full touch-pan-y overflow-x-auto overflow-y-hidden rounded-[4px] bg-[#1A1A1A] px-3 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-auto">
      <div ref={rowRef} className="relative inline-flex h-full min-w-full items-center md:min-w-0">
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 left-0 rounded-tl-[12px] rounded-bl-[12px] rounded-tr-[1000px] rounded-br-[1000px] bg-brand transition-[transform,width] duration-500 ease-out"
          style={{ transform: `translate3d(${pill.x}px, 0, 0)`, width: pill.w }}
        />
        {categories.map((category, index) => (
          <button
            key={category.title}
            type="button"
            onClick={() => onChange(index)}
            className="relative cursor-pointer px-3 py-2 font-tanker text-[16px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase whitespace-nowrap md:text-[20px]"
          >
            {category.title}
          </button>
        ))}
      </div>
    </div>
  );
}

function motionForCard(
  index: number,
  active: number,
  total: number,
  anim: DeckAnim | null,
): StackMotion {
  const last = total - 1;
  const depthFrom = (i: number, base: number) => (i - base + total) % total;

  if (!anim || total < 2) {
    return restMotion(depthFrom(index, active), total);
  }

  const { dir, from, to, mover, phase } = anim;
  const isMover = index === mover;
  const exit = `transform ${PACE.out}ms ${EXIT_EASE}`;
  const enter = `transform ${PACE.in}ms ${ENTER_EASE}, opacity ${PACE.in}ms ${ENTER_EASE}`;

  if (dir === "next") {
    if (!isMover) {
      const depth = phase === 0 ? depthFrom(index, from) : depthFrom(index, to);
      if (phase === 0 && depth === 1) {
        return {
          ...restMotion(1, total),
          zIndex: total - 1,
          transition: exit,
        };
      }
      return { ...restMotion(depth, total), transition: enter };
    }

    const back = restMotion(last, total);
    if (phase === 0) {
      return {
        y: 10,
        z: 0,
        opacity: 1,
        zIndex: total + 2,
        transition: exit,
      };
    }
    if (phase === 1) {
      return {
        y: back.y - 10,
        z: back.z,
        opacity: 0,
        zIndex: 0,
        transition: "none",
      };
    }
    return {
      ...back,
      opacity: 1,
      zIndex: 1,
      transition: enter,
    };
  }

  if (!isMover) {
    const depth = phase < 2 ? depthFrom(index, from) : depthFrom(index, to);
    const motion = restMotion(depth, total);
    if (phase < 2 && depthFrom(index, from) === 0) {
      return { ...motion, zIndex: total + 1, transition: exit };
    }
    // Keep natural stack order — do not flatten z-index or the new last
    // card flashes above the card in front of it for a frame.
    return { ...motion, transition: phase < 2 ? exit : enter };
  }

  const back = restMotion(last, total);
  if (phase === 0) {
    return {
      y: back.y - 10,
      z: back.z,
      opacity: 1,
      zIndex: 0,
      transition: exit,
    };
  }
  if (phase === 1) {
    return {
      y: 10,
      z: 0,
      opacity: 0,
      zIndex: 0,
      transition: "none",
    };
  }
  return {
    y: 0,
    z: 0,
    opacity: 1,
    zIndex: total + 2,
    transition: enter,
  };
}

export function HomeUseCases({
  categories,
}: {
  categories: HomeCategory[];
}) {
  const [active, setActive] = useState(0);
  const [anim, setAnim] = useState<DeckAnim | null>(null);
  const [poses, setPoses] = useState<CardPose[]>([]);
  const list = categories.filter((item) => item.title.trim());
  const shown = anim?.to ?? active;
  const cards = (list[shown]?.corners ?? []).slice(0, 4);
  const busy = Boolean(anim);

  useEffect(() => {
    if (!cards.length) return;
    setPoses((current) =>
      current.length === cards.length ? current : randomPoses(cards.length, 0),
    );
  }, [cards.length]);

  useEffect(() => {
    if (!anim) return;
    const waits = [PACE.out, PACE.gap, PACE.in] as const;
    const timer = window.setTimeout(() => {
      if (anim.phase < 2) {
        setAnim({ ...anim, phase: (anim.phase + 1) as 0 | 1 | 2 });
        return;
      }
      setActive(anim.to);
      setAnim(null);
    }, waits[anim.phase]);
    return () => window.clearTimeout(timer);
  }, [anim]);

  function reshuffleCorners(tick: number, count = cards.length) {
    if (!count) return;
    setPoses(randomPoses(count, tick));
  }

  function selectCategory(index: number) {
    if (index === active || list.length < 2) return;
    if (busy) return;

    const n = list.length;
    const forward = (index - active + n) % n;
    const backward = (active - index + n) % n;
    const tick = Date.now();
    const nextCount = (list[index]?.corners ?? []).slice(0, 4).length;

    // Jumping more than one step just swaps without the deck motion.
    if (forward !== 1 && backward !== 1) {
      reshuffleCorners(tick, nextCount);
      setActive(index);
      return;
    }

    const dir = forward === 1 ? "next" : "prev";
    const mover = dir === "next" ? active : index;
    reshuffleCorners(tick, nextCount);
    setAnim({ dir, from: active, to: index, mover, phase: 0 });
  }

  if (!list.length) return null;

  const stackBase = anim ? (anim.phase === 0 ? anim.from : anim.to) : active;

  return (
    <section className="relative left-1/2 -ml-[50vw] flex w-screen flex-col items-center bg-brand-white px-4 pt-16 pb-5 text-[#1A1A1A] md:px-[30px] md:pt-24 md:pb-5">
      <h2 className="relative z-20 text-center font-tanker text-[40px] leading-[1.2] font-normal tracking-normal uppercase md:text-[60px]">
        What I do
      </h2>

      <div className="relative z-20 mt-30 md:mt-20 flex w-full max-w-[1380px] flex-col items-center">
        <div className="relative flex w-full flex-col items-center justify-center py-16 md:min-h-[640px] md:pb-24 md:pt-40">
          <div className="relative z-20 block [perspective:30rem]">
            <CategoryCard
              item={list[anim?.to ?? active] ?? list[0]}
              motion={restMotion(0, list.length)}
              onSelect={() => {}}
              sizer
            />
            {list.map((item, index) => (
              <CategoryCard
                key={item.title}
                item={item}
                motion={motionForCard(index, stackBase, list.length, anim)}
                onSelect={() => selectCategory(index)}
              />
            ))}
          </div>

          {cards.length > 0 && poses.length > 0 ? (
            <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
              <div className="pointer-events-auto absolute inset-0">
                {cards.map((item, index) => (
                  <UseCaseCard
                    key={`${shown}-${index}-${item.imageSrc}`}
                    item={item}
                    place={slots[index]}
                    pose={poses[index] ?? randomPose(0, index < 2 ? "top" : "bottom")}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {list.length > 0 ? (
          <CategoryTabs
            categories={list}
            active={shown}
            onChange={selectCategory}
          />
        ) : null}
      </div>
    </section>
  );
}
