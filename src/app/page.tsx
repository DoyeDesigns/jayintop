import Link from "next/link";
import { ContentImage } from "@/components/content-image";
import { HomeBelief } from "@/components/home-belief";
import { HomeSelectedWorks } from "@/components/home-selected-works";
import { HomeTestimonials } from "@/components/home-testimonials";
import { HomeUseCases, type HomeCategory, type HomeUseCase } from "@/components/home-use-cases";
import { HomeVideo } from "@/components/home-video";
import type { HomeCorner, Service, WorkFilterItem } from "@/lib/admin-content";
import { RichText } from "@/lib/rich-text";
import { homeMarqueeWork, matchesWorkFilter, publishedWork, workPath } from "@/lib/public-work";
import type { WorkItem } from "@/lib/work";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

const sideCopy =
  "font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white";

const workLinkClass =
  "inline-flex h-[52px] items-center justify-center rounded-tl-[12px] rounded-tr-[1000px] rounded-br-[1000px] rounded-bl-[12px] bg-brand px-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase transition-colors duration-200 hover:bg-brand/70";

function useCaseFromWork(work: WorkItem, corner?: HomeCorner): HomeUseCase {
  return {
    title: corner?.title.trim() || work.title,
    href: work ? workPath(work) : corner?.href.trim() || "#",
    imageSrc: corner?.image?.src || work.image || work.imageMobile || "",
    videoSrc: work.sections.find((section) => section.video)?.video,
    brand:
      corner?.brand.trim() ||
      work.client.trim() ||
      work.director.trim() ||
      "",
    tag:
      corner?.tag.trim() ||
      work.categories.find((category) => category.trim()) ||
      "",
  };
}

function cornerItems(
  corners: HomeCorner[],
  categoryWorks: WorkItem[],
  allWorks: WorkItem[],
): HomeUseCase[] {
  const picked = new Set(
    corners.map((corner) => corner.projectId.trim()).filter(Boolean),
  );
  const leftover = categoryWorks.filter((work) => !picked.has(work.id));

  return corners.slice(0, 4).map((corner) => {
    if (corner.projectId.trim()) {
      const work = allWorks.find((item) => item.id === corner.projectId);
      if (work) return useCaseFromWork(work, corner);
      return {
        title: corner.title.trim(),
        href: corner.href.trim() || "#",
        imageSrc: corner.image?.src || "",
        brand: corner.brand.trim(),
        tag: corner.tag.trim(),
      };
    }

    const work = leftover.shift();
    if (work) return useCaseFromWork(work, corner);

    return {
      title: corner.title.trim(),
      href: corner.href.trim() || "#",
      imageSrc: corner.image?.src || "",
      brand: corner.brand.trim(),
      tag: corner.tag.trim(),
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
    .map((filter) => {
      const key = filter.label.trim().toLowerCase();
      const service = services.find(
        (item) => item.title.trim().toLowerCase() === key,
      );
      const inCategory = works.filter((work) =>
        matchesWorkFilter(work, filter.label, false),
      );
      return {
        title: filter.label,
        body: service?.copy ?? "",
        imageSrc: service?.image?.src || "",
        tags: [],
        corners: cornerItems(service?.corners ?? [], inCategory, works),
      };
    });
}

function Portrait({ src, priority = false }: { src?: string; priority?: boolean }) {
  return (
    <div className="relative aspect-square w-[280px] shrink-0 overflow-hidden rounded-full md:w-[340px]">
      <ContentImage
        src={src ?? ""}
        alt=""
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
  const portraitSrc = home.heroImage?.src ?? "";
  const beliefImageSrc = home.beliefImage?.src ?? "";
  const quotes = testimonials
    .filter((item) => item.quote.trim())
    .map(({ quote, name, role }) => ({ quote, name, role }));

  return (
    <main className="pt-16 pb-0 md:pt-24 md:pb-0">
      <div className="flex flex-col items-center md:hidden mb-10">
        <Portrait src={portraitSrc} priority />
        <div className="mt-8 flex w-full flex-col items-start text-left">
          {home.heroName.trim() ? (
            <p className="font-bespoke text-[28px] leading-[1.2] font-normal tracking-normal text-brand-white">
              {home.heroName}
            </p>
          ) : null}
          {home.heroHeadline.trim() ? (
            <h1 className="mt-2 font-tanker text-[48px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
              <RichText text={home.heroHeadline} highlight={home.heroHighlight} />
            </h1>
          ) : null}
          {home.heroLeft.trim() ? <p className={`${sideCopy} mt-4`}>{home.heroLeft}</p> : null}
          {home.heroRight.trim() ? <p className={`${sideCopy} mt-4`}>{home.heroRight}</p> : null}
          {home.heroCta.trim() ? (
            <Link href="/selected-work" className={`${workLinkClass} mt-6`}>
              {home.heroCta}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="hidden md:h-[890px] md:block">
        {home.heroName.trim() ? (
          <p className="text-center font-bespoke text-[48px] leading-[79.27px] font-normal tracking-normal text-brand-white">
            {home.heroName}
          </p>
        ) : null}
        {home.heroHeadline.trim() ? (
          <h1 className="mx-auto mt-2 max-w-[776px] text-center font-tanker text-[80px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
            <RichText text={home.heroHeadline} highlight={home.heroHighlight} />
          </h1>
        ) : null}
        <div className="mt-24 flex items-start justify-center gap-12">
          {home.heroLeft.trim() ? <p className={`${sideCopy} w-[280px] pt-16`}>{home.heroLeft}</p> : <div className="w-[280px]" />}
          <Portrait src={portraitSrc} />
          <div className="flex w-[280px] flex-col items-start gap-6 pt-16">
            {home.heroRight.trim() ? <p className={sideCopy}>{home.heroRight}</p> : null}
            {home.heroCta.trim() ? (
              <Link href="/selected-work" className={workLinkClass}>
                {home.heroCta}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
      <HomeSelectedWorks items={homeMarqueeWork(content)} />
      <HomeBelief
        eyebrow={home.beliefEyebrow}
        lead={home.beliefLead}
        paragraphs={home.beliefBody.split(/\n\s*\n/).filter(Boolean)}
        imageSrc={portraitSrc}
      />
      <HomeUseCases
        categories={categoryItems(content.work.filters, home.services, works)}
      />
      {home.video?.hidden ? null : (
        <HomeVideo
          posterSrc={home.video?.poster?.src || ""}
          videoSrc={home.video?.src || ""}
          label={home.video?.label || "Play"}
        />
      )}
      <HomeTestimonials items={quotes} />
    </main>
  );
}
