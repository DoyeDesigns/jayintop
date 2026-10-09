import { MarqueeRow } from "@/components/marquee-row";

const marquee = "TESTIMONIALS // ".repeat(8);

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
        <div className="flex flex-col gap-4 md:hidden">
          {items.slice(0, 4).map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              className="flex flex-col justify-between gap-12 rounded-[12px] border border-[#E9EAEB] bg-[#1A1A1A] p-8"
            >
              <CardBody item={item} />
            </article>
          ))}
        </div>
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
