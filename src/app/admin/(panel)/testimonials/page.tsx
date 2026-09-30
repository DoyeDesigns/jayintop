import type { Metadata } from "next";
import { TestimonialsEditor } from "@/components/admin/testimonials-editor";

export const metadata: Metadata = {
  title: "Testimonials",
};

export default function AdminTestimonialsPage() {
  return <TestimonialsEditor />;
}
