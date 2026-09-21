import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Wave } from "./Wave";

export type Tone = "white" | "soft" | "sand" | "navy";

const toneBg: Record<Tone, string> = {
  white: "bg-white",
  soft: "bg-blue-soft",
  sand: "bg-sand",
  navy: "bg-navy surface-dark text-white",
};
const toneColor: Record<Tone, string> = {
  white: "text-white",
  soft: "text-blue-soft",
  sand: "text-sand",
  navy: "text-navy",
};

export function Section({
  id,
  title,
  tone = "white",
  wave = true,
  children,
  eyebrow,
  className,
  headingClassName,
}: {
  id: string;
  title: string;
  tone?: Tone;
  wave?: boolean;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("relative py-16 sm:py-20 lg:py-24", toneBg[tone], className)}
    >
      {wave && <Wave className={toneColor[tone]} />}
      <div className="wrap">
        {eyebrow && (
          <p
            className={cn(
              "mb-2 text-sm font-semibold tracking-wider uppercase",
              tone === "navy" ? "text-blue-light" : "text-blue-strong",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          id={`${id}-title`}
          className={cn("text-2xl font-bold sm:text-3xl lg:text-4xl", headingClassName)}
        >
          {title}
        </h2>
        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </section>
  );
}
