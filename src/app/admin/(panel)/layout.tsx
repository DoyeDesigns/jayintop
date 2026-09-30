import { AdminShell } from "@/components/admin-nav";
import { AdminContentProvider } from "@/components/admin/content-provider";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminContentProvider>
      <AdminShell>{children}</AdminShell>
    </AdminContentProvider>
  );
}
