import type { Metadata } from "next";
import { CaseEditor } from "@/components/admin/case-editor";

export const metadata: Metadata = {
  title: "Edit case study",
};

type CasePageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCasePage({ params }: CasePageProps) {
  const { id } = await params;
  return <CaseEditor id={id} />;
}
