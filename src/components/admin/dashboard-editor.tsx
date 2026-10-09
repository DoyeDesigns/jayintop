"use client";

import { useEffect, useState } from "react";
import { backendStatus } from "@/app/admin/content-actions";
import { EditorPage } from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";

const firestoreCopy = {
  ready: "Connected",
  missing: "Not created in the Firebase console",
  denied: "Created, but the security rules are blocking it",
} as const;

const cloudinaryCopy = {
  ready: "Connected",
  missing: "Add the Cloudinary keys to .env.local",
  denied: "The Cloudinary keys were rejected",
} as const;

export function DashboardEditor() {
  const { content } = useAdminContent();
  const [backend, setBackend] = useState<{
    firestore: keyof typeof firestoreCopy;
    cloudinary: keyof typeof cloudinaryCopy;
  } | null>(null);

  useEffect(() => {
    backendStatus().then(setBackend);
  }, []);
  const live = content.cases.filter((item) => item.status === "published").length;
  const missingCovers = content.cases.filter((item) => !item.cover).length;
  const emptySocials = content.site.socials.filter((link) => !link.hidden && !link.url).length;

  const stats = [
    { label: "Live Case Studies", value: live, highlight: true },
    { label: "Testimonials", value: content.testimonials.length },
    { label: "Editable Pages", value: 5 },
  ];

  const notes = [
    missingCovers
      ? `${missingCovers} case ${missingCovers > 1 ? "studies have" : "study has"} no cover image uploaded.`
      : "",
    content.site.email
      ? ""
      : "No contact email saved in Settings, so the contact button has nowhere to send people.",
    emptySocials
      ? "Some social links are empty and will render as dead icons in the footer."
      : "",
    "Add one new case study per month to keep the work page moving.",
  ].filter(Boolean);

  return (
    <EditorPage>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-[12px] border bg-[#1A1A1A] px-5 py-4 ${
              stat.highlight ? "border-[#E8B23D]" : "border-[#373A41]"
            }`}
          >
            <p className="font-inter text-[14px] leading-[20px] font-medium text-[#94979C]">
              {stat.label}
            </p>
            <p className="mt-3 font-inter text-[40px] leading-none font-semibold text-brand">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {backend ? (
        <section>
          <h2 className="font-tanker text-[20px] leading-[1.2] font-semibold tracking-normal text-brand-white uppercase">
            Connections
          </h2>
          <div className="mt-3 h-px bg-[#22262F]" />
          <ul>
            <li className="flex items-center justify-between gap-4 border-b border-[#22262F] py-5">
              <span className="font-inter text-[16px] leading-[24px] text-brand-white">Firestore</span>
              <span className="font-inter text-[16px] leading-[24px] text-[#94979C]">{firestoreCopy[backend.firestore]}</span>
            </li>
            <li className="flex items-center justify-between gap-4 border-b border-[#22262F] py-5">
              <span className="font-inter text-[16px] leading-[24px] text-brand-white">Cloudinary</span>
              <span className="font-inter text-[16px] leading-[24px] text-[#94979C]">{cloudinaryCopy[backend.cloudinary]}</span>
            </li>
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="font-tanker text-[20px] leading-[1.2] font-semibold tracking-normal text-brand-white uppercase">
          What needed attention
        </h2>
        <div className="mt-3 h-px bg-[#22262F]" />
        <ul>
          {notes.map((note) => (
            <li
              key={note}
              className="flex items-center gap-4 border-b border-[#22262F] py-5"
            >
              <span aria-hidden className="size-5 shrink-0 rounded-full bg-[#D5D7DA]" />
              <span className="font-inter text-[16px] leading-[24px] font-normal text-brand-white">
                {note}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </EditorPage>
  );
}
