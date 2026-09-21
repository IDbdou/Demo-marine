import Image from "next/image";
import { findPublicFile } from "@/lib/assets";
import { cn } from "@/lib/cn";

/**
 * Logo partenaire : lit public/logos/<name>.(svg|png|webp). Si le fichier est absent,
 * affiche un libellé propre à la place. TODO(logo) : déposer les logos officiels dans public/logos/.
 */
export function Logo({
  name,
  alt,
  label,
  height = 40,
  className,
}: {
  name: "anda" | "usee" | "halieutis";
  alt: string;
  label: string;
  height?: number;
  className?: string;
}) {
  const src = findPublicFile("logos", name, ["svg", "png", "webp"]);
  if (!src) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "inline-flex items-center rounded-md border border-current/40 px-3 py-1 text-sm font-bold tracking-wide",
          className,
        )}
      >
        {label}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={height * 3}
      height={height}
      unoptimized={src.endsWith(".svg")}
      className={cn("w-auto", className)}
      style={{ height }}
    />
  );
}
