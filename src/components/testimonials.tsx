import Link from "next/link";
import { testimonialColumns, type Testimonial } from "@/lib/testimonials";

const quoteClass =
  "font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white";

const nameClass =
  "mt-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase";

const roleClass =
  "font-inter text-[16px] leading-6 font-normal tracking-normal text-[#A4A7AE]";

function MarqueeItem() {
  return (
    <span className="inline-flex shrink-0 items-center gap-8 pr-8">
      <span>Testimonial // Testimonial</span>
      <img
        src="/logo-white.svg"
        alt=""
        width={22}
        height={32}
        className="h-8 w-[22px]"
      />
    </span>
  );
}

function TestimonialCard({ quote, name, role }: Testimonial) {
  return (
    <article className="rounded-[12px] border border-[#E9EAEB] bg-[#272727] p-5">
      <p className={quoteClass}>{quote}</p>
      <p className={nameClass}>{name}</p>
      <p className={roleClass}>{role}</p>
    </article>
  );
}

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {Array.from({ length: 6 }, (_, index) => (
        <MarqueeItem key={index} />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="flex md:h-[100px] h-[50px] items-center overflow-hidden bg-brand text-brand-white">
        <div className="flex w-max animate-[testimonial-marquee_28s_linear_infinite] font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap uppercase md:text-[40px]">
          <Track />
          <Track hidden />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1380px] px-8 py-10 md:px-10 md:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {testimonialColumns.map((column) => (
            <div key={column[0].name} className="flex flex-1 flex-col gap-4">
              {column.map((item) => (
                <TestimonialCard key={item.name} {...item} />
              ))}
            </div>
          ))}
        </div>

        <div className="hidden md:block mx-auto my-25 max-w-[760px] text-center md:mt-24">
          <h2 className="font-tanker text-[40px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[60px]">
            For people who want the work to actually work.
          </h2>
          <p className="mt-4 font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-[#C7C3BB]">
            Tell me what you want to build and what it has to achieve. Every
            project starts with a discovery session and a written brief — no
            guesswork, no surprises.
          </p>
          <Link
            href="/selected-work"
            className="mt-8 inline-flex h-[52px] items-center justify-center rounded-full rounded-tl-none rounded-bl-none  bg-brand px-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase"
          >
            See what I have made
          </Link>
        </div>
      </div>
    </section>
  );
}
