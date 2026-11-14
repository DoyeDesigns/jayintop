import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminIdToken } from "@/lib/admin-session";
import { defaultContent, mergeContent, type AdminContent } from "@/lib/admin-content";
import { storeContentImages } from "@/lib/cloudinary";
import {
  readFirestoreContent,
  writeFirestoreContent,
  writeFirestoreMessage,
} from "@/lib/firebase-data";

const mockCaseTitles = new Set(["magic", "frostflow", "gatewayshield", "lyflo"]);

function withoutMockCases(content: AdminContent) {
  return {
    ...content,
    cases: content.cases.filter(
      (item) => !mockCaseTitles.has(item.title.trim().toLowerCase()),
    ),
  };
}

const contentPath = path.join(process.cwd(), "data", "site-content.json");
const messagesPath = path.join(process.cwd(), "data", "messages.json");

export type ContactMessage = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

function isReadOnlyDisk(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return code === "ENOENT" || code === "EROFS" || code === "EACCES" || code === "EPERM";
}

async function writeLocalFile(filePath: string, contents: string) {
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents);
  } catch (error) {
    if (!isReadOnlyDisk(error)) throw error;
  }
}

async function readFileContent() {
  try {
    const raw = await readFile(contentPath, "utf8");
    return withoutMockCases(mergeContent(defaultContent(), JSON.parse(raw)));
  } catch {
    return null;
  }
}

function imageSummary(content: AdminContent) {
  const kinds = { empty: 0, data: 0, cloudinary: 0, local: 0, placeholder: 0, other: 0 };
  function kind(src: string) {
    if (!src) return "empty" as const;
    if (src.startsWith("data:")) return "data" as const;
    if (src.includes("res.cloudinary.com")) return "cloudinary" as const;
    if (src.includes("placeholder")) return "placeholder" as const;
    if (src.startsWith("/")) return "local" as const;
    return "other" as const;
  }
  function walk(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && "name" in record) {
      kinds[kind(record.src)] += 1;
      return;
    }
    Object.values(record).forEach(walk);
  }
  walk(content);
  return {
    kinds,
    cases: content.cases.length,
    hero: content.home.heroImage?.src?.slice(0, 90) ?? null,
    belief: content.home.beliefImage?.src?.slice(0, 90) ?? null,
    firstCover: content.cases[0]?.cover?.src?.slice(0, 90) ?? null,
  };
}

export async function readSiteContent() {
  const raw = await readFirestoreContent().catch(() => null);
  if (raw) {
    try {
      const content = withoutMockCases(mergeContent(defaultContent(), JSON.parse(raw)));
      // #region agent log
      fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
        body: JSON.stringify({
          sessionId: "48b4d3",
          runId: "pre-fix",
          hypothesisId: "A",
          location: "site-store.ts:readSiteContent",
          message: "read source firestore",
          data: { source: "firestore", bytes: raw.length, ...imageSummary(content) },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return content;
    } catch {
      const file = await readFileContent();
      // #region agent log
      fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
        body: JSON.stringify({
          sessionId: "48b4d3",
          runId: "pre-fix",
          hypothesisId: "A",
          location: "site-store.ts:readSiteContent",
          message: "firestore json parse failed",
          data: { source: file ? "file-after-parse-fail" : "default-after-parse-fail", bytes: raw.length },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return file ?? defaultContent();
    }
  }
  const file = await readFileContent();
  const content = file ?? defaultContent();
  // #region agent log
  fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
    body: JSON.stringify({
      sessionId: "48b4d3",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "site-store.ts:readSiteContent",
      message: "read fallback without firestore",
      data: { source: file ? "file" : "default", ...imageSummary(content) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return content;
}

export async function writeSiteContent(content: AdminContent) {
  const cleaned = withoutMockCases(content);
  const token = await getAdminIdToken();
  if (!token) throw new Error("Sign in again.");

  const stored = await storeContentImages(cleaned);
  // #region agent log
  fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
    body: JSON.stringify({
      sessionId: "48b4d3",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "site-store.ts:writeSiteContent",
      message: "write after cloudinary walk",
      data: {
        jsonBytes: JSON.stringify(stored).length,
        over1mb: JSON.stringify(stored).length > 1_000_000,
        ...imageSummary(stored),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  await writeFirestoreContent(stored, token);
  await writeLocalFile(contentPath, JSON.stringify(stored));
  return stored;
}

export async function saveContactMessage(message: ContactMessage) {
  let storedLocally = false;
  try {
    await mkdir(path.dirname(messagesPath), { recursive: true });
    let messages: ContactMessage[] = [];
    try {
      messages = JSON.parse(await readFile(messagesPath, "utf8")) as ContactMessage[];
      if (!Array.isArray(messages)) messages = [];
    } catch {
      messages = [];
    }
    messages.push(message);
    await writeFile(messagesPath, JSON.stringify(messages, null, 2));
    storedLocally = true;
  } catch (error) {
    if (!isReadOnlyDisk(error)) throw error;
  }

  try {
    await writeFirestoreMessage(message);
  } catch (error) {
    const text = error instanceof Error ? error.message : "";
    if (text.includes("not created yet") && storedLocally) return;
    throw error;
  }
}
