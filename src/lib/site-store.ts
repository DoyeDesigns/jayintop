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

export async function readSiteContent() {
  const raw = await readFirestoreContent().catch(() => null);
  if (raw) {
    try {
      return withoutMockCases(mergeContent(defaultContent(), JSON.parse(raw)));
    } catch {
      return (await readFileContent()) ?? defaultContent();
    }
  }
  return (await readFileContent()) ?? defaultContent();
}

export async function writeSiteContent(content: AdminContent) {
  const cleaned = withoutMockCases(content);
  const token = await getAdminIdToken();
  if (!token) throw new Error("Sign in again.");

  const stored = await storeContentImages(cleaned);
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
