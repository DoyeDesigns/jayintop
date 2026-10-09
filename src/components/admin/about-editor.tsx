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
import type { AboutSection } from "@/lib/admin-content";

export function AboutEditor() {
  const { content, setPath } = useAdminContent();
  const about = content.about;
  const sections = useList<AboutSection>("about.sections");

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
          max={240}
          format
          help="Select words, then Bold, Italic, or Color. Orange is #F9A000."
          value={about.headline}
          onChange={(value) => setPath("about.headline", value)}
        />
        <TextField
          label="Words to highlight in orange"
          required
          help="A shortcut. These words turn orange if they appear in the headline. You can also color any words with the headline tools."
          value={about.highlight}
          onChange={(value) => setPath("about.highlight", value)}
        />
        <AreaField
          label="Sub line"
          required
          rows={2}
          format
          value={about.sub}
          onChange={(value) => setPath("about.sub", value)}
        />
      </Subsection>

      <Subsection
        title="Main sections"
        hint="The work, the reason, and the way I work. Select words, then Bold, Italic, or Color. A blank line starts a new paragraph. Save to replace the live page."
      >
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
              rows={6}
              format
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
