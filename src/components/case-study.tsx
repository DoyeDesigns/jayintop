import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContentImage } from "@/components/content-image";
import { RichParagraphs } from "@/lib/rich-text";
import { videoView } from "@/lib/video";
import { workPath, type WorkNavLink } from "@/lib/public-work";
import type { WorkImage, WorkItem } from "@/lib/work";

const heading =
  "text-left font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[40px]";

const copy =
  "text-left font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white";

function VideoPlayer({ url, poster }: { url: string; poster?: string }) {
  const video = videoView(url);
  if (video.kind === "embed") {
    return (
      <iframe
        src={video.src}
        title="Case study video"
        className="aspect-video w-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <video
      src={video.src}
      poster={poster}
      controls
      playsInline
      className="aspect-video w-full rounded-lg bg-black"
    />
  );
}

function Frame({ image, alt }: { image: WorkImage; alt: string }) {
  return (
    <div
      className={`overflow-hidden rounded-lg bg-[#1A1A1A] ${
        image.span === "full" ? "md:col-span-2" : ""
      }`}
    >
      <ContentImage
        src={image.src}
        alt={alt}
        width={1600}
        height={900}
        sizes={
          image.span === "full"
            ? "(min-width: 768px) 1120px, 100vw"
            : "(min-width: 768px) 540px, 100vw"
        }
        className="block h-auto w-full"
      />
    </div>
  );
}

function navHref(link: WorkNavLink) {
  if (link.kind === "category") return link.href;
  return workPath(link.item, link.category);
}

function navLabel(link: WorkNavLink) {
  return link.kind === "category" ? `Go to ${link.label}` : link.item.title;
}

export function CaseStudy({
  project,
  previous,
  next,
}: {
  project: WorkItem;
  previous: WorkNavLink;
  next: WorkNavLink;
}) {
  return (
    <article className="flex flex-col gap-10">
      {project.image || project.imageMobile ? (
        <div className="relative aspect-square overflow-hidden rounded-lg md:aspect-[1380/640]">
          <ContentImage
            src={project.imageMobile || project.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover md:hidden"
          />
          <ContentImage
            src={project.image}
            alt=""
            fill
            priority
            sizes="1120px"
            className="hidden object-cover md:block"
          />
        </div>
      ) : null}

      {project.sections.map((section, index) => (
        <section key={section.title} className="flex flex-col gap-6">
          {index === 0 ? (
            <>
              <div className="flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between md:gap-10">
                <h1 className={`${heading} max-w-[720px]`}>{section.title}</h1>
                {project.liveUrl?.trim() && !project.liveHidden ? (
                  <a
                    href={
                      /^https?:\/\//i.test(project.liveUrl.trim())
                        ? project.liveUrl.trim()
                        : `https://${project.liveUrl.trim()}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-tanker text-[16px] leading-[1.2] font-normal tracking-normal text-brand uppercase underline decoration-brand underline-offset-4 transition-colors duration-200 hover:text-brand-white md:text-[20px]"
                  >
                    Live site
                  </a>
                ) : null}
              </div>
              <div className="flex flex-col items-start gap-4 text-left md:flex-row md:items-start md:justify-between md:gap-10">
                {section.body.trim() ? (
                  <RichParagraphs
                    text={section.body}
                    className={`${copy} max-w-[720px] flex flex-col gap-4`}
                  />
                ) : null}
                <dl className={`${copy} md:shrink-0 md:text-right`}>
                {project.category.trim() ? (
                <div>
                  <dt className="inline font-bold text-white">Project: </dt>
                  <dd className="inline font-normal">{project.category}</dd>
                </div>
                ) : null}
                {project.year.trim() ? (
                  <div>
                    <dt className="inline font-bold text-white">Year: </dt>
                    <dd className="inline font-normal">{project.year}</dd>
                  </div>
                ) : null}
                {project.client.trim() ? (
                <div>
                  <dt className="inline font-bold text-white">Client: </dt>
                  <dd className="inline font-normal">{project.client}</dd>
                </div>
                ) : null}
                {project.credits.some((credit) => credit.role.trim() || credit.name.trim())
                  ? project.credits.map((credit, creditIndex) => {
                      const role = credit.role.trim();
                      const name = credit.name.trim();
                      if (!role && !name) return null;
                      return (
                        <div key={`${role}-${name}-${creditIndex}`}>
                          {role ? (
                            <dt className="inline font-bold text-white">
                              {name ? `${role}: ` : role}
                            </dt>
                          ) : null}
                          {name ? <dd className="inline font-normal">{name}</dd> : null}
                        </div>
                      );
                    })
                  : project.director.trim()
                    ? (
                      <div>
                        <dt className="inline font-bold text-white">Creative Director: </dt>
                        <dd className="inline font-normal">{project.director}</dd>
                      </div>
                    )
                    : null}
              </dl>
              </div>
            </>
          ) : (
            <div className="max-w-[720px] text-left">
              {section.title.trim() ? <h2 className={heading}>{section.title}</h2> : null}
              {section.body.trim() ? (
                <RichParagraphs
                  text={section.body}
                  className={`${copy} mt-3 flex flex-col gap-4`}
                />
              ) : null}
            </div>
          )}

          {section.video ? (
            <VideoPlayer url={section.video} poster={section.poster} />
          ) : null}

          {section.images.some((image) => image.src) ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.images
                .filter((image) => image.src)
                .map((image, imageIndex) => (
                  <Frame key={imageIndex} image={image} alt="" />
                ))}
            </div>
          ) : null}
        </section>
      ))}

      <nav className="relative flex flex-col items-center gap-8 pb-12 md:flex-row md:justify-between md:gap-0 md:pb-0">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-5 bottom-0 left-1/2 z-0 w-1 -translate-x-1/2 bg-brand md:hidden"
        />
        <Link
          href={navHref(previous)}
          className="relative z-10 inline-flex h-[52px] min-h-[40px] items-center justify-center gap-[10px] rounded-tl-[1000px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[1000px] bg-brand px-6 py-3 font-tanker text-[16px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase transition-colors duration-200 hover:bg-brand/70"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          {navLabel(previous)}
        </Link>
        <Link
          href={navHref(next)}
          className="relative z-10 inline-flex h-[52px] min-h-[40px] items-center justify-center gap-[10px] rounded-tl-[12px] rounded-tr-[1000px] rounded-br-[1000px] rounded-bl-[12px] bg-brand px-6 py-3 font-tanker text-[16px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase transition-colors duration-200 hover:bg-brand/70"
        >
          {navLabel(next)}
          <ArrowRight size={16} strokeWidth={1.75} />
        </Link>
      </nav>
    </article>
  );
}
