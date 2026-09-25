import type { Metadata } from "next";
import { Resume } from "@/components/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: "Yinka Jayeola, UI/UX Designer.",
};

export default function ResumePage() {
  return (
    <main className="px-8 py-16 md:px-10 md:py-24">
      <h1 className="text-center font-tanker text-[40px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase md:text-[80px]">
        My resume
      </h1>
      <div className="mt-16">
        <Resume />
      </div>
    </main>
  );
}
