import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-nav";
import { AdminContentProvider } from "@/components/admin/content-provider";
import { getAdminSession } from "@/lib/admin-session";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  return (
    <AdminContentProvider>
      <AdminShell email={session.email} name={session.name}>
        {children}
      </AdminShell>
    </AdminContentProvider>
  );
}
