"use client";

import { usePathname } from "next/navigation";
import { Cta } from "@/components/cta";

export function SiteCta() {
  const pathname = usePathname();

  if (pathname === "/contact") return null;

  return <Cta />;
}
