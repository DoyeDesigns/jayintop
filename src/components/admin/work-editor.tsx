"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { AreaField, AddButton, EditorPage, Subsection, TextField } from "@/components/admin/fields";
import { useAdminContent, useList } from "@/components/admin/content-provider";

const inputClass =
  "w-full rounded-[8px] border border-[#373A41] bg-transparent px-3 py-2 font-inter text-[16px] leading-[24px] font-normal text-brand-white outline-none placeholder:text-[#85888E] focus:border-brand";

export function WorkEditor() {
  const { content, setPath } = useAdminContent();
  const work = content.work;
  const filters = useList<{ label: string; hidden: boolean }>("work.filters");

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
        hint="The buttons above the project list, and the category checkboxes on each project. The first one shows everything. Hide takes a filter off the live page. Save to publish the change."
      >
        <div className="flex flex-col gap-3">
          {filters.items.map((item, index) => (
            <div key={`work-filter-${index}`} className="flex flex-col gap-2 md:flex-row md:items-center">
              <input
                type="text"
                value={item.label}
                onChange={(event) => filters.set(index, { ...item, label: event.target.value })}
                className={`${inputClass} h-10 min-w-0 md:flex-1`}
              />
              <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => filters.move(index, -1)}
                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronUp className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={index === filters.items.length - 1}
                onClick={() => filters.move(index, 1)}
                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronDown className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => filters.remove(index)}
                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] text-brand-white hover:border-[#E2705F] hover:text-[#E2705F]"
              >
                <X className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                disabled={index === 0}
                onClick={() => filters.set(index, { ...item, hidden: !item.hidden })}
                className="inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] px-3 font-tanker text-[15px] leading-[1.2] font-normal tracking-normal text-brand-white hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
              >
                {item.hidden ? "Show" : "Hide"}
              </button>
              </div>
            </div>
          ))}
          <AddButton onClick={() => filters.add({ label: "", hidden: false })}>Add filter</AddButton>
        </div>
      </Subsection>
    </EditorPage>
  );
}
