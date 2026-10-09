export type VideoView =
  | { kind: "embed"; src: string; provider: "youtube" | "vimeo" | "drive" }
  | { kind: "file"; src: string };

const LINK_HOST =
  /youtube\.com|youtu\.be|vimeo\.com|drive\.google\.com|docs\.google\.com/i;

export function isVideoLink(url: string) {
  return LINK_HOST.test(url);
}

export function videoView(url: string, options?: { autoplay?: boolean }): VideoView {
  const autoplay = options?.autoplay ? "1" : "0";
  const trimmed = url.trim();

  const youtube = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/,
  );
  if (youtube) {
    const params = new URLSearchParams({
      autoplay,
      rel: "0",
      modestbranding: "1",
    });
    return {
      kind: "embed",
      provider: "youtube",
      src: `https://www.youtube.com/embed/${youtube[1]}?${params}`,
    };
  }

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    const params = new URLSearchParams({ autoplay });
    return {
      kind: "embed",
      provider: "vimeo",
      src: `https://player.vimeo.com/video/${vimeo[1]}?${params}`,
    };
  }

  const drive =
    trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/) ||
    trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/) ||
    trimmed.match(/docs\.google\.com\/file\/d\/([^/]+)/);
  if (drive) {
    return {
      kind: "embed",
      provider: "drive",
      src: `https://drive.google.com/file/d/${drive[1]}/preview`,
    };
  }

  return { kind: "file", src: trimmed };
}
