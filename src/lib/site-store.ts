import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminIdToken } from "@/lib/admin-session";
import { defaultContent, mergeContent, type AdminContent } from "@/lib/admin-content";
import { storeContentImages } from "@/lib/cloudinary";
import {
  deleteCmsCase,
  hasFirebaseEnv,
  readCmsContent,
  StaleContentError,
  writeCmsContent,
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

function imageSrcs(content: AdminContent) {
  const srcs: string[] = [];
  function walk(value: unknown) {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && "name" in record) {
      srcs.push(record.src);
      return;
    }
    Object.values(record).forEach(walk);
  }
  walk(content);
  return srcs;
}

function hasDataImage(content: AdminContent) {
  return imageSrcs(content).some((src) => src.startsWith("data:"));
}

function liveMatchesWritten(written: AdminContent, live: AdminContent) {
  if (written.cases.length !== live.cases.length) return false;
  if (written.cases.some((item, index) => item.id !== live.cases[index]?.id)) return false;
  const writtenSrcs = imageSrcs(written);
  const liveSrcs = imageSrcs(live);
  return writtenSrcs.length === liveSrcs.length && writtenSrcs.every((src, index) => src === liveSrcs[index]);
}

export { StaleContentError };

export async function readSiteContent() {
  if (hasFirebaseEnv()) {
    return withoutMockCases(await readCmsContent());
  }
  const file = await readFileContent();
  return file ?? defaultContent();
}

export async function writeSiteContent(content: AdminContent) {
  const cleaned = withoutMockCases(content);
  const stored = await storeContentImages(cleaned);
  if (hasDataImage(stored)) {
    throw new Error("An image is still a local data URL. Upload it before saving.");
  }

  if (!hasFirebaseEnv()) {
    stored.updatedAt = new Date().toISOString();
    await writeLocalFile(contentPath, JSON.stringify(stored));
    return stored;
  }

  const token = await getAdminIdToken();
  if (!token) throw new Error("Sign in again.");

  await writeCmsContent(stored, token, stored.updatedAt);
  const live = withoutMockCases(await readCmsContent());
  if (!liveMatchesWritten({ ...stored, updatedAt: live.updatedAt }, live)) {
    throw new Error("Live Firebase data does not match what was saved.");
  }
  return live;
}

export async function deleteSiteCase(id: string, expectedUpdatedAt: string) {
  if (!hasFirebaseEnv()) {
    const current = await readSiteContent();
    const next = {
      ...current,
      cases: current.cases.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    };
    await writeLocalFile(contentPath, JSON.stringify(next));
    return next;
  }

  const token = await getAdminIdToken();
  if (!token) throw new Error("Sign in again.");
  await deleteCmsCase(id, token, expectedUpdatedAt);
  return withoutMockCases(await readCmsContent());
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
