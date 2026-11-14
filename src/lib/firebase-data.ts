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
  if (!response.ok) {
    const err = await errorMessage(response);
    // #region agent log
    fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
      body: JSON.stringify({
        sessionId: "48b4d3",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "firebase-data.ts:readFirestoreContent",
        message: "firestore read failed",
        data: { status: response.status, err: err.slice(0, 180) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return null;
  }
  const body = (await response.json()) as {
    fields?: { json?: { stringValue?: string } };
  };
  const raw = body.fields?.json?.stringValue ?? null;
  // #region agent log
  fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
    body: JSON.stringify({
      sessionId: "48b4d3",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "firebase-data.ts:readFirestoreContent",
      message: "firestore read ok",
      data: {
        bytes: raw?.length ?? 0,
        over1mb: (raw?.length ?? 0) > 1_000_000,
        hasJsonField: Boolean(body.fields?.json),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return raw;
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
  // #region agent log
  fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
    body: JSON.stringify({
      sessionId: "48b4d3",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "firebase-data.ts:writeFirestoreContent",
      message: "firestore patch result",
      data: {
        status: patched.status,
        ok: patched.ok,
        payloadBytes: payload.length,
        jsonBytes: JSON.stringify(content).length,
        over1mb: JSON.stringify(content).length > 1_000_000,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
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

