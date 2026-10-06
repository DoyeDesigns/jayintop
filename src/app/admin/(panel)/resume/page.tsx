import type { Metadata } from "next";
import { ResumeEditor } from "@/components/admin/resume-editor";

export const metadata: Metadata = {
  title: "Resume",
};

export default function AdminResumePage() {
  return <ResumeEditor />;
}
