import { defaultContent, mergeContent, type AdminContent, type CaseItem } from "@/lib/admin-content";

export type BackendState = "ready" | "missing" | "denied";

const SCHEMA = "split-v1";

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
  integerValue?: string;
};

type FirestoreDoc = {
  name?: string;
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

function caseDocId(id: string) {
  return `case_${id}`;
}

function caseDocUrl(id: string) {
  return `${contentCollectionUrl()}/${encodeURIComponent(caseDocId(id))}`;
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

function assembleContent(site: unknown, cases: CaseItem[], updatedAt: string): AdminContent {
  const parsed = site && typeof site === "object" ? (site as Partial<AdminContent>) : {};
  return mergeContent(defaultContent(), {
    ...parsed,
    cases,
    updatedAt,
  });
}

async function getSiteDoc() {
  const response = await fetch(siteDocUrl(), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(explainFirebaseFailure(await errorMessage(response)));
  }
  return (await response.json()) as FirestoreDoc;
}

async function getCaseDoc(id: string) {
  const response = await fetch(caseDocUrl(id), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(explainFirebaseFailure(await errorMessage(response)));
  }
  return (await response.json()) as FirestoreDoc;
}

function caseFromDoc(doc: FirestoreDoc): CaseItem | null {
  const parsed = parseJsonField(doc);
  if (!parsed || typeof parsed !== "object" || !("id" in parsed)) return null;
  return parsed as CaseItem;
}

function caseIdsFromPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return [];
  const ids = (payload as { caseIds?: unknown }).caseIds;
  return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string" && id.length > 0) : [];
}

async function loadCases(ids: string[]) {
  const docs = await Promise.all(ids.map((id) => getCaseDoc(id)));
  return docs.map((doc, index) => {
    const id = ids[index];
    if (!doc) throw new Error(`Case study ${id} is missing from Firebase.`);
    const item = caseFromDoc(doc);
    if (!item) throw new Error(`Case study ${id} is not valid JSON.`);
    return item;
  });
}

export async function readCmsState(): Promise<{ content: AdminContent; split: boolean }> {
  const siteDoc = await getSiteDoc();
  if (!siteDoc) return { content: defaultContent(), split: false };

  const schema = siteDoc.fields?.schema?.stringValue ?? "";
  const updatedAt = siteDoc.fields?.updatedAt?.stringValue ?? "";
  const payload = parseJsonField(siteDoc);

  if (schema === SCHEMA) {
    const caseIds = caseIdsFromPayload(payload);
    const embedded = Array.isArray((payload as { cases?: unknown })?.cases)
      ? ((payload as { cases: CaseItem[] }).cases)
      : [];
    try {
      const cases = await loadCases(caseIds);
      return { content: assembleContent(payload, cases, updatedAt), split: true };
    } catch (error) {
      if (!embedded.length) throw error;
      return {
        content: assembleContent({ ...payload, cases: undefined }, embedded, updatedAt || ""),
        split: false,
      };
    }
  }

  const legacy = payload && typeof payload === "object" ? (payload as Partial<AdminContent>) : {};
  const cases = Array.isArray(legacy.cases) ? legacy.cases : [];
  return {
    content: assembleContent({ ...legacy, cases: undefined }, cases, updatedAt || legacy.updatedAt || ""),
    split: false,
  };
}

export async function readCmsContent() {
  return (await readCmsState()).content;
}

async function patchOrCreateSite(fields: Record<string, FirestoreValue>, token: string) {
  const payload = JSON.stringify({ fields });
  const mask =
    "updateMask.fieldPaths=json&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=schema";
  const patched = await fetch(`${siteDocUrl()}?${mask}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: payload,
    cache: "no-store",
  });
  if (patched.ok) return;

  const patchMessage = await errorMessage(patched);
  const missingDocument = patched.status === 404 && !patchMessage.toLowerCase().includes("does not exist");
  if (!missingDocument) throw new Error(explainFirebaseFailure(patchMessage));

  const created = await fetch(`${contentCollectionUrl()}?documentId=site`, {
    method: "POST",
    headers: authHeaders(token),
    body: payload,
    cache: "no-store",
  });
  if (created.ok) return;
  throw new Error(explainFirebaseFailure(await errorMessage(created)));
}

async function writeSiteDoc(content: AdminContent, token: string) {
  await patchOrCreateSite(
    {
      json: { stringValue: JSON.stringify(content) },
      updatedAt: { stringValue: content.updatedAt },
      schema: { stringValue: "embedded-v1" },
    },
    token,
  );
}

function assertFresh(live: AdminContent, expectedUpdatedAt: string) {
  if (live.updatedAt !== expectedUpdatedAt) {
    throw new StaleContentError(live);
  }
}

export async function writeCmsContent(
  content: AdminContent,
  token: string,
  expectedUpdatedAt: string,
) {
  const { content: live } = await readCmsState();
  assertFresh(live, expectedUpdatedAt);

  const now = new Date().toISOString();
  const next = { ...content, updatedAt: now };
  await writeSiteDoc(next, token);
}

export async function deleteCmsCase(id: string, token: string, expectedUpdatedAt: string) {
  const { content: live } = await readCmsState();
  assertFresh(live, expectedUpdatedAt);
  const now = new Date().toISOString();
  const next: AdminContent = {
    ...live,
    cases: live.cases.filter((item) => item.id !== id),
    updatedAt: now,
  };

  await writeSiteDoc(next, token);
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
