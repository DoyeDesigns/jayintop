"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  sendPasswordReset,
  setAdminSession,
  signInWithPassword,
} from "@/lib/admin-session";

const credentialErrors = new Set([
  "INVALID_LOGIN_CREDENTIALS",
  "INVALID_PASSWORD",
  "EMAIL_NOT_FOUND",
  "INVALID_EMAIL",
  "MISSING_PASSWORD",
  "USER_DISABLED",
]);

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  try {
    const session = await signInWithPassword(email, password);
    await setAdminSession(session.refreshToken, remember);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (credentialErrors.has(message)) {
      return { error: "Email or password is incorrect." };
    }
    return { error: "Sign-in did not complete. Try again." };
  }

  redirect("/admin/dashboard");
}

export async function sendAdminReset(email: string) {
  const trimmed = email.trim();
  if (!trimmed) return { message: "Enter your email first." };

  try {
    await sendPasswordReset(trimmed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message !== "EMAIL_NOT_FOUND") {
      return { message: "The reset email did not send. Try again." };
    }
  }

  return {
    message: "If that email has an admin account, a reset link is on its way.",
  };
}

export async function signOutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}
