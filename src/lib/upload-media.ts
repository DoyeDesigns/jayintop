import { createMediaUpload } from "@/app/admin/content-actions";
import type { AdminImage } from "@/lib/admin-content";

export const imageMaxBytes = 9 * 1024 * 1024;
export const videoMaxBytes = 99 * 1024 * 1024;

export async function uploadMediaFile(file: File, kind: "image" | "video"): Promise<AdminImage> {
  const max = kind === "image" ? imageMaxBytes : videoMaxBytes;
  const limit = kind === "image" ? "9 MB" : "99 MB";
  if (file.size > max) {
    throw new Error(`That ${kind} is too large. The limit is ${limit}.`);
  }
  if (kind === "image" && !file.type.startsWith("image/")) {
    throw new Error("That is not an image file.");
  }
  if (kind === "video" && !file.type.startsWith("video/")) {
    throw new Error("That is not a video file.");
  }

  const started = await createMediaUpload(kind);
  if (!started.ok) throw new Error(started.error);

  const { cloudName, apiKey, timestamp, folder, signature } = started.ticket;
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", apiKey);
  body.set("timestamp", timestamp);
  body.set("folder", folder);
  body.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${kind}/upload`,
    { method: "POST", body },
  );
  const payload = (await response.json().catch(() => null)) as {
    secure_url?: string;
    width?: number;
    height?: number;
    error?: { message?: string };
  } | null;

  if (!response.ok || !payload?.secure_url) {
    throw new Error(payload?.error?.message || `That ${kind} could not be uploaded.`);
  }

  return {
    src: payload.secure_url,
    name: file.name.replace(/\.[^.]+$/, ""),
    w: payload.width || 0,
    h: payload.height || 0,
  };
}
