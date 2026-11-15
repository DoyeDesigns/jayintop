import { defaultContent, mergeContent, type AdminContent, type CaseItem } from "@/lib/admin-content";

export type BackendState = "ready" | "missing" | "denied";

export class StaleContentError extends Error {
  live: AdminContent;

  constructor(live: AdminContent) {
    super("Another save already happened — reloaded live data.");
    this.name = "StaleContentError";
    this.live = live;
  }
}

type FirestoreValue = {
  stringValue?: string;
};

type FirestoreDoc = {
  name?: string;
  updateTime?: string;
  fields?: Record<string, FirestoreValue>;
};

function projectId() {
  const id = process.env.FIREBASE_PROJECT_ID;
  if (!id) throw new Error("Missing FIREBASE_PROJECT_ID");
  return id;
}

export function hasFirebaseEnv() {
  return Boolean(process.env.FIREBASE_PROJECT_ID);
}

function documentsRoot() {
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents`;
}

function siteDocUrl() {
  return `${documentsRoot()}/content/site`;
}

function contentCollectionUrl() {
  return `${documentsRoot()}/content`;
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
    return "Firebase blocked the save. Allow public read of content documents, signed-in writes, and signed-in Storage uploads.";
  }
  return message.slice(0, 220) || "Firebase could not save this.";
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function parseJsonField(doc: FirestoreDoc) {
  const raw = doc.fields?.json?.stringValue;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("Live Firebase content is not valid JSON.");
  }
}

function assembleContent(
  site: unknown,
  cases: CaseItem[],
  updatedAt: string,
  revision: string,
): AdminContent {
  const parsed = site && typeof site === "object" ? (site as Partial<AdminContent>) : {};
  return {
    ...mergeContent(defaultContent(), {
      ...parsed,
      cases,
      updatedAt,
    }),
    revision,
  };
}

function revisionOf(doc: FirestoreDoc, updatedAt: string) {
  if (doc.updateTime) return doc.updateTime;
  if (updatedAt) return `updatedAt:${updatedAt}`;
  return "present";
}

function isConflict(status: number, message: string) {
  const text = message.toLowerCase();
  return (
    status === 409 ||
    status === 412 ||
    text.includes("precondition") ||
    text.includes("update_time") ||
    text.includes("already exists")
  );
}

function isTransientNetworkError(error: unknown) {
  const cause =
    error && typeof error === "object" && "cause" in error
      ? (error as { cause?: { code?: string } }).cause
      : undefined;
  const code = cause?.code ?? "";
  return (
    code === "EAI_AGAIN" ||
    code === "ENOTFOUND" ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_SOCKET"
  );
}

async function fetchFresh(url: string, init?: RequestInit) {
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await fetch(url, { ...init, cache: "no-store" });
    } catch (error) {
      last = error;
      if (!isTransientNetworkError(error) || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
    }
  }
  if (isTransientNetworkError(last)) {
    throw new Error("Firestore did not respond. Check the network connection and reload.");
  }
  throw last;
}

async function getSiteDoc() {
  const response = await fetchFresh(siteDocUrl());
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(explainFirebaseFailure(await errorMessage(response)));
  }
  return (await response.json()) as FirestoreDoc;
}

export async function readCmsState(): Promise<{ content: AdminContent; split: boolean }> {
  const siteDoc = await getSiteDoc();
  if (!siteDoc) return { content: defaultContent(), split: false };

  const updatedAt = siteDoc.fields?.updatedAt?.stringValue ?? "";
  const payload = parseJsonField(siteDoc);
  const stored = payload && typeof payload === "object" ? (payload as Partial<AdminContent>) : {};
  const cases = Array.isArray(stored.cases) ? stored.cases : [];
  const storedAt = updatedAt || stored.updatedAt || "";
  return {
    content: assembleContent(
      { ...stored, cases: undefined },
      cases,
      storedAt,
      revisionOf(siteDoc, storedAt),
    ),
    split: false,
  };
}

export async function readCmsContent() {
  return (await readCmsState()).content;
}

const fieldMask =
  "updateMask.fieldPaths=json&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=schema";

function documentFields(content: AdminContent) {
  const { revision: _revision, ...body } = content;
  return {
    json: { stringValue: JSON.stringify(body) },
    updatedAt: { stringValue: content.updatedAt },
    schema: { stringValue: "embedded-v1" },
  };
}

async function createSiteDoc(fields: Record<string, FirestoreValue>, token: string) {
  const created = await fetch(`${contentCollectionUrl()}?documentId=site`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ fields }),
    cache: "no-store",
  });
  if (created.ok) return;
  const message = await errorMessage(created);
  if (isConflict(created.status, message)) {
    throw new StaleContentError(await readCmsContent());
  }
  throw new Error(explainFirebaseFailure(message));
}

async function writeSiteDoc(content: AdminContent, token: string, expectedRevision: string) {
  const fields = documentFields(content);

  if (!expectedRevision) {
    const existing = await getSiteDoc();
    if (existing) throw new StaleContentError(await readCmsContent());
    await createSiteDoc(fields, token);
    return;
  }

  const updateTime = /^\d{4}-\d{2}-\d{2}T/.test(expectedRevision) ? expectedRevision : "";
  if (!updateTime) {
    const live = await readCmsContent();
    if (live.revision !== expectedRevision) throw new StaleContentError(live);
  }

  const precondition = updateTime
    ? `&currentDocument.updateTime=${encodeURIComponent(updateTime)}`
    : "";
  const patched = await fetch(
    `${siteDocUrl()}?${fieldMask}${precondition}`,
    {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ fields }),
      cache: "no-store",
    },
  );
  if (patched.ok) return;

  const message = await errorMessage(patched);
  if (isConflict(patched.status, message) || patched.status === 404) {
    throw new StaleContentError(await readCmsContent());
  }
  throw new Error(explainFirebaseFailure(message));
}

export async function writeCmsContent(
  content: AdminContent,
  token: string,
  expectedRevision: string,
) {
  const now = new Date().toISOString();
  await writeSiteDoc({ ...content, updatedAt: now }, token, expectedRevision);
}

export async function checkFirestore(): Promise<BackendState> {
  const firestoreResponse = await fetch(siteDocUrl(), { cache: "no-store" });
  if (firestoreResponse.ok) return "ready";

  const message = (await errorMessage(firestoreResponse)).toLowerCase();
  if (firestoreResponse.status === 404 && !message.includes("does not exist")) return "ready";
  if (firestoreResponse.status === 403) return "denied";
  return "missing";
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
  const response = await fetch(`${documentsRoot()}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
    cache: "no-store",
  });
  if (response.ok) return;
  throw new Error(explainFirebaseFailure(await errorMessage(response)));
}
