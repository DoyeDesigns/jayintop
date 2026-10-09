import Image from "next/image";
import Link from "next/link";
import { HomeBelief } from "@/components/home-belief";
import { HomeSelectedWorks } from "@/components/home-selected-works";
import { HomeTestimonials } from "@/components/home-testimonials";
import { HomeUseCases, type HomeCategory, type HomeUseCase } from "@/components/home-use-cases";
import { HomeVideo } from "@/components/home-video";
import type { HomeCorner, Service, WorkFilterItem } from "@/lib/admin-content";
import { RichText } from "@/lib/rich-text";
import { homeMarqueeWork, publishedWork } from "@/lib/public-work";
import type { WorkItem } from "@/lib/work";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

const sideCopy =
  "font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white";

const workLinkClass =
  "inline-flex h-[52px] items-center justify-center rounded-tl-[12px] rounded-tr-[1000px] rounded-br-[1000px] rounded-bl-[12px] bg-brand px-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase transition-colors duration-200 hover:bg-brand/70";

const fallbackImages = ["/about-img.png", "/about-img-2.png", "/about-yinka.png", "/about-img-mobile.png"];

function cornerItems(corners: HomeCorner[], works: WorkItem[]): HomeUseCase[] {
  return corners.slice(0, 4).map((corner, index) => {
    const work = works[index];
    const imageSrc =
      corner.image?.src ||
      work?.image ||
      work?.imageMobile ||
      fallbackImages[index % fallbackImages.length];

    return {
      title: corner.title.trim() || work?.title || `Work ${index + 1}`,
      href:
        corner.href.trim() ||
        (work ? `/selected-work/${work.id}` : "#"),
      imageSrc,
      videoSrc: work?.sections.find((section) => section.video)?.video,
      brand:
        corner.brand.trim() ||
        work?.client.trim() ||
        work?.director.trim() ||
        "Jayintop",
      tag:
        corner.tag.trim() ||
        work?.categories.find((category) => category.trim()) ||
        "Case study",
    };
  });
}

function categoryItems(
  filters: WorkFilterItem[],
  services: Service[],
  works: WorkItem[],
): HomeCategory[] {
  return filters
    .filter((filter) => !filter.all && !filter.hidden && filter.label.trim())
    .map((filter, index) => {
      const key = filter.label.trim().toLowerCase();
      const service = services.find(
        (item) => item.title.trim().toLowerCase() === key,
      );
      return {
        title: filter.label,
        body: service?.copy ?? "",
        imageSrc:
          service?.image?.src || fallbackImages[index % fallbackImages.length],
        tags: [],
        corners: cornerItems(service?.corners ?? [], works),
      };
    });
}

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

export default async function Home() {
  const content = await readSiteContent();
  const { home, testimonials } = content;
  const works = publishedWork(content);
  const quotes = testimonials
    .filter((item) => item.quote.trim())
    .map(({ quote, name, role }) => ({ quote, name, role }));

  return (
    <main className="pt-16 pb-0 md:pt-24 md:pb-0">
      <div className="flex flex-col items-center md:hidden mb-10">
        <Portrait priority />
        <div className="mt-8 flex w-full flex-col items-start text-left">
          <p className="font-bespoke text-[28px] leading-[1.2] font-normal tracking-normal text-brand-white">
            {home.heroName}
          </p>
          <h1 className="mt-2 font-tanker text-[48px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
            <RichText text={home.heroHeadline} highlight={home.heroHighlight} />
          </h1>
          <p className={`${sideCopy} mt-4`}>{home.heroLeft}</p>
          <p className={`${sideCopy} mt-4`}>{home.heroRight}</p>
          <Link href="/selected-work" className={`${workLinkClass} mt-6`}>
            {home.heroCta}
          </Link>
        </div>
      </div>

      <div className="hidden md:h-[890px] md:block">
        <p className="text-center font-bespoke text-[48px] leading-[79.27px] font-normal tracking-normal text-brand-white">
          {home.heroName}
        </p>
        <h1 className="mx-auto mt-2 max-w-[776px] text-center font-tanker text-[80px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
          <RichText text={home.heroHeadline} highlight={home.heroHighlight} />
        </h1>
        <div className="mt-24 flex items-start justify-center gap-12">
          <p className={`${sideCopy} w-[280px] pt-16`}>{home.heroLeft}</p>
          <Portrait />
          <div className="flex w-[280px] flex-col items-start gap-6 pt-16">
            <p className={sideCopy}>{home.heroRight}</p>
            <Link href="/selected-work" className={workLinkClass}>
              {home.heroCta}
            </Link>
          </div>
        </div>
      </div>
      <HomeSelectedWorks items={homeMarqueeWork(content)} />
      <HomeBelief
        eyebrow={home.beliefEyebrow}
        lead={home.beliefLead}
        paragraphs={home.beliefBody.split(/\n\s*\n/).filter(Boolean)}
      />
      <HomeUseCases
        categories={categoryItems(content.work.filters, home.services, works)}
      />
      <HomeVideo
        posterSrc={home.video?.poster?.src || "/magic.png"}
        videoSrc={home.video?.src || ""}
        label={home.video?.label || "Play"}
      />
      <HomeTestimonials items={quotes} />
    </main>
  );
}
