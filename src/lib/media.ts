export const PLACEHOLDER_IMAGE = "/placeholder.svg";

export function mediaSrc(src?: string | null) {
  const value = (src ?? "").trim();
  return value || PLACEHOLDER_IMAGE;
}
