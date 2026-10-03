"use client";

import { usePathname } from "next/navigation";
import { Cta } from "@/components/cta";

export function SiteCta({
  headline,
  body,
  cta,
}: {
  headline: string;
  body: string;
  cta: string;
}) {
  const pathname = usePathname();

  if (pathname === "/contact" || pathname.startsWith("/admin")) return null;

  return <Cta headline={headline} body={body} cta={cta} />;
}
