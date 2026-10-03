import { cookies } from "next/headers";
import { cache } from "react";

const refreshCookie = "jayintop_admin";
const persistCookie = "jayintop_admin_persist";
const month = 60 * 60 * 24 * 30;

type FirebaseErrorBody = {
  error?: { message?: string };
};

export type AdminSession = {
  email: string;
  name: string | null;
};

function apiKey() {
  const key = process.env.FIREBASE_API_KEY;
  if (!key) throw new Error("Missing FIREBASE_API_KEY");
  return key;
}

async function firebaseError(response: Response) {
  const body = (await response.json().catch(() => null)) as FirebaseErrorBody | null;
  return body?.error?.message ?? "REQUEST_FAILED";
}

function cookieOptions(remember: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    ...(remember ? { maxAge: month } : {}),
  };
}

export async function signInWithPassword(email: string, password: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );

  if (!response.ok) throw new Error(await firebaseError(response));

  return (await response.json()) as { refreshToken: string };
}

export async function sendPasswordReset(email: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
    },
  );

  if (!response.ok) throw new Error(await firebaseError(response));
}

async function refreshIdToken(refreshToken: string) {
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${apiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    },
  );

  if (!response.ok) throw new Error(await firebaseError(response));

  const body = (await response.json()) as { id_token?: string };
  if (!body.id_token) throw new Error("MISSING_ID_TOKEN");
  return body.id_token;
}

async function lookupAccount(idToken: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!response.ok) throw new Error(await firebaseError(response));

  const body = (await response.json()) as {
    users?: { email?: string; displayName?: string }[];
  };
  const user = body.users?.[0];
  if (!user?.email) throw new Error("MISSING_ACCOUNT");
  return {
    email: user.email,
    name: user.displayName?.trim() || null,
  };
}

export async function setAdminSession(refreshToken: string, remember: boolean) {
  const jar = await cookies();
  jar.set(refreshCookie, refreshToken, cookieOptions(remember));
  if (remember) {
    jar.set(persistCookie, "1", cookieOptions(true));
  } else {
    jar.delete(persistCookie);
  }
}

export async function clearAdminSession() {
  const jar = await cookies();
  const expired = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  };
  jar.set(refreshCookie, "", expired);
  jar.set(persistCookie, "", expired);
}

export async function getAdminIdToken() {
  const jar = await cookies();
  const refreshToken = jar.get(refreshCookie)?.value;
  if (!refreshToken) return null;

  try {
    return await refreshIdToken(refreshToken);
  } catch {
    return null;
  }
}

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  const idToken = await getAdminIdToken();
  if (!idToken) return null;

  try {
    return await lookupAccount(idToken);
  } catch {
    return null;
  }
});
