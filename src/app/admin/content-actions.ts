"use server";

import { getAdminSession } from "@/lib/admin-session";
import { defaultContent, mergeContent, type AdminContent, type AdminImage } from "@/lib/admin-content";
import { checkCloudinary, createDirectUpload, uploadStoredImage } from "@/lib/cloudinary";
import { checkFirestore } from "@/lib/firebase-data";
import { readSiteContent, writeSiteContent } from "@/lib/site-store";

export async function loadSiteContent() {
  const session = await getAdminSession();
  if (!session) return defaultContent();
  return readSiteContent();
}

export async function saveSiteContent(content: AdminContent) {
  const session = await getAdminSession();
  if (!session) return { ok: false as const, error: "Sign in again." };

  try {
    const stored = await writeSiteContent(mergeContent(defaultContent(), content));
    return { ok: true as const, content: stored };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "This change could not be saved.",
    };
  }
}

export async function createMediaUpload(kind: "image" | "video") {
  const session = await getAdminSession();
  if (!session) return { ok: false as const, error: "Sign in again." };

  try {
    return { ok: true as const, ticket: await createDirectUpload(kind) };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "The upload could not start.",
    };
  }
}

export async function uploadAdminImage(image: AdminImage) {
  const session = await getAdminSession();
  if (!session) return { ok: false as const, error: "Sign in again." };
  if (!image.src.startsWith("data:")) return { ok: true as const, image };

  try {
    return { ok: true as const, image: await uploadStoredImage(image) };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "That image could not be uploaded.",
    };
  }
}

export async function backendStatus() {
  const [firestore, cloudinary] = await Promise.all([checkFirestore(), checkCloudinary()]);
  return { firestore, cloudinary };
}
