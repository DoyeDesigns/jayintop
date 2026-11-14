"use server";

import { getAdminSession } from "@/lib/admin-session";
import { defaultContent, mergeContent, type AdminContent, type AdminImage } from "@/lib/admin-content";
import { checkCloudinary, createDirectUpload, uploadStoredImage } from "@/lib/cloudinary";
import { checkFirestore } from "@/lib/firebase-data";
import { readSiteContent, writeSiteContent } from "@/lib/site-store";

export async function loadSiteContent() {
  const session = await getAdminSession();
  if (!session) {
    // #region agent log
    fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
      body: JSON.stringify({
        sessionId: "48b4d3",
        runId: "pre-fix",
        hypothesisId: "C",
        location: "content-actions.ts:loadSiteContent",
        message: "load returned defaults because no session",
        data: { session: false },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return defaultContent();
  }
  return readSiteContent();
}

export async function saveSiteContent(content: AdminContent) {
  const session = await getAdminSession();
  if (!session) return { ok: false as const, error: "Sign in again." };

  try {
    const merged = mergeContent(defaultContent(), content);
    // #region agent log
    fetch("http://127.0.0.1:7408/ingest/f2f8dbe8-7d28-471f-bb2d-6476fc74336b", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "48b4d3" },
      body: JSON.stringify({
        sessionId: "48b4d3",
        runId: "pre-fix",
        hypothesisId: "C",
        location: "content-actions.ts:saveSiteContent",
        message: "save incoming vs merged images",
        data: {
          incomingCases: content.cases.length,
          mergedCases: merged.cases.length,
          incomingHero: content.home.heroImage?.src?.slice(0, 90) ?? null,
          mergedHero: merged.home.heroImage?.src?.slice(0, 90) ?? null,
          incomingBelief: content.home.beliefImage?.src?.slice(0, 90) ?? null,
          mergedBelief: merged.home.beliefImage?.src?.slice(0, 90) ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    const stored = await writeSiteContent(merged);
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
