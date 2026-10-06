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
        <div className="mx-auto w-full max-w-[1380px] flex-1 px-4 md:px-[30px]">{children}</div>
        <Suspense fallback={null}>
          <SiteCta headline={contact.headline} body={contact.body} cta={contact.cta} />
        </Suspense>
        <Footer links={links} />
      </div>
    </>
  );
}
