import Link from "next/link";
import { MarqueeRow } from "@/components/marquee-row";
import type { Testimonial } from "@/lib/testimonials";

const quoteClass =
  "font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white";

const nameClass =
  "mt-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase";

const roleClass =
  "font-inter text-[16px] leading-6 font-normal tracking-normal text-[#A4A7AE]";

function TestimonialCard({ quote, name, role }: Testimonial) {
  return (
    <article className="rounded-[12px] border border-[#E9EAEB] bg-[#272727] p-5">
      <p className={quoteClass}>{quote}</p>
      <p className={nameClass}>{name}</p>
      <p className={roleClass}>{role}</p>
    </article>
  );
}

function columnsFor(items: Testimonial[]) {
  const columns: Testimonial[][] = [[], [], []];
  items.forEach((item, index) => {
    columns[index % 3].push(item);
  });
  return columns.filter((column) => column.length > 0);
}

export function Testimonials({
  items,
  closeLine,
  closeCta,
}: {
  items?: Testimonial[];
  closeLine?: string;
  closeCta?: string;
}) {
  const columns = items?.length ? columnsFor(items) : [];
  if (!columns.length && !closeLine?.trim() && !closeCta?.trim()) return null;

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2">
      <MarqueeRow
        direction="rtl"
        className="flex h-[50px] items-center bg-brand text-brand-white md:h-[100px]"
      >
        <span className="inline-flex shrink-0 items-center gap-8 pr-8 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap uppercase md:text-[40px]">
          <span>Testimonial // Testimonial</span>
          <img
            src="/logo-white.svg"
            alt=""
            width={22}
            height={32}
            className="h-8 w-[22px]"
          />
        </span>
      </MarqueeRow>

      <div className="mx-auto w-full max-w-[1380px] px-4 py-10 md:px-[30px] md:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {columns.map((column) => (
            <div key={column[0].name} className="flex flex-1 flex-col gap-4">
              {column.map((item) => (
                <TestimonialCard key={item.name} {...item} />
              ))}
            </div>
          ))}
        </div>

        {closeLine?.trim() || closeCta?.trim() ? (
        <div className="hidden mx-auto my-25 max-w-[760px] text-center md:mt-24">
          {closeLine?.trim() ? (
          <h2 className="font-tanker text-[40px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[60px]">
            {closeLine}
          </h2>
          ) : null}
          {closeCta?.trim() ? (
          <Link
            href="/selected-work"
            className="mt-8 inline-flex h-[52px] items-center justify-center rounded-full rounded-tl-none rounded-bl-none bg-brand px-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase transition-colors duration-200 hover:bg-brand/70"
          >
            {closeCta}
          </Link>
          ) : null}
        </div>
        ) : null}
      </div>
    </section>
  );
}
