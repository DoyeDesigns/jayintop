import Image from "next/image";
import { mediaSrc, PLACEHOLDER_IMAGE } from "@/lib/media";

export function ContentImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const resolved = mediaSrc(src);
  const uploaded = resolved.startsWith("data:") || resolved.startsWith("blob:");
  const plain = uploaded || resolved === PLACEHOLDER_IMAGE || resolved.endsWith(".svg");

  if (plain && fill) {
    return (
      <img
        src={resolved}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`}
      />
    );
  }

  if (plain) {
    return (
      <img
        src={resolved}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width ?? 0}
      height={height ?? 0}
      className={className}
    />
  );
}
