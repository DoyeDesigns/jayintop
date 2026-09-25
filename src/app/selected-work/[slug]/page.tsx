import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study";
import { getProject, selectedWork } from "@/lib/work";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return selectedWork.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = getProject(slug);

  return {
    title: match?.project.title ?? "Selected work",
    description: match
      ? `${match.project.title}, ${match.project.category}.`
      : undefined,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const match = getProject(slug);
  if (!match) notFound();

  return (
    <main className="px-8 pt-10 pb-0 md:px-10 md:py-16">
      <CaseStudy
        project={match.project}
        previous={match.previous}
        next={match.next}
      />
    </main>
  );
}
