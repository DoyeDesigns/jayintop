import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin-login";
import { getAdminSession } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function AdminPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");
  return <AdminLogin />;
}
