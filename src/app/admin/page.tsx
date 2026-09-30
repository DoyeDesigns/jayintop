import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin-login";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function AdminPage() {
  return <AdminLogin />;
}
