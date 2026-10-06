export function Cta({
  headline,
  body,
  cta,
}: {
  headline: string;
  body: string;
  cta: string;
}) {
  return (
    <section className="w-full bg-brand py-10 text-center md:py-28">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col items-center px-4 md:px-[30px]">
        <h2 className="font-tanker text-[30px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[60px]">
          {headline}
        </h2>
        <p className="mt-5 max-w-2xl font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white">
          {body}
        </p>
        <a
          href="/contact"
          className="mt-10 inline-flex h-[52px] items-center justify-center rounded-tr-[1000px] rounded-br-[1000px] bg-brand-white px-8 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap text-brand uppercase transition-colors duration-200 hover:bg-[#131313] hover:text-brand-white"
        >
          {cta}
        </a>
      </div>
    </section>
  );
}
