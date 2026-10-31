"use server";

import { sendContactEmails } from "@/lib/contact-mail";
import { readSiteContent, saveContactMessage } from "@/lib/site-store";

export async function submitContact(formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !lastName || !email || !message) {
    return { ok: false as const, error: "Fill in the required fields." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "Enter a valid email address." };
  }

  const payload = {
    firstName,
    lastName,
    email,
    phone,
    message,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveContactMessage(payload);
  } catch {
    return { ok: false as const, error: "The message did not send. Try again." };
  }

  try {
    const { site } = await readSiteContent();
    await sendContactEmails(payload, site.email);
  } catch (error) {
    console.error("[submitContact] email failed:", error);
    return { ok: false as const, error: "The message did not send. Try again." };
  }

  return { ok: true as const };
}
