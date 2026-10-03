import Image from "next/image";
import Link from "next/link";
import { MarqueeRow } from "@/components/marquee-row";

const marquee = "// ABOUT ".repeat(10);

const ctaClass =
  "inline-flex h-[52px] w-fit items-center justify-center rounded-tl-[12px] rounded-tr-[1000px] rounded-br-[1000px] rounded-bl-[12px] border-2 border-brand bg-brand px-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase";

export function HomeBelief({
  eyebrow,
  lead,
  paragraphs,
}: {
  eyebrow: string;
  lead: string;
  paragraphs: string[];
}) {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2">
      <MarqueeRow direction="rtl" className="bg-brand py-2">
        <p className="font-tanker md:text-[40px] text-[24px] leading-[1.2] font-normal tracking-normal whitespace-nowrap text-brand-white uppercase">
          {marquee}
        </p>
      </MarqueeRow>

      <div className="bg-brand-white text-[#1A1A1A]">
        <div className="flex w-full flex-col-reverse items-center gap-12 px-8 py-16 md:flex-row md:items-center md:justify-center md:gap-16 md:px-10 md:py-24">
          <div className="flex w-full flex-col items-start md:w-auto md:max-w-[640px]">
            <h2 className="font-tanker text-[40px] leading-[1.2] font-normal tracking-normal uppercase md:text-[60px]">
              {eyebrow}
            </h2>
            <p className="mt-4 font-bespoke text-[24px] leading-[1.5] font-normal tracking-normal md:text-[30px]">
              {lead}
            </p>
            <div className="mt-6 flex flex-col gap-4 font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href="/about" className={`${ctaClass} mt-8`}>
              More about me
            </Link>
          </div>

          <div className="w-full max-w-[520px] shrink-0 md:w-[520px]">
            <Image
              src="/about-img-mobile.png"
              alt="Yinka sketching logo ideas at a desk"
              width={372}
              height={372}
              className="h-auto w-full md:hidden"
            />
            <Image
              src="/about-img.png"
              alt="Yinka sketching logo ideas at a desk"
              width={582}
              height={582}
              className="hidden h-auto w-full md:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
