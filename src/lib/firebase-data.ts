import type { AdminContent } from "@/lib/admin-content";

export type BackendState = "ready" | "missing" | "denied";

function projectId() {
  const id = process.env.FIREBASE_PROJECT_ID;
  if (!id) throw new Error("Missing FIREBASE_PROJECT_ID");
  return id;
}

function documentUrl() {
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents/content/site`;
}

async function errorMessage(response: Response) {
  const text = await response.text();
  try {
    const body = JSON.parse(text) as { error?: { message?: string } };
    return body.error?.message ?? text;
  } catch {
    return text;
  }
}

export function explainFirebaseFailure(message: string) {
  const text = message.toLowerCase();
  if (text.includes("does not exist for project") || text.includes("database (default) does not exist")) {
    return "Firestore is not created yet. In the Firebase console, open Firestore Database and click Create database. Keep the database id as (default).";
  }
  if (
    text.includes("permission_denied") ||
    text.includes("insufficient permissions") ||
    text.includes("missing or insufficient")
  ) {
    return "Firebase blocked the save. Allow public read of content/site, signed-in writes, and signed-in Storage uploads.";
  }
  return message.slice(0, 220) || "Firebase could not save this.";
}

export async function checkFirestore(): Promise<BackendState> {
  const firestoreResponse = await fetch(documentUrl(), { cache: "no-store" });
  if (firestoreResponse.ok) return "ready";

  const message = (await errorMessage(firestoreResponse)).toLowerCase();
  if (firestoreResponse.status === 404 && !message.includes("does not exist")) return "ready";
  if (firestoreResponse.status === 403) return "denied";
  return "missing";
}

export async function readFirestoreContent() {
  const response = await fetch(documentUrl(), { cache: "no-store" });
  if (!response.ok) return null;
  const body = (await response.json()) as {
    fields?: { json?: { stringValue?: string } };
  };
  return body.fields?.json?.stringValue ?? null;
}

export async function writeFirestoreContent(content: AdminContent, token: string) {
  const payload = JSON.stringify({
    fields: { json: { stringValue: JSON.stringify(content) } },
  });
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const patched = await fetch(`${documentUrl()}?updateMask.fieldPaths=json`, {
    method: "PATCH",
    headers,
    body: payload,
    cache: "no-store",
  });
  if (patched.ok) return;

  const patchMessage = await errorMessage(patched);
  const missingDocument = patched.status === 404 && !patchMessage.toLowerCase().includes("does not exist");
  if (!missingDocument) throw new Error(explainFirebaseFailure(patchMessage));

  const created = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents/content?documentId=site`,
    { method: "POST", headers, body: payload, cache: "no-store" },
  );
  if (created.ok) return;
  throw new Error(explainFirebaseFailure(await errorMessage(created)));
}

export async function writeFirestoreMessage(message: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}) {
  const fields = Object.fromEntries(
    Object.entries(message).map(([key, value]) => [key, { stringValue: value }]),
  );
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
      cache: "no-store",
    },
  );
  if (response.ok) return;
  throw new Error(explainFirebaseFailure(await errorMessage(response)));
}

