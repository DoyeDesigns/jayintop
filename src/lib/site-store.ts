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
  await mkdir(path.dirname(contentPath), { recursive: true });
  await writeFile(contentPath, JSON.stringify(cleaned));

  const token = await getAdminIdToken();
  if (!token) throw new Error("Sign in again.");

  const stored = await storeContentImages(cleaned);
  await writeFirestoreContent(stored, token);
  await writeFile(contentPath, JSON.stringify(stored));
  return stored;
}

export async function saveContactMessage(message: ContactMessage) {
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
  try {
    await writeFirestoreMessage(message);
  } catch (error) {
    const text = error instanceof Error ? error.message : "";
    if (!text.includes("not created yet")) throw error;
  }
}
