import type { Metadata } from "next";
import { AboutEditor } from "@/components/admin/about-editor";

export const metadata: Metadata = {
  title: "About",
};

export default function AdminAboutPage() {
  return <AboutEditor />;
}
