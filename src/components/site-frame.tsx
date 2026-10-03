"use client";

import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SiteCta } from "@/components/site-cta";

export function SiteFrame({
  children,
  links = [],
  contact,
}: {
  children: ReactNode;
  links?: { label: string; url: string }[];
  contact: { headline: string; body: string; cta: string };
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="site-background" aria-hidden />
      <div className="site-content flex min-h-dvh flex-col">
        <Navbar />
        <div className="w-full flex-1">{children}</div>
        <Suspense fallback={null}>
          <SiteCta headline={contact.headline} body={contact.body} cta={contact.cta} />
        </Suspense>
        <Footer links={links} />
      </div>
    </>
  );
}
