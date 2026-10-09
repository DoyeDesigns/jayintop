"use client";

import {
  AddButton,
  AreaField,
  EditorPage,
  ItemTools,
  Subsection,
  TextField,
} from "@/components/admin/fields";
import { useAdminContent, useList } from "@/components/admin/content-provider";
import type { Service } from "@/lib/admin-content";

export function HomeEditor() {
  const { content, setPath } = useAdminContent();
  const home = content.home;
  const services = useList<Service>("home.services");

  return (
    <EditorPage>
      <Subsection title="Hero">
        <TextField
          label="Name line"
          required
          max={40}
          value={home.heroName}
          onChange={(value) => setPath("home.heroName", value)}
        />
        <TextField
          label="Highlight"
          required
          max={200}
          format
          help="Select words, then Bold, Italic, or Color. This is the main line on the home page."
          value={home.heroHeadline}
          onChange={(value) => setPath("home.heroHeadline", value)}
        />
        <TextField
          label="Words to highlight in orange"
          required
          help="A shortcut. These words turn orange if they appear in the line above."
          value={home.heroHighlight}
          onChange={(value) => setPath("home.heroHighlight", value)}
        />
        <AreaField
          label="Left column"
          required
          value={home.heroLeft}
          onChange={(value) => setPath("home.heroLeft", value)}
        />
        <AreaField
          label="Right column"
          required
          value={home.heroRight}
          onChange={(value) => setPath("home.heroRight", value)}
        />
        <TextField
          label="Button label"
          required
          max={24}
          value={home.heroCta}
          onChange={(value) => setPath("home.heroCta", value)}
        />
      </Subsection>

      <Subsection
        title="What I believe"
        hint="The cream block halfway down the page."
      >
        <TextField
          label="Small label above"
          required
          max={30}
          value={home.beliefEyebrow}
          onChange={(value) => setPath("home.beliefEyebrow", value)}
        />
        <TextField
          label="Opening line"
          required
          max={70}
          help="Set in bold. One sentence."
          value={home.beliefLead}
          onChange={(value) => setPath("home.beliefLead", value)}
        />
        <AreaField
          label="Body"
          required
          rows={8}
          help="Leave a blank line between paragraphs."
          value={home.beliefBody}
          onChange={(value) => setPath("home.beliefBody", value)}
        />
      </Subsection>

      <Subsection
        title="What I do"
        hint="Each one becomes a tab. Write the client's problem first, then how you solve it."
      >
        {services.items.map((service, index) => (
          <div key={`service-${index}`} className="flex flex-col gap-4 border-b border-[#22262F] pb-6">
            <ItemTools
              title={`Service ${index + 1}`}
              index={index}
              total={services.items.length}
              onMove={(direction) => services.move(index, direction)}
              onRemove={() => services.remove(index)}
            />
            <TextField
              label="Tab label"
              required
              value={service.title}
              onChange={(value) => services.set(index, { ...service, title: value })}
            />
            <AreaField
              label="Description"
              required
              rows={3}
              value={service.copy}
              onChange={(value) => services.set(index, { ...service, copy: value })}
            />
          </div>
        ))}
        <AddButton onClick={() => services.add({ title: "New service", copy: "" })}>
          Add service
        </AddButton>
      </Subsection>
    </EditorPage>
  );
}
