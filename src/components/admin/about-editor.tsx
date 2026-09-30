"use client";

import {
  AddButton,
  AreaField,
  EditorPage,
  ImageField,
  ItemTools,
  StringList,
  Subsection,
  TextField,
} from "@/components/admin/fields";
import { useAdminContent, useList } from "@/components/admin/content-provider";
import type { AboutSection, Receipt } from "@/lib/admin-content";

export function AboutEditor() {
  const { content, setPath } = useAdminContent();
  const about = content.about;
  const sections = useList<AboutSection>("about.sections");
  const receipts = useList<Receipt>("about.receipts");

  return (
    <EditorPage>
      <Subsection title="Top of page">
        <TextField
          label="Small label"
          required
          max={24}
          value={about.eyebrow}
          onChange={(value) => setPath("about.eyebrow", value)}
        />
        <TextField
          label="Headline"
          required
          max={90}
          value={about.headline}
          onChange={(value) => setPath("about.headline", value)}
        />
        <TextField
          label="Words to underline"
          required
          help="Must appear in the headline exactly."
          value={about.highlight}
          onChange={(value) => setPath("about.highlight", value)}
        />
        <AreaField
          label="Sub line"
          required
          rows={2}
          value={about.sub}
          onChange={(value) => setPath("about.sub", value)}
        />
      </Subsection>

      <Subsection title="Main sections" hint="The three alternating blocks.">
        {sections.items.map((section, index) => (
          <div key={`section-${index}`} className="flex flex-col gap-4 border-b border-[#22262F] pb-6">
            <ItemTools
              title={`Section ${index + 1}`}
              index={index}
              total={sections.items.length}
              onMove={(direction) => sections.move(index, direction)}
              onRemove={() => sections.remove(index)}
            />
            <TextField
              label="Heading"
              required
              value={section.title}
              onChange={(value) => sections.set(index, { ...section, title: value })}
            />
            <AreaField
              label="Body copy"
              required
              rows={3}
              value={section.body}
              onChange={(value) => sections.set(index, { ...section, body: value })}
            />
            <ImageField
              label="Image"
              value={section.media}
              onChange={(media) => sections.set(index, { ...section, media })}
            />
          </div>
        ))}
        <AddButton
          onClick={() => sections.add({ title: "New section", body: "", media: null })}
        >
          Add section
        </AddButton>
      </Subsection>

      <Subsection
        title="Things worth knowing"
        hint="Short personal lines. Five is a good number."
      >
        <StringList path="about.bits" addLabel="Add line" />
      </Subsection>

      <Subsection
        title="Numbers"
        hint="Keep these true. They are the fastest proof on the site."
      >
        {receipts.items.map((receipt, index) => (
          <div key={`receipt-${index}`} className="flex flex-col gap-4 border-b border-[#22262F] pb-6">
            <ItemTools
              title={`Number ${index + 1}`}
              index={index}
              total={receipts.items.length}
              onMove={(direction) => receipts.move(index, direction)}
              onRemove={() => receipts.remove(index)}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <TextField
                label="Figure"
                required
                value={receipt.value}
                onChange={(value) => receipts.set(index, { ...receipt, value })}
              />
              <TextField
                label="Label"
                required
                value={receipt.label}
                onChange={(value) => receipts.set(index, { ...receipt, label: value })}
              />
            </div>
          </div>
        ))}
        <AddButton onClick={() => receipts.add({ value: "", label: "" })}>
          Add number
        </AddButton>
      </Subsection>

      <Subsection title="Closing">
        <TextField
          label="Closing line"
          required
          max={70}
          value={about.closeLine}
          onChange={(value) => setPath("about.closeLine", value)}
        />
        <TextField
          label="Button label"
          required
          max={24}
          value={about.closeCta}
          onChange={(value) => setPath("about.closeCta", value)}
        />
      </Subsection>
    </EditorPage>
  );
}
