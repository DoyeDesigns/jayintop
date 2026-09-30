"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AreaField,
  EditorPage,
  GhostButton,
  ImageField,
  ItemTools,
  SelectField,
  Subsection,
  TextField,
} from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";
import {
  emptyBlock,
  type CaseStatus,
  type ContentBlock,
} from "@/lib/admin-content";

const blockTypes: ContentBlock["type"][] = ["text", "image", "pair", "video", "quote"];

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
            label="Category"
            required
            help="Shown on the right of the work list."
            value={item.category}
            onChange={(value) => set("category", value)}
          />
          <TextField
            label="Year"
            required
            value={item.year}
            onChange={(value) => set("year", value)}
          />
        </div>
        <TextField
          label="Your role"
          required
          value={item.role}
          onChange={(value) => set("role", value)}
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
          label="Cover image"
          help="Shown on the work list. Landscape works best."
          value={item.cover}
          onChange={(cover) => set("cover", cover)}
        />
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
                <TextField
                  label="Video link"
                  help="Paste a YouTube or Vimeo link. Video files are never uploaded here, they are too heavy for a website to serve."
                  value={block.url}
                  onChange={(url) => setBlock(blockIndex, { ...block, url })}
                />
                <ImageField
                  label="Cover frame"
                  help="Optional still shown before the video plays."
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
