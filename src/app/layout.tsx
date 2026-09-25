import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { SiteCta } from "@/components/site-cta";
import { MenuProvider } from "@/components/menu";
import { Navbar } from "@/components/navbar";
import { bespoke, inter, spaceGrotesk, tanker } from "@/lib/fonts";
import "./globals.css";

const description =
  "I make brands look like the real thing, and products simple to use.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jayintop.com"),
  title: {
    default: "Jayintop",
    template: "%s · Jayintop",
  },
  description,
  applicationName: "Jayintop",
  icons: {
    icon: [
      {
        url: "/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Jayintop",
    description,
    siteName: "Jayintop",
    type: "website",
    images: [
      {
        url: "/favicon/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Jayintop",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Jayintop",
    description,
    images: ["/favicon/android-chrome-512x512.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${tanker.variable} ${bespoke.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-inter">
        <MenuProvider>
          <div className="site-background" aria-hidden />
          <div className="site-content flex min-h-dvh flex-col">
            <Navbar />
            <div className="mx-auto w-full max-w-[1380px] flex-1">{children}</div>
            <Suspense fallback={null}>
              <SiteCta />
            </Suspense>
            <Footer />
          </div>
        </MenuProvider>
      </body>
    </html>
  );
}
