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
import { useList } from "@/components/admin/content-provider";
import type { TestimonialItem } from "@/lib/admin-content";

export function TestimonialsEditor() {
  const testimonials = useList<TestimonialItem>("testimonials");

  return (
    <EditorPage>
      <Subsection
        title="Testimonials"
        hint="Only quotes marked On site appear on the home and about pages. Keep the rest here rather than deleting them, so you can rotate."
      >
        {testimonials.items.map((item, index) => (
          <div key={`quote-${index}`} className="flex flex-col gap-4 border-b border-[#22262F] pb-6">
            <ItemTools
              title={item.name || "Unnamed"}
              index={index}
              total={testimonials.items.length}
              onMove={(direction) => testimonials.move(index, direction)}
              onRemove={() => testimonials.remove(index)}
              extra={
                <GhostButton
                  onClick={() =>
                    testimonials.set(index, { ...item, featured: !item.featured })
                  }
                >
                  {item.featured ? "On site" : "Not shown"}
                </GhostButton>
              }
            />
            <AreaField
              label="Quote"
              required
              rows={3}
              value={item.quote}
              onChange={(quote) => testimonials.set(index, { ...item, quote })}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <TextField
                label="Name"
                required
                value={item.name}
                onChange={(name) => testimonials.set(index, { ...item, name })}
              />
              <TextField
                label="Role and company"
                required
                value={item.role}
                onChange={(role) => testimonials.set(index, { ...item, role })}
              />
            </div>
          </div>
        ))}
        <AddButton
          onClick={() =>
            testimonials.add({ quote: "", name: "", role: "", featured: false })
          }
        >
          Add testimonial
        </AddButton>
      </Subsection>
    </EditorPage>
  );
}
