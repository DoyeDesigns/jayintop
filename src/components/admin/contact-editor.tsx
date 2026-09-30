"use client";

import {
  AreaField,
  EditorPage,
  Subsection,
  TextField,
} from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";

export function ContactEditor() {
  const { content, setPath } = useAdminContent();
  const contact = content.contact;

  return (
    <EditorPage>
      <Subsection
        title="Closing call to action"
        hint="Sits above the footer on every page."
      >
        <TextField
          label="Headline"
          required
          max={50}
          value={contact.headline}
          onChange={(value) => setPath("contact.headline", value)}
        />
        <AreaField
          label="Body"
          required
          rows={3}
          value={contact.body}
          onChange={(value) => setPath("contact.body", value)}
        />
        <TextField
          label="Button label"
          required
          max={24}
          value={contact.cta}
          onChange={(value) => setPath("contact.cta", value)}
        />
      </Subsection>
    </EditorPage>
  );
}
