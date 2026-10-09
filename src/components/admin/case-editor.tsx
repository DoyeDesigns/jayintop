"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AreaField,
  CategoryChecks,
  EditorPage,
  GhostButton,
  ImageField,
  ItemTools,
  VideoField,
  SelectField,
  Subsection,
  TextField,
} from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";
import {
  emptyBlock,
  syncServicesToFilters,
  type CaseStatus,
  type ContentBlock,
  type WorkFilterItem,
} from "@/lib/admin-content";
import { isVideoLink } from "@/lib/video";

const blockTypes: ContentBlock["type"][] = ["text", "image", "pair", "video", "quote"];

function categoryChoices(filters: WorkFilterItem[], selected: string[]) {
  const options = filters
    .filter((item) => !item.all)
    .map((item) => item.label.trim())
    .filter(Boolean);
  const extras = selected.filter(
    (value) => !options.some((option) => option.toLowerCase() === value.toLowerCase()),
  );
  return [...options, ...extras];
}

export function CaseEditor({ id }: { id: string }) {
  const router = useRouter();
  const { content, mutate } = useAdminContent();
  const index = content.cases.findIndex((item) => item.id === id);
  const item = content.cases[index];

  if (!item) {
    return (
      <EditorPage>
        <p className="font-inter text-[16px] text-brand-white">
          This case study is not here.{" "}
          <Link href="/admin/case-studies" className="text-brand">
            Back to all case studies
          </Link>
        </p>
      </EditorPage>
    );
  }

  const path = `cases.${index}`;

  const addCategory = (name: string) => {
    const all = content.work.filters.find((entry) => entry.all)?.label.trim().toLowerCase();
    if (all && name.toLowerCase() === all) {
      window.alert("All already shows every project. Use a specific category.");
      return;
    }
    mutate((draft) => {
      const filters = draft.work.filters;
      const existing = filters.find((entry) => entry.label.trim().toLowerCase() === name.toLowerCase());
      const label = existing?.label.trim() || name;
      if (!existing) {
        if (!filters.some((entry) => entry.all)) {
          filters.unshift({ label: "All", hidden: false, all: true });
        }
        filters.push({ label: name, hidden: false });
        draft.home.services = syncServicesToFilters(draft.home.services, filters);
      }
      const current = draft.cases.find((entry) => entry.id === id);
      if (!current) return;
      if (!current.categories.some((entry) => entry.toLowerCase() === label.toLowerCase())) {
        current.categories.push(label);
      }
    });
  };

  const set = <K extends keyof typeof item>(key: K, value: (typeof item)[K]) => {
    mutate((draft) => {
      const current = draft.cases.find((entry) => entry.id === id);
      if (!current) return;
      current[key] = value;
    });
  };

  const setBlock = (blockIndex: number, block: ContentBlock) => {
    mutate((draft) => {
      const current = draft.cases.find((entry) => entry.id === id);
      if (!current) return;
      current.blocks[blockIndex] = block;
    });
  };

  const moveBlock = (blockIndex: number, direction: -1 | 1) => {
    mutate((draft) => {
      const current = draft.cases.find((entry) => entry.id === id);
      if (!current) return;
      const next = blockIndex + direction;
      if (next < 0 || next >= current.blocks.length) return;
      const [block] = current.blocks.splice(blockIndex, 1);
      current.blocks.splice(next, 0, block);
    });
  };

  const removeBlock = (blockIndex: number) => {
    mutate((draft) => {
      const current = draft.cases.find((entry) => entry.id === id);
      if (!current) return;
      current.blocks.splice(blockIndex, 1);
    });
  };

  const removeCase = () => {
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
    router.push("/admin/case-studies");
  };

  return (
    <EditorPage>
      <Link
        href="/admin/case-studies"
        className="font-tanker text-[16px] leading-[1.2] tracking-normal text-brand-white uppercase hover:text-brand"
      >
        ← All case studies
      </Link>

      <Subsection title="Project details">
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            label="Project name"
            required
            max={40}
            value={item.title}
            onChange={(value) => set("title", value)}
          />
          <TextField
            label="Client"
            required
            value={item.client}
            onChange={(value) => set("client", value)}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            label="Year"
            required
            value={item.year}
            onChange={(value) => set("year", value)}
          />
          <TextField
            label="Your role"
            required
            value={item.role}
            onChange={(value) => set("role", value)}
          />
        </div>
        <CategoryChecks
          options={categoryChoices(content.work.filters, item.categories)}
          selected={item.categories}
          onChange={(categories) => set("categories", categories)}
          onAdd={(name) => addCategory(name)}
        />
        <AreaField
          label="Short summary"
          required
          rows={3}
          help="One or two sentences, used on the work list and in link previews."
          value={item.summary}
          onChange={(value) => set("summary", value)}
        />
        <ImageField
          label="Desktop cover"
          help="Shown on the work list on desktop. Landscape works best. This is also the default image for the homepage marquee."
          value={item.cover}
          onChange={(cover) => set("cover", cover)}
        />
        <ImageField
          label="Mobile cover"
          help="Shown on the work list on mobile. A square image works best."
          value={item.coverMobile}
          onChange={(coverMobile) => set("coverMobile", coverMobile)}
        />
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={item.showOnHome}
            onChange={(event) => set("showOnHome", event.target.checked)}
            className="size-5 accent-[#f26a22]"
          />
          <span className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
            Show on the homepage marquee
          </span>
        </label>
        <SelectField
          label="Homepage marquee image"
          value={item.marqueeSource}
          onChange={(value) => set("marqueeSource", value as typeof item.marqueeSource)}
          options={[
            { value: "desktop", label: "Desktop cover" },
            { value: "mobile", label: "Mobile cover" },
            { value: "custom", label: "Specific image" },
          ]}
        />
        {item.marqueeSource === "custom" ? (
          <ImageField
            label="Marquee image"
            help="Used only in the homepage 3D marquee."
            value={item.marqueeCover}
            onChange={(marqueeCover) => set("marqueeCover", marqueeCover)}
          />
        ) : null}
        <SelectField
          label="Status"
          required
          value={item.status}
          onChange={(value) => set("status", value as CaseStatus)}
          options={[
            { value: "published", label: "Published" },
            { value: "hidden", label: "Hidden" },
            { value: "draft", label: "Draft" },
          ]}
        />
      </Subsection>

      <Subsection title="Page content" hint="Blocks stack down the page in this order.">
        {item.blocks.length === 0 ? (
          <p className="font-inter text-[14px] leading-[20px] text-[#94979C]">
            No content blocks yet. Add one below.
          </p>
        ) : null}
        {item.blocks.map((block, blockIndex) => (
          <div key={`${path}-block-${blockIndex}`} className="flex flex-col gap-4 border-b border-[#22262F] pb-6">
            <ItemTools
              title={`${block.type} block`}
              index={blockIndex}
              total={item.blocks.length}
              onMove={(direction) => moveBlock(blockIndex, direction)}
              onRemove={() => removeBlock(blockIndex)}
            />
            {block.type === "text" ? (
              <>
                <TextField
                  label="Heading"
                  required
                  value={block.heading}
                  onChange={(heading) => setBlock(blockIndex, { ...block, heading })}
                />
                <AreaField
                  label="Body"
                  required
                  value={block.body}
                  onChange={(body) => setBlock(blockIndex, { ...block, body })}
                />
              </>
            ) : null}
            {block.type === "image" ? (
              <>
                <ImageField
                  label="Image"
                  value={block.image}
                  onChange={(image) => setBlock(blockIndex, { ...block, image })}
                />
                <TextField
                  label="Caption"
                  value={block.caption}
                  onChange={(caption) => setBlock(blockIndex, { ...block, caption })}
                />
              </>
            ) : null}
            {block.type === "pair" ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  <ImageField
                    label="Left image"
                    value={block.urlA}
                    onChange={(urlA) => setBlock(blockIndex, { ...block, urlA })}
                  />
                  <ImageField
                    label="Right image"
                    value={block.urlB}
                    onChange={(urlB) => setBlock(blockIndex, { ...block, urlB })}
                  />
                </div>
                <TextField
                  label="Caption"
                  value={block.caption}
                  onChange={(caption) => setBlock(blockIndex, { ...block, caption })}
                />
              </>
            ) : null}
            {block.type === "video" ? (
              <>
                <VideoField
                  label="Video"
                  value={block.url}
                  onChange={(url) => setBlock(blockIndex, { ...block, url })}
                />
                <TextField
                  label="Or paste a link"
                  help="YouTube, Vimeo, or Google Drive. Leave this blank when you upload a file."
                  value={isVideoLink(block.url) ? block.url : ""}
                  onChange={(url) => setBlock(blockIndex, { ...block, url })}
                />
                <ImageField
                  label="Cover frame"
                  help="Optional still shown before the video plays. 9 MB maximum."
                  value={block.urlA}
                  onChange={(urlA) => setBlock(blockIndex, { ...block, urlA })}
                />
                <TextField
                  label="Caption"
                  value={block.caption}
                  onChange={(caption) => setBlock(blockIndex, { ...block, caption })}
                />
              </>
            ) : null}
            {block.type === "quote" ? (
              <>
                <AreaField
                  label="Quote"
                  required
                  rows={3}
                  value={block.body}
                  onChange={(body) => setBlock(blockIndex, { ...block, body })}
                />
                <TextField
                  label="Who said it"
                  required
                  value={block.heading}
                  onChange={(heading) => setBlock(blockIndex, { ...block, heading })}
                />
              </>
            ) : null}
          </div>
        ))}
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap">
          {blockTypes.map((type) => (
            <GhostButton
              key={type}
              onClick={() =>
                mutate((draft) => {
                  const current = draft.cases.find((entry) => entry.id === id);
                  if (!current) return;
                  current.blocks.push(emptyBlock(type));
                })
              }
            >
              + {type}
            </GhostButton>
          ))}
        </div>
      </Subsection>

      <GhostButton danger onClick={removeCase}>
        Delete this case study
      </GhostButton>
    </EditorPage>
  );
}
