"use client";

import { usePathname } from "next/navigation";
import { Cta } from "@/components/cta";

export function SiteCta() {
  const pathname = usePathname();

  if (pathname === "/contact" || pathname.startsWith("/admin")) return null;

  return <Cta />;
}
