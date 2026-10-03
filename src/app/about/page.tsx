import type { Metadata } from "next";
import { ContentImage } from "@/components/content-image";
import { Testimonials } from "@/components/testimonials";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await readSiteContent();
  return {
    title: "About",
    description: about.sub,
  };
}

const sectionTitle =
  "text-left font-tanker text-[24px] leading-[1.2] font-normal tracking-normal uppercase md:text-[60px]";

const body =
  "text-left font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal";

function highlighted(text: string, highlight: string) {
  const index = highlight ? text.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-[#F9A000]">
        {text.slice(index, index + highlight.length)}
      </span>
      {text.slice(index + highlight.length)}
    </>
  );
}

function Paragraphs({ text, className }: { text: string; className: string }) {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {(parts.length ? parts : [text]).map((part) => (
        <p key={part}>{part}</p>
      ))}
    </div>
  );
}

export default async function AboutPage() {
  const { about, testimonials } = await readSiteContent();
  const lead = about.sections.slice(0, 2);
  const rest = about.sections.slice(2);
  const portrait = about.sections.find((section) => section.media)?.media;
  const sideImage = rest.find((section) => section.media)?.media;
  const quotes = testimonials
    .filter((item) => item.quote.trim())
    .map(({ quote, name, role }) => ({ quote, name, role }));

  return (
    <main className="pt-16 md:pt-24">
      <div className="px-8 md:px-10">
      <h1 className="text-center font-tanker text-[40px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[80px]">
        {highlighted(about.headline, about.highlight)}
      </h1>
      <p className="mx-auto mt-4 max-w-[760px] text-center font-bespoke text-[20px] leading-[1.5] font-normal tracking-normal text-brand-white">
        {about.sub}
      </p>

      <div className="mt-14 flex flex-col items-center gap-10 md:mt-20 md:flex-row md:items-center md:gap-16">
        <div className="relative mx-auto aspect-square w-full max-w-[420px] shrink-0 overflow-hidden rounded-full md:mx-0">
          <ContentImage
            src={portrait?.src ?? "/about-yinka.png"}
            alt={about.eyebrow || "Yinka T. Jayeola"}
            fill
            priority
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col gap-10 text-left">
          {lead.map((section) => (
            <section key={section.title}>
              <h2 className={`${sectionTitle} text-brand-white`}>{section.title}</h2>
              <Paragraphs
                text={section.body}
                className={`${body} mt-4 flex flex-col gap-4 text-brand-white`}
              />
            </section>
          ))}
        </div>
      </div>
      </div>

      <section className="relative left-1/2 mt-16 w-screen -translate-x-1/2 bg-[#F5F1E8] py-16 text-[#1A1A1A] md:mt-24 md:py-24">
        <div className="flex max-w-[1380px] mx-auto flex-col items-center gap-10 px-8 md:flex-row md:items-center md:gap-16 md:px-10">
          <ContentImage
            src={sideImage?.src ?? "/about-img-2.png"}
            alt=""
            width={651}
            height={858}
            className="mx-auto h-auto w-full max-w-[520px] md:mx-0 md:w-[42%] md:max-w-none md:shrink-0"
          />

          <div className="flex w-full flex-col gap-10 text-left">
            {rest.map((section) => (
              <section key={section.title}>
                <h2 className={sectionTitle}>{section.title}</h2>
                {section.title === "The way I work" ? (
                  <div className={`${body} mt-4 flex flex-col gap-4`}>
                    <p>
                      Four steps, every time.{" "}
                      <strong className="font-bold">
                        Discovery, brief, creation, delivery.
                      </strong>{" "}
                      Nothing gets designed until we have both agreed in writing
                      what it needs to achieve.
                    </p>
                    <p>
                      Research comes before drawing. I have run more than sixty
                      user interviews on a single project just to check a direction
                      was worth building. I write decisions down instead of
                      defending them in a meeting, and I show progress at agreed
                      points rather than saving one big reveal for the end.
                    </p>
                    <p>
                      Delivery means what it says. Files named and organised,
                      accessibility handled from the first screen, and a handover
                      your developers can build from without a follow up call.
                    </p>
                  </div>
                ) : (
                  <Paragraphs text={section.body} className={`${body} mt-4 flex flex-col gap-4`} />
                )}
              </section>
            ))}

            <section>
              <h2 className={sectionTitle}>Things worth knowing</h2>
              <ol className="mt-6 flex flex-col gap-6">
                {about.bits.map((note, index) => (
                  <li key={note} className="flex items-start gap-4">
                    <span className="font-tanker text-[40px] leading-[1.2] font-normal tracking-normal">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className={body}>{note}</p>
                  </li>
                ))}
              </ol>
              {about.receipts.length ? (
                <ul className="mt-10 grid grid-cols-2 gap-6">
                  {about.receipts.map((receipt) => (
                    <li key={`${receipt.value}-${receipt.label}`}>
                      <p className="font-tanker text-[40px] leading-[1.2] font-normal tracking-normal">
                        {receipt.value}
                      </p>
                      <p className={body}>{receipt.label}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          </div>
        </div>
      </section>
      <Testimonials items={quotes} closeLine={about.closeLine} closeCta={about.closeCta} />
    </main>
  );
}
