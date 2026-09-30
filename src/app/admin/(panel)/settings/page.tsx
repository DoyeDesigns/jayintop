import type { Metadata } from "next";
import { SettingsEditor } from "@/components/admin/settings-editor";

export const metadata: Metadata = {
  title: "Settings",
};

export default function AdminSettingsPage() {
  return <SettingsEditor />;
}
