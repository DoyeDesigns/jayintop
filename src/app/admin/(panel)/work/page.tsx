import type { Metadata } from "next";
import { WorkEditor } from "@/components/admin/work-editor";

export const metadata: Metadata = {
  title: "Work",
};

export default function AdminWorkPage() {
  return <WorkEditor />;
}
