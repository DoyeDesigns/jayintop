import type { Metadata } from "next";
import { ContactEditor } from "@/components/admin/contact-editor";

export const metadata: Metadata = {
  title: "Contact",
};

export default function AdminContactPage() {
  return <ContactEditor />;
}
