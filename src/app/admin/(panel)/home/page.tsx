import type { Metadata } from "next";
import { HomeEditor } from "@/components/admin/home-editor";

export const metadata: Metadata = {
  title: "Home",
};

export default function AdminHomePage() {
  return <HomeEditor />;
}
