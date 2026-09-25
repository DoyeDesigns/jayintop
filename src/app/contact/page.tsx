import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Kindly send a message and I will reach out to you.",
};

export default function ContactPage() {
  return (
    <main className="px-8 py-16 md:px-10 md:py-24">
      <h1 className="text-center font-tanker md:text-[76px] text-[40px] leading-none font-normal tracking-normal text-brand-white uppercase">
        Contact
      </h1>
      <p className="mt-3 text-center font-bespoke text-[20px] leading-[1.5] font-normal tracking-normal text-[#C7C3BB]">
        Kindly send a message and I will reach out to you.
      </p>
      <div className="mt-12">
        <ContactForm />
      </div>
    </main>
  );
}
