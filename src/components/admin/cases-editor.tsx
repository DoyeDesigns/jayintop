"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AddButton,
  EditorPage,
  GhostButton,
  Subsection,
} from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";
import {
  caseMatchesFilter,
  createId,
  type CaseItem,
  type CaseStatus,
} from "@/lib/admin-content";

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
    title: "",
    client: "",
    role: "",
    credits: [],
    categories: [],
    year: "",
    liveUrl: "",
    liveHidden: false,
    status: "draft",
    cover: null,
    coverMobile: null,
    showOnHome: true,
    marqueeSource: "desktop",
    marqueeCover: null,
    summary: "",
    blocks: [],
  };
}

export function CasesEditor() {
  const router = useRouter();
  const { content, mutate } = useAdminContent();
  const filters = content.work.filters.filter((item) => item.label.trim());
  const [filter, setFilter] = useState(
    () => filters.find((item) => item.all)?.label ?? "All",
  );
  const active = filters.find((item) => item.label === filter) ??
    filters.find((item) => item.all) ?? { label: "All", all: true, hidden: false };

  const listed = useMemo(
    () =>
      content.cases.filter(
        (item) => Boolean(active.all) || caseMatchesFilter(item, active.label),
      ),
    [content.cases, active.all, active.label],
  );

  const add = () => {
    const item = blankCase();
    mutate((draft) => {
      draft.cases.unshift(item);
    });
    router.push(`/admin/case-studies/${item.id}`);
  };

  const move = (id: string, direction: -1 | 1) => {
    mutate((draft) => {
      const ids = draft.cases
        .filter((item) => Boolean(active.all) || caseMatchesFilter(item, active.label))
        .map((item) => item.id);
      const position = ids.indexOf(id);
      const swapId = ids[position + direction];
      if (position < 0 || !swapId) return;
      const from = draft.cases.findIndex((item) => item.id === id);
      const to = draft.cases.findIndex((item) => item.id === swapId);
      if (from < 0 || to < 0) return;
      const [item] = draft.cases.splice(from, 1);
      draft.cases.splice(to, 0, item);
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
        {filters.length ? (
          <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const selected = active.label === item.label;
              return (
                <button
                  key={item.all ? "all" : item.label}
                  type="button"
                  onClick={() => setFilter(item.label)}
                  className={`inline-flex h-8 cursor-pointer items-center rounded-[6px] border px-3 font-tanker text-[15px] leading-[1.2] font-normal tracking-normal uppercase ${
                    selected
                      ? "border-brand text-brand"
                      : "border-[#373A41] text-brand-white hover:border-brand hover:text-brand"
                  }`}
                >
                  {item.label}
                  {item.hidden && !item.all ? " · hidden" : ""}
                </button>
              );
            })}
          </nav>
        ) : null}
        {content.cases.length === 0 ? (
          <p className="font-inter text-[14px] leading-[20px] text-[#94979C]">
            No case studies yet.
          </p>
        ) : listed.length === 0 ? (
          <p className="font-inter text-[14px] leading-[20px] text-[#94979C]">
            No case studies in {active.label}.
          </p>
        ) : (
          <ul className="flex flex-col">
            {listed.map((item, index) => (
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
                    {item.categories.length ? ` · ${item.categories.join(", ")}` : ""}
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
                    onClick={() => move(item.id, -1)}
                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white disabled:opacity-30"
                  >
                    <ChevronUp className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    disabled={index === listed.length - 1}
                    onClick={() => move(item.id, 1)}
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
