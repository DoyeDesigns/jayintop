import type { Metadata } from "next";
import { MenuProvider } from "@/components/menu";
import { SiteFrame } from "@/components/site-frame";
import { bespoke, inter, spaceGrotesk, tanker } from "@/lib/fonts";
import { readSiteContent } from "@/lib/site-store";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await readSiteContent();
  const title = site.metaTitle || "Jayintop";
  const summary = site.metaDesc;

  return {
  metadataBase: new URL("https://jayintop.com"),
  title: {
    default: title,
    template: "%s · Jayintop",
  },
  description: summary,
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
    title,
    description: summary,
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
    title,
    description: summary,
    images: ["/favicon/android-chrome-512x512.png"],
  },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { site, contact } = await readSiteContent();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${tanker.variable} ${bespoke.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-inter">
        <MenuProvider links={site.socials}>
          <SiteFrame links={site.socials} contact={contact}>
            {children}
          </SiteFrame>
        </MenuProvider>
      </body>
    </html>
  );
}
