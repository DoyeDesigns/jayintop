"use client";

import { useRef, useState } from "react";
import { ContentImage } from "@/components/content-image";
import { videoView } from "@/lib/video";

export type HomeVideoContent = {
  posterSrc: string;
  videoSrc: string;
  label: string;
};

export function HomeVideo({ posterSrc, videoSrc, label }: HomeVideoContent) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!posterSrc && !videoSrc) return null;

  const parsed = videoSrc ? videoView(videoSrc, { autoplay: true }) : null;

  async function play() {
    if (!videoSrc || !parsed) return;
    setPlaying(true);
    if (parsed.kind === "file" && videoRef.current) {
      try {
        await videoRef.current.play();
      } catch {
        setPlaying(false);
      }
    }
  }

  return (
    <section className="relative left-1/2 -ml-[50vw] w-screen bg-[#131313] px-4 py-16 md:px-[30px] md:py-24">
      <div className="relative mx-auto w-full max-w-[1380px] overflow-hidden rounded-[4px]">
        <div className="relative aspect-[16/9] w-full bg-[#1A1A1A]">
          {playing && parsed?.kind === "embed" ? (
            <iframe
              src={parsed.src}
              title="Home video"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : null}

          {parsed?.kind === "file" ? (
            <video
              ref={videoRef}
              src={parsed.src}
              poster={posterSrc || undefined}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                playing ? "opacity-100" : "opacity-0"
              }`}
              playsInline
              controls={playing}
              onEnded={() => setPlaying(false)}
            />
          ) : null}

          {!playing ? (
            <>
              {posterSrc ? (
                <ContentImage
                  src={posterSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1380px) 1380px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[#1A1A1A]" />
              )}
              <div className="absolute inset-0 bg-black/55" />
              <button
                type="button"
                onClick={() => void play()}
                disabled={!videoSrc}
                className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-tl-[12px] rounded-bl-[12px] rounded-tr-[1000px] rounded-br-[1000px] bg-brand px-8 py-3 font-tanker text-[28px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase transition-colors duration-200 hover:bg-brand/70 disabled:cursor-not-allowed disabled:opacity-60 md:px-10 md:py-3.5 md:text-[30px]"
              >
                {label || "Play"}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
