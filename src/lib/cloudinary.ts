import { createHash } from "node:crypto";
import type { AdminContent, AdminImage } from "@/lib/admin-content";

export type CloudinaryState = "ready" | "missing" | "denied";

function config() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

function sign(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(payload + apiSecret).digest("hex");
}

export async function checkCloudinary(): Promise<CloudinaryState> {
  const keys = config();
  if (!keys) return "missing";

  const response = await fetch(`https://api.cloudinary.com/v1_1/${keys.cloudName}/usage`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${keys.apiKey}:${keys.apiSecret}`).toString("base64")}`,
    },
    cache: "no-store",
  });

  if (response.ok) return "ready";
  if (response.status === 401 || response.status === 403) return "denied";
  return "missing";
}

export async function uploadStoredImage(image: AdminImage) {
  if (!image.src.startsWith("data:")) return image;

  const keys = config();
  if (!keys) {
    throw new Error(
      "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local, then restart the dev server.",
    );
  }

  const timestamp = String(Math.round(Date.now() / 1000));
  const folder = "jayintop";
  const body = new FormData();
  body.set("file", image.src);
  body.set("api_key", keys.apiKey);
  body.set("timestamp", timestamp);
  body.set("folder", folder);
  body.set("signature", sign({ folder, timestamp }, keys.apiSecret));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${keys.cloudName}/image/upload`,
    { method: "POST", body, cache: "no-store" },
  );
  const payload = (await response.json().catch(() => null)) as {
    secure_url?: string;
    width?: number;
    height?: number;
    error?: { message?: string };
  } | null;

  if (!response.ok || !payload?.secure_url) {
    throw new Error(payload?.error?.message || "Cloudinary could not store that image.");
  }

  return {
    ...image,
    src: payload.secure_url,
    w: payload.width || image.w,
    h: payload.height || image.h,
  };
}

function isAdminImage(value: unknown): value is AdminImage {
  if (!value || typeof value !== "object") return false;
  const image = value as Record<string, unknown>;
  return typeof image.src === "string" && typeof image.name === "string";
}

export async function storeContentImages(content: AdminContent) {
  async function walk(value: unknown): Promise<unknown> {
    if (Array.isArray(value)) return Promise.all(value.map((item) => walk(item)));
    if (isAdminImage(value)) return uploadStoredImage(value);
    if (value && typeof value === "object") {
      const next: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(value)) {
        next[key] = await walk(child);
      }
      return next;
    }
    return value;
  }

  return (await walk(content)) as AdminContent;
}
