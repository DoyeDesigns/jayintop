import Image from "next/image";
import Link from "next/link";
import { HomeBelief } from "@/components/home-belief";
import { HomeSelectedWorks } from "@/components/home-selected-works";
import { HomeTestimonials } from "@/components/home-testimonials";

const sideCopy =
  "font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white";

const workLinkClass =
  "inline-flex h-[52px] items-center justify-center rounded-tl-[12px] rounded-tr-[1000px] rounded-br-[1000px] rounded-bl-[12px] border-2 border-brand bg-brand px-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase";

function Portrait({ priority = false }: { priority?: boolean }) {
  return (
    <div className="relative aspect-square w-[280px] shrink-0 overflow-hidden rounded-full md:w-[340px]">
      <Image
        src="/about-yinka.png"
        alt="Yinka T. Jayeola"
        fill
        priority={priority}
        sizes="340px"
        className="object-cover"
      />
    </div>
  );
}

export default function Home() {
  return (
    <main className="px-8 pt-16 pb-0 md:px-10 md:pt-24 md:pb-0">
      <div className="flex flex-col items-center md:hidden">
        <Portrait priority />
        <div className="mt-8 flex w-full flex-col items-start text-left">
          <p className="font-bespoke text-[28px] leading-[1.2] font-normal tracking-normal text-brand-white">
            Yinka T. Jayeola
          </p>
          <h1 className="mt-2 font-tanker text-[48px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
            Designer. Strategist. Maker.
          </h1>
          <p className={`${sideCopy} mt-4`}>
            Brand identity and product UI/UX design for startups in fintech,
            healthtech and edtech. I take an identity from the first brief to a
            finished system, and a product from the first idea to a shipped
            release.
          </p>
          <p className={`${sideCopy} mt-4`}>
            Every project runs the same four steps: discovery, brief, creation,
            delivery. Nothing gets designed until we both agree in writing what
            it needs to achieve.
          </p>
          <Link href="/selected-work" className={`${workLinkClass} mt-6`}>
            See my work
          </Link>
        </div>
      </div>

      <div className="hidden md:block">
        <p className="text-center font-bespoke text-[48px] leading-[79.27px] font-normal tracking-normal text-brand-white">
          Yinka T. Jayeola
        </p>
        <h1 className="mx-auto mt-2 max-w-[776px] text-center font-tanker text-[80px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
          Design that <span className="text-[#F9A000]">works</span> as well as
          it looks.
        </h1>
        <div className="mt-24 flex items-start justify-center gap-12">
          <p className={`${sideCopy} w-[280px] pt-16`}>
            Brand identity and product UI/UX design for startups in fintech,
            healthtech and edtech. I take an identity from the first brief to a
            finished system, and a product from the first idea to a shipped
            release.
          </p>
          <Portrait />
          <div className="flex w-[280px] flex-col items-start gap-6 pt-16">
            <p className={sideCopy}>
              Every project runs the same four steps: discovery, brief,
              creation, delivery. Nothing gets designed until we both agree in
              writing what it needs to achieve.
            </p>
            <Link href="/selected-work" className={workLinkClass}>
              See my work
            </Link>
          </div>
        </div>
      </div>
      <HomeSelectedWorks />
      <HomeBelief />
      <HomeTestimonials />
    </main>
  );
}
