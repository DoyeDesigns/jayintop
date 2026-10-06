"use client";

import {
  AddButton,
  EditorPage,
  ItemTools,
  StringList,
  Subsection,
  TextField,
} from "@/components/admin/fields";
import { useAdminContent, useList } from "@/components/admin/content-provider";
import type { ResumeContact, ResumeEntry, ResumeSection } from "@/lib/admin-content";

function emptyEntry(): ResumeEntry {
  return { title: "", date: "", paragraphs: [] };
}

function EntryFields({
  sectionIndex,
  entryIndex,
  entry,
  total,
}: {
  sectionIndex: number;
  entryIndex: number;
  entry: ResumeEntry;
  total: number;
}) {
  const entries = useList<ResumeEntry>(`resume.sections.${sectionIndex}.entries`);

  return (
    <div className="flex flex-col gap-4 rounded-[8px] border border-[#22262F] p-4">
      <ItemTools
        title={entry.title.trim() || `Item ${entryIndex + 1}`}
        index={entryIndex}
        total={total}
        onMove={(direction) => entries.move(entryIndex, direction)}
        onRemove={() => entries.remove(entryIndex)}
      />
      <TextField
        label="Title"
        value={entry.title}
        onChange={(title) => entries.set(entryIndex, { ...entry, title })}
      />
      <TextField
        label="Date"
        help="Leave blank when this item has no date."
        value={entry.date}
        onChange={(date) => entries.set(entryIndex, { ...entry, date })}
      />
      <div className="flex flex-col gap-2">
        <p className="font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase">
          Paragraphs
        </p>
        <StringList
          path={`resume.sections.${sectionIndex}.entries.${entryIndex}.paragraphs`}
          addLabel="Add paragraph"
        />
      </div>
    </div>
  );
}

function SectionFields({
  index,
  section,
  total,
}: {
  index: number;
  section: ResumeSection;
  total: number;
}) {
  const sections = useList<ResumeSection>("resume.sections");
  const entries = useList<ResumeEntry>(`resume.sections.${index}.entries`);

  return (
    <div className="flex flex-col gap-4 border-b border-[#22262F] pb-6">
      <ItemTools
        title={section.title.trim() || `Section ${index + 1}`}
        index={index}
        total={total}
        onMove={(direction) => sections.move(index, direction)}
        onRemove={() => sections.remove(index)}
      />
      <TextField
        label="Section heading"
        required
        value={section.title}
        onChange={(title) => sections.set(index, { ...section, title })}
      />
      {entries.items.map((entry, entryIndex) => (
        <EntryFields
          key={`${index}-${entryIndex}`}
          sectionIndex={index}
          entryIndex={entryIndex}
          entry={entry}
          total={entries.items.length}
        />
      ))}
      <AddButton onClick={() => entries.add(emptyEntry())}>Add item</AddButton>
    </div>
  );
}

export function ResumeEditor() {
  const { content, setPath } = useAdminContent();
  const resume = content.resume;
  const contacts = useList<ResumeContact>("resume.contacts");
  const sections = useList<ResumeSection>("resume.sections");

  return (
    <EditorPage>
      <Subsection title="Page heading">
        <TextField
          label="Page title"
          required
          value={resume.title}
          onChange={(value) => setPath("resume.title", value)}
        />
        <TextField
          label="Name"
          required
          value={resume.name}
          onChange={(value) => setPath("resume.name", value)}
        />
        <TextField
          label="Role"
          required
          value={resume.role}
          onChange={(value) => setPath("resume.role", value)}
        />
      </Subsection>

      <Subsection title="Contact lines" hint="Shown at the top right of the resume.">
        {contacts.items.map((contact, index) => (
          <div key={`contact-${index}`} className="flex flex-col gap-4 border-b border-[#22262F] pb-6">
            <ItemTools
              title={contact.text.trim() || `Line ${index + 1}`}
              index={index}
              total={contacts.items.length}
              onMove={(direction) => contacts.move(index, direction)}
              onRemove={() => contacts.remove(index)}
            />
            <TextField
              label="Text"
              value={contact.text}
              onChange={(text) => contacts.set(index, { ...contact, text })}
            />
            <TextField
              label="Link"
              help="mailto:, tel:, or a full web address."
              value={contact.href}
              onChange={(href) => contacts.set(index, { ...contact, href })}
            />
          </div>
        ))}
        <AddButton onClick={() => contacts.add({ text: "", href: "" })}>Add line</AddButton>
      </Subsection>

      <Subsection
        title="Sections"
        hint="Bio, education, experience, and anything else. Each section holds its own items. Leave an item title blank when the section is only paragraphs."
      >
        {sections.items.map((section, index) => (
          <SectionFields
            key={`section-${index}`}
            index={index}
            section={section}
            total={sections.items.length}
          />
        ))}
        <AddButton
          onClick={() => sections.add({ title: "New section", entries: [] })}
        >
          Add section
        </AddButton>
      </Subsection>
    </EditorPage>
  );
}
