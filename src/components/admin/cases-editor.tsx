"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AddButton,
  EditorPage,
  GhostButton,
  Subsection,
} from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";
import { createId, type CaseItem, type CaseStatus } from "@/lib/admin-content";

const statusLabel: Record<CaseStatus, string> = {
  published: "Live",
  hidden: "Hidden",
  draft: "Draft",
};

const statusClass: Record<CaseStatus, string> = {
  published: "text-[#3DDC84]",
  hidden: "text-[#94979C]",
  draft: "text-[#E8B23D]",
};

function blankCase(): CaseItem {
  return {
    id: createId(),
    title: "Untitled project",
    client: "",
    role: "",
    category: "",
    year: String(new Date().getFullYear()),
    status: "draft",
    cover: null,
    summary: "",
    blocks: [],
  };
}

export function CasesEditor() {
  const router = useRouter();
  const { content, mutate } = useAdminContent();

  const add = () => {
    const item = blankCase();
    mutate((draft) => {
      draft.cases.unshift(item);
    });
    router.push(`/admin/case-studies/${item.id}`);
  };

  const move = (index: number, direction: -1 | 1) => {
    mutate((draft) => {
      const next = index + direction;
      if (next < 0 || next >= draft.cases.length) return;
      const [item] = draft.cases.splice(index, 1);
      draft.cases.splice(next, 0, item);
    });
  };

  const toggle = (id: string) => {
    mutate((draft) => {
      const item = draft.cases.find((entry) => entry.id === id);
      if (!item) return;
      item.status = item.status === "published" ? "hidden" : "published";
    });
  };

  const copy = (id: string) => {
    mutate((draft) => {
      const index = draft.cases.findIndex((entry) => entry.id === id);
      if (index < 0) return;
      const item = structuredClone(draft.cases[index]);
      item.id = createId();
      item.title = `${item.title} (copy)`;
      item.status = "draft";
      draft.cases.splice(index + 1, 0, item);
    });
  };

  const remove = (id: string) => {
    const item = content.cases.find((entry) => entry.id === id);
    if (!item) return;
    if (
      !window.confirm(
        `Delete "${item.title}" permanently?\n\nThis cannot be undone. If you only want it off the public site, use Hide instead.`,
      )
    ) {
      return;
    }
    mutate((draft) => {
      draft.cases = draft.cases.filter((entry) => entry.id !== id);
    });
  };

  return (
    <EditorPage>
      <Subsection
        title="Case studies"
        hint="Hiding is not deleting. A hidden case study stays here in full and disappears from the public work page. Use hide for client work still under wraps, and delete only when you never want it back."
      >
        {content.cases.length === 0 ? (
          <p className="font-inter text-[14px] leading-[20px] text-[#94979C]">
            No case studies yet.
          </p>
        ) : (
          <ul className="flex flex-col">
            {content.cases.map((item, index) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 border-b border-[#22262F] py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
                    {item.title}
                  </p>
                  <p className="mt-1 font-inter text-[14px] leading-[20px] text-[#94979C]">
                    {item.client || "No client set"}
                    {item.category ? ` · ${item.category}` : ""}
                    {item.year ? ` · ${item.year}` : ""}
                    {" · "}
                    <span className={statusClass[item.status]}>{statusLabel[item.status]}</span>
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center">
                  <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white disabled:opacity-30"
                  >
                    <ChevronUp className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={index === content.cases.length - 1}
                    onClick={() => move(index, 1)}
                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white disabled:opacity-30"
                  >
                    <ChevronDown className="size-4" aria-hidden />
                  </button>
                  </div>
                  <GhostButton onClick={() => router.push(`/admin/case-studies/${item.id}`)}>
                    Edit
                  </GhostButton>
                  <GhostButton onClick={() => toggle(item.id)}>
                    {item.status === "published" ? "Hide" : "Publish"}
                  </GhostButton>
                  <GhostButton onClick={() => copy(item.id)}>Copy</GhostButton>
                  <GhostButton danger onClick={() => remove(item.id)}>
                    Delete
                  </GhostButton>
                </div>
              </li>
            ))}
          </ul>
        )}
        <AddButton onClick={add}>Add case study</AddButton>
      </Subsection>
    </EditorPage>
  );
}
