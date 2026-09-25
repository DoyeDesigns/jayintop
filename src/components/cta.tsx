export function Cta() {
  return (
    <section className="bg-brand px-6 py-10 text-center w-full max-w-[1300px] mx-auto md:py-28">
      <div className="mx-auto flex flex-col items-center">
        <h2 className="font-tanker text-[30px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[60px]">
          Tell me what you are building
        </h2>
        <p className="mt-5 max-w-2xl font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white">
          Send a short note about the project and what it needs to achieve. If I
          am not the right person for it, I will say so and point you somewhere
          better.
        </p>
        <a
          href="#work"
          className="mt-10 inline-flex h-[52px] items-center justify-center rounded-tr-[1000px] rounded-br-[1000px] bg-brand-white px-8 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap text-brand uppercase"
        >
          Start a project
        </a>
      </div>
    </section>
  );
}
