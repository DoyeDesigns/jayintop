import type { Metadata } from "next";
import { CasesEditor } from "@/components/admin/cases-editor";

export const metadata: Metadata = {
  title: "Case studies",
};

export default function AdminCaseStudiesPage() {
  return <CasesEditor />;
}
