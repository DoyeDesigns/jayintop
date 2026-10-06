import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { readSiteContent } from "@/lib/site-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await readSiteContent();
  return {
    title: "Contact",
    description: contact.body,
  };
}

export default async function ContactPage() {
  const { contact } = await readSiteContent();

  return (
    <main className="py-16 md:py-24">
      <h1 className="text-center font-tanker md:text-[76px] text-[40px] leading-none font-normal tracking-normal text-brand-white uppercase">
        {contact.headline}
      </h1>
      <p className="mx-auto mt-3 max-w-[640px] text-center font-bespoke text-[20px] leading-[1.5] font-normal tracking-normal text-[#C7C3BB]">
        {contact.body}
      </p>
      <div className="mt-12">
        <ContactForm label={contact.cta} />
      </div>
    </main>
  );
}
