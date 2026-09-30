"use client";

import {
  AreaField,
  EditorPage,
  StringList,
  Subsection,
  TextField,
} from "@/components/admin/fields";
import { useAdminContent } from "@/components/admin/content-provider";

export function WorkEditor() {
  const { content, setPath } = useAdminContent();
  const work = content.work;

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
        hint="The buttons above the project list. The first one shows everything."
      >
        <StringList path="work.filters" addLabel="Add filter" />
      </Subsection>
    </EditorPage>
  );
}
