import type { Metadata } from "next";
import { SelectedWork } from "@/components/selected-work";
import { selectedWork } from "@/lib/work";

export const metadata: Metadata = {
  title: "Selected work",
  description:
    "A few projects taken from the first sketch through to a finished system.",
};

export default function SelectedWorkPage() {
  return (
    <main className="pb-16 md:pb-24">
      <div className="px-8 pt-16 md:px-10 md:pt-24">
        <h1 className="text-left font-tanker text-[40px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-center md:text-[80px]">
          Selected work
        </h1>
        <p className="mt-4 max-w-[720px] text-left font-bespoke md:text-[24px] text-[16px] leading-[1.5] font-normal tracking-normal text-brand-white md:mx-auto md:text-center">
          A few projects taken from the first sketch through to a finished
          system. Open one to see how it was built.
        </p>
      </div>
      <SelectedWork items={selectedWork} />
    </main>
  );
}
