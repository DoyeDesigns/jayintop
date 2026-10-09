"use client";

import {
  AddButton,
  AreaField,
  EditorPage,
  GhostButton,
  ItemTools,
  Subsection,
  TextField,
} from "@/components/admin/fields";
import { useAdminContent, useList } from "@/components/admin/content-provider";
import type { SocialLink } from "@/lib/admin-content";

export function SettingsEditor() {
  const { content, setPath, reset } = useAdminContent();
  const site = content.site;
  const socials = useList<SocialLink>("site.socials");

  return (
    <EditorPage>
      <Subsection title="Site details">
        <TextField
          label="Your name"
          required
          value={site.name}
          onChange={(value) => setPath("site.name", value)}
        />
        <TextField
          label="Tagline"
          required
          value={site.tagline}
          onChange={(value) => setPath("site.tagline", value)}
        />
        <TextField
          label="Contact email"
          required
          help="Where the contact button sends people."
          value={site.email}
          onChange={(value) => setPath("site.email", value)}
        />
      </Subsection>

      <Subsection title="Search listing" hint="What Google shows.">
        <TextField
          label="Page title"
          required
          max={60}
          value={site.metaTitle}
          onChange={(value) => setPath("site.metaTitle", value)}
        />
        <AreaField
          label="Description"
          required
          rows={3}
          help="Aim for 150 to 160 characters."
          value={site.metaDesc}
          onChange={(value) => setPath("site.metaDesc", value)}
        />
      </Subsection>

      <Subsection title="Social links">
        {socials.items.map((link, index) => (
          <div key={`social-${index}`} className="flex flex-col gap-4 border-b border-[#22262F] pb-6">
            <ItemTools
              title={`Link ${index + 1}`}
              index={index}
              total={socials.items.length}
              onMove={(direction) => socials.move(index, direction)}
              onRemove={() => socials.remove(index)}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <TextField
                label="Platform"
                required
                value={link.label}
                onChange={(label) => socials.set(index, { ...link, label })}
              />
              <TextField
                label="Profile URL"
                value={link.url}
                onChange={(url) => socials.set(index, { ...link, url })}
              />
            </div>
            <button
              type="button"
              onClick={() => socials.set(index, { ...link, hidden: !link.hidden })}
              className="inline-flex h-8 w-fit cursor-pointer items-center justify-center rounded-[6px] border border-[#373A41] px-3 font-tanker text-[15px] leading-[1.2] font-normal tracking-normal text-brand-white hover:border-brand hover:text-brand"
            >
              {link.hidden ? "Show" : "Hide"}
            </button>
          </div>
        ))}
        <AddButton onClick={() => socials.add({ label: "", url: "", hidden: false })}>
          Add link
        </AddButton>
      </Subsection>

      <Subsection
        title="Danger zone"
        hint="Reset everything back to the starting content."
      >
        <GhostButton danger onClick={reset}>
          Reset all content
        </GhostButton>
      </Subsection>
    </EditorPage>
  );
}
