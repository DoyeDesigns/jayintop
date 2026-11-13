import Link from "next/link";
import { ContentImage } from "@/components/content-image";
import { MarqueeRow } from "@/components/marquee-row";

const marquee = "// ABOUT ".repeat(10);

const ctaClass =
  "inline-flex h-[52px] w-fit items-center justify-center rounded-tl-[12px] rounded-tr-[1000px] rounded-br-[1000px] rounded-bl-[12px] bg-brand px-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase transition-colors duration-200 hover:bg-brand/70";

export function HomeBelief({
  eyebrow,
  lead,
  paragraphs,
  imageSrc,
}: {
  eyebrow: string;
  lead: string;
  paragraphs: string[];
  imageSrc?: string;
}) {
  return (
    <section>
      <MarqueeRow
        direction="rtl"
        className="relative left-1/2 flex h-[50px] w-screen -translate-x-1/2 items-center bg-brand text-brand-white md:h-[100px]"
      >
        <p className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap uppercase md:text-[40px]">
          {marquee}
        </p>
      </MarqueeRow>

      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-brand-white text-[#1A1A1A]">
        <div className="mx-auto flex w-full max-w-[1380px] flex-col-reverse items-center gap-12 px-4 py-16 md:flex-row md:items-center md:justify-center md:gap-16 md:px-[30px] md:py-24">
          <div className="flex w-full flex-col items-start md:w-auto md:max-w-[640px]">
            {eyebrow.trim() ? (
            <h2 className="font-tanker text-[40px] leading-[1.2] font-normal tracking-normal uppercase md:text-[60px]">
              {eyebrow}
            </h2>
            ) : null}
            {lead.trim() ? (
            <p className="mt-4 font-bespoke text-[24px] leading-[1.5] font-normal tracking-normal md:text-[30px]">
              {lead}
            </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-4 font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href="/about" className={`${ctaClass} mt-8`}>
              More about me
            </Link>
          </div>

          <div className="relative aspect-square w-full max-w-[520px] shrink-0 overflow-hidden md:w-[520px]">
            <ContentImage
              src={imageSrc ?? ""}
              alt=""
              fill
              sizes="520px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
