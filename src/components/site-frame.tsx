"use client";

import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SiteCta } from "@/components/site-cta";

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="site-background" aria-hidden />
      <div className="site-content flex min-h-dvh flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-[1380px] flex-1">{children}</div>
        <Suspense fallback={null}>
          <SiteCta />
        </Suspense>
        <Footer />
      </div>
    </>
  );
}
