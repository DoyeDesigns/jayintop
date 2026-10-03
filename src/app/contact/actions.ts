"use server";

import { saveContactMessage } from "@/lib/site-store";

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

  try {
    await saveContactMessage({
      firstName,
      lastName,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
    });
  } catch {
    return { ok: false as const, error: "The message did not send. Try again." };
  }

  return { ok: true as const };
}
