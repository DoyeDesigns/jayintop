import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { visibleFilterLabels } from "@/lib/admin-content";
import { projectNeighbors, publishedWork, workCategoryLabels, workPath } from "@/lib/public-work";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cat?: string | string[] }>;
};

function catParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = catParam((await searchParams).cat);
  const content = await readSiteContent();
  const match = projectNeighbors(
    publishedWork(content),
    slug,
    workCategoryLabels(visibleFilterLabels(content.work.filters)),
    cat,
  );

  return {
    title: match?.project.title ?? "Selected work",
    description: match
      ? `${match.project.title}, ${match.project.category}.`
      : undefined,
  };
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { slug } = await params;
  const cat = catParam((await searchParams).cat);
  const content = await readSiteContent();
  const match = projectNeighbors(
    publishedWork(content),
    slug,
    workCategoryLabels(visibleFilterLabels(content.work.filters)),
    cat,
  );
  if (!match) notFound();
  if (match.project.slug && match.project.slug !== slug) {
    redirect(workPath(match.project, cat));
  }

  return (
    <main className="pt-10 pb-0 md:py-16">
      <CaseStudy
        project={match.project}
        previous={match.previous}
        next={match.next}
      />
    </main>
  );
}
