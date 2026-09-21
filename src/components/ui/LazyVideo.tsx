"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import { fr } from "@/content/fr";

/** Vidéo chargée à la demande : aucun octet vidéo/iframe avant le clic, pas d'autoplay. */
export function LazyVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [active, setActive] = useState(false);
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(src);

  if (active) {
    return isFile ? (
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster || undefined}
        controls
        autoPlay
        playsInline
        title={title}
      />
    ) : (
      <iframe
        className="h-full w-full"
        src={src}
        title={title}
        allow="fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={fr.hero.videoOpen}
      className="group bg-navy-deep relative flex h-full w-full items-center justify-center"
    >
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover opacity-80"
        />
      )}
      <span className="text-navy relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-105">
        <Play aria-hidden="true" className="ml-1 h-7 w-7" fill="currentColor" />
      </span>
    </button>
  );
}
