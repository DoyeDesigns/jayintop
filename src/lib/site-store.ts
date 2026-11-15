import { mkdir, readFile, writeFile } from "node:fs/promises";
import { cache } from "react";
import path from "node:path";
import { getAdminIdToken } from "@/lib/admin-session";
import { defaultContent, mergeContent, type AdminContent } from "@/lib/admin-content";
import { storeContentImages } from "@/lib/cloudinary";
import {
  hasFirebaseEnv,
  readCmsContent,
  StaleContentError,
  writeCmsContent,
  writeFirestoreMessage,
} from "@/lib/firebase-data";

export function usesLocalContentFile() {
  return !hasFirebaseEnv();
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
    const content = mergeContent(defaultContent(), JSON.parse(raw));
    return { ...content, revision: content.updatedAt || "local" };
  } catch {
    return null;
  }
}

function contentSnapshot(content: AdminContent) {
  const normalized = mergeContent(defaultContent(), content);
  const { updatedAt: _updatedAt, revision: _revision, ...rest } = normalized;
  return JSON.stringify(rest);
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
  return contentSnapshot(written) === contentSnapshot(live);
}

export { StaleContentError };

export const readSiteContent = cache(async function readSiteContent() {
  if (hasFirebaseEnv()) return readCmsContent();
  const file = await readFileContent();
  return file ?? defaultContent();
});

export async function writeSiteContent(content: AdminContent) {
  const stored = await storeContentImages(content);
  if (hasDataImage(stored)) {
    throw new Error("An image is still a local data URL. Upload it before saving.");
  }

  if (!hasFirebaseEnv()) {
    const current = await readFileContent();
    if (current && current.revision !== content.revision) {
      throw new StaleContentError(current);
    }
    const now = new Date().toISOString();
    const { revision: _revision, ...body } = stored;
    const next = { ...body, updatedAt: now, revision: now };
    await writeLocalFile(contentPath, JSON.stringify({ ...body, updatedAt: now }));
    return next;
  }

  const token = await getAdminIdToken();
  if (!token) throw new Error("Sign in again.");

  await writeCmsContent(stored, token, stored.revision);
  const live = await readCmsContent();
  if (!liveMatchesWritten(stored, live)) {
    throw new Error("Live Firebase data does not match what was saved.");
  }
  return live;
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
