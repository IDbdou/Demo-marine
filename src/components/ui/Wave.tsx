import { cn } from "@/lib/cn";

/** Séparateur en vague discret, posé sur le haut d'une section (la couleur suit `currentColor`). */
export function Wave({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={cn(
        "absolute inset-x-0 top-0 h-6 w-full -translate-y-[calc(100%-1px)] sm:h-9 lg:h-12",
        className,
      )}
    >
      <path
        fill="currentColor"
        d="M0 48V26c120 18 240 22 360 8s240-34 360-30 240 26 360 30 240-8 360-24v38H0Z"
      />
    </svg>
  );
}
