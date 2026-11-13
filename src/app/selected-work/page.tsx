import type { Metadata } from "next";
import { SelectedWork } from "@/components/selected-work";
import { visibleFilterLabels } from "@/lib/admin-content";
import { publishedWork } from "@/lib/public-work";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { work } = await readSiteContent();
  return {
    title: work.title,
    description: work.subtitle,
  };
}

export default async function SelectedWorkPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string | string[] }>;
}) {
  const content = await readSiteContent();
  const raw = (await searchParams).cat;
  const initialFilter = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  return (
    <main className="pb-16 md:pb-24">
      <div className="pt-16 md:pt-24 hidden">
        <h1 className="text-left font-tanker text-[40px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-center md:text-[80px]">
          {content.work.title}
        </h1>
        <p className="mt-4 max-w-[720px] text-left font-bespoke md:text-[24px] text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white md:mx-auto md:text-center">
          {content.work.subtitle}
        </p>
      </div>
      <SelectedWork
        key={initialFilter || "all"}
        items={publishedWork(content)}
        filters={visibleFilterLabels(content.work.filters)}
        initialFilter={initialFilter}
      />
    </main>
  );
}
