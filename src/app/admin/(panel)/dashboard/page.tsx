import type { Metadata } from "next";
import { DashboardEditor } from "@/components/admin/dashboard-editor";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return <DashboardEditor />;
}
