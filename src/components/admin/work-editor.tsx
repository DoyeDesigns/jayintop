"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useRef } from "react";
import { AreaField, AddButton, EditorPage, Subsection, TextField } from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";
import {
  createWorkFilter,
  moveWorkFilter,
  removeWorkFilter,
  renameWorkFilterAt,
} from "@/lib/admin-content";

const inputClass =
  "w-full rounded-[8px] border border-[#373A41] bg-transparent px-3 py-2 font-inter text-[16px] leading-[24px] font-normal text-brand-white outline-none placeholder:text-[#85888E] focus:border-brand";

export function WorkEditor() {
  const { content, setPath, mutate } = useAdminContent();
  const work = content.work;
  const filters = content.work.filters;
  const nameBeforeEdit = useRef("");

  return (
    <EditorPage>
      <Subsection title="Page heading">
        <TextField
          label="Title"
          required
          max={40}
          value={work.title}
          onChange={(value) => setPath("work.title", value)}
        />
        <AreaField
          label="Subtitle"
          required
          rows={3}
          value={work.subtitle}
          onChange={(value) => setPath("work.subtitle", value)}
        />
      </Subsection>

      <Subsection
        title="Filters"
        hint="Same list as project categories and What I do tabs (except All). Rename updates every project that uses it. Hide takes a filter off the live Work page. Save to publish."
      >
        <div className="flex flex-col gap-3">
          {filters.map((item, index) => (
            <div key={`work-filter-${index}`} className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                type="text"
                value={item.label}
                onFocus={() => {
                  nameBeforeEdit.current = item.label;
                }}
                onChange={(event) => {
                  const next = event.target.value;
                  mutate((draft) => {
                    renameWorkFilterAt(draft, index, next, nameBeforeEdit.current);
                  });
                }}
                className={`${inputClass} h-10 min-w-0 md:flex-1`}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Move up"
                  disabled={index === 0 || Boolean(item.all) || Boolean(filters[index - 1]?.all)}
                  onClick={() => mutate((draft) => { moveWorkFilter(draft, index, -1); })}
                  className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronUp className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  disabled={
                    index === filters.length - 1 ||
                    Boolean(item.all) ||
                    Boolean(filters[index + 1]?.all)
                  }
                  onClick={() => mutate((draft) => { moveWorkFilter(draft, index, 1); })}
                  className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronDown className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Remove"
                  disabled={Boolean(item.all)}
                  onClick={() => mutate((draft) => { removeWorkFilter(draft, index); })}
                  className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white hover:border-[#E2705F] hover:text-[#E2705F] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <X className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    mutate((draft) => {
                      const current = draft.work.filters[index];
                      if (!current) return;
                      current.hidden = !current.hidden;
                    })
                  }
                  className="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] px-3 font-tanker text-[15px] leading-[1.2] font-normal tracking-normal text-brand-white hover:border-brand hover:text-brand"
                >
                  {item.hidden ? "Show" : "Hide"}
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() => {
              mutate((draft) => {
                createWorkFilter(draft, "New filter");
              });
            }}
          >
            Add filter
          </AddButton>
        </div>
      </Subsection>
    </EditorPage>
  );
}
