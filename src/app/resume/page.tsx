import type { Metadata } from "next";
import { Resume } from "@/components/resume";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { resume } = await readSiteContent();
  const description = [resume.name, resume.role].filter(Boolean).join(", ");
  return {
    title: resume.title || "Resume",
    description: description || resume.title,
  };
}

export default async function ResumePage() {
  const { resume } = await readSiteContent();

  return (
    <main className="py-16 md:py-24">
      <h1 className="text-center font-tanker text-[40px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[80px]">
        {resume.title}
      </h1>
      <div className="mt-16">
        <Resume resume={resume} />
      </div>
    </main>
  );
}
