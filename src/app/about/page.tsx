import type { Metadata } from "next";
import { ContentImage } from "@/components/content-image";
import { Testimonials } from "@/components/testimonials";
import { plainRich, RichParagraphs, RichText } from "@/lib/rich-text";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await readSiteContent();
  return {
    title: "About",
    description: plainRich(about.sub),
  };
}

const sectionTitle =
  "text-left font-tanker text-[24px] leading-[1.2] font-normal tracking-normal uppercase md:text-[60px]";

const body =
  "text-left font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal";

const splitRow =
  "flex flex-col items-center gap-10 md:grid md:grid-cols-[minmax(0,42%)_minmax(0,1fr)] md:items-start md:gap-16";

const mediaCol = "mx-auto w-full max-w-[520px] md:mx-0 md:max-w-none";

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
      <div>
      {about.headline.trim() ? (
      <h1 className="text-center font-tanker text-[40px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[80px]">
        <RichText text={about.headline} highlight={about.highlight} />
      </h1>
      ) : null}
      {about.sub.trim() ? (
      <p className="mx-auto mt-4 max-w-[760px] text-center font-bespoke text-[20px] leading-[1.5] font-normal tracking-normal text-brand-white">
        <RichText text={about.sub} />
      </p>
      ) : null}

      <div className={`mt-14 md:mt-20 ${splitRow}`}>
        <div className={`relative aspect-square overflow-hidden rounded-full ${mediaCol}`}>
          <ContentImage
            src={portrait?.src ?? ""}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 42vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full min-w-0 flex-col gap-10 text-left">
          {lead.map((section, index) => (
            <section key={`${section.title}-${index}`}>
              {section.title.trim() ? (
                <h2 className={`${sectionTitle} text-brand-white`}>{section.title}</h2>
              ) : null}
              {section.body.trim() ? (
              <RichParagraphs
                text={section.body}
                className={`${body} mt-4 flex flex-col gap-4 text-brand-white`}
              />
              ) : null}
            </section>
          ))}
        </div>
      </div>
      </div>

      <section className="relative left-1/2 mt-16 -ml-[50vw] w-screen bg-[#F5F1E8] py-16 text-[#1A1A1A] md:mt-24 md:py-24">
        <div className={`mx-auto w-full max-w-[1380px] px-4 md:px-[30px] ${splitRow}`}>
          <ContentImage
            src={sideImage?.src ?? ""}
            alt=""
            width={651}
            height={858}
            className={`h-auto ${mediaCol}`}
          />

          <div className="flex w-full min-w-0 flex-col gap-10 text-left">
            {rest.map((section, index) => (
              <section key={`${section.title}-${index}`}>
                {section.title.trim() ? <h2 className={sectionTitle}>{section.title}</h2> : null}
                {section.body.trim() ? (
                  <RichParagraphs text={section.body} className={`${body} mt-4 flex flex-col gap-4`} />
                ) : null}
              </section>
            ))}

            {about.bits.filter((note) => note.trim()).length ? (
            <section>
              <h2 className={sectionTitle}>Things worth knowing</h2>
              <ol className="mt-6 flex flex-col gap-6">
                {about.bits.filter((note) => note.trim()).map((note, index) => (
                  <li key={note} className="flex items-start gap-4">
                    <span className="font-tanker text-[40px] leading-[1.2] font-normal tracking-normal">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className={body}>{note}</p>
                  </li>
                ))}
              </ol>
            </section>
            ) : null}
          </div>
        </div>
      </section>
      <Testimonials items={quotes} closeLine={about.closeLine} closeCta={about.closeCta} />
    </main>
  );
}
