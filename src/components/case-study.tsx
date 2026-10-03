import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContentImage } from "@/components/content-image";
import type { WorkImage, WorkItem } from "@/lib/work";

const heading =
  "text-left font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[40px]";

const copy =
  "text-left font-bespoke text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white";

function Frame({ image, alt }: { image: WorkImage; alt: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${
        image.span === "full" ? "aspect-[16/9] md:col-span-2" : "aspect-[4/3]"
      }`}
    >
      <ContentImage
        src={image.src}
        alt={alt}
        fill
        sizes={image.span === "full" ? "(min-width: 768px) 1120px, 100vw" : "(min-width: 768px) 540px, 100vw"}
        className="object-cover"
      />
    </div>
  );
}

export function CaseStudy({
  project,
  previous,
  next,
}: {
  project: WorkItem;
  previous: WorkItem;
  next: WorkItem;
}) {
  return (
    <article className="flex flex-col gap-10">
      {project.image ? (
        <div className="relative aspect-[1380/640] overflow-hidden rounded-lg">
          <ContentImage
            src={project.image}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 1120px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {project.sections.map((section, index) => (
        <section key={section.title} className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4 text-left md:flex-row md:justify-between md:gap-10">
            <div className="max-w-[720px]">
              {index === 0 ? (
                <h1 className={heading}>{section.title}</h1>
              ) : (
                <h2 className={heading}>{section.title}</h2>
              )}
              <p className={`${copy} mt-3`}>{section.body}</p>
            </div>
            {index === 0 ? (
              <dl className={`${copy} md:shrink-0 md:text-right`}>
                <div>
                  <dt className="inline font-bold text-white">Project: </dt>
                  <dd className="inline font-normal">{project.category}</dd>
                </div>
                <div>
                  <dt className="inline font-bold text-white">Client: </dt>
                  <dd className="inline font-normal">{project.client}</dd>
                </div>
                <div>
                  <dt className="inline font-bold text-white">Creative Director: </dt>
                  <dd className="inline font-normal">{project.director}</dd>
                </div>
              </dl>
            ) : null}
          </div>

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
          href={`/selected-work/${previous.id}`}
          className="relative z-10 inline-flex h-[52px] min-h-[40px] items-center justify-center gap-[10px] rounded-tl-[1000px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[1000px] border-2 border-brand bg-brand px-6 py-3 font-tanker text-[16px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          {previous.title}
        </Link>
        <Link
          href={`/selected-work/${next.id}`}
          className="relative z-10 inline-flex h-[52px] min-h-[40px] items-center justify-center gap-[10px] rounded-tl-[12px] rounded-tr-[1000px] rounded-br-[1000px] rounded-bl-[12px] border-2 border-brand bg-brand px-6 py-3 font-tanker text-[16px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase"
        >
          {next.title}
          <ArrowRight size={16} strokeWidth={1.75} />
        </Link>
      </nav>
    </article>
  );
}
