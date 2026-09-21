"use client";

import Link from "next/link";
import { fr } from "@/content/fr";
import { buttonClasses } from "@/components/ui/Button";
import { usePhase } from "@/components/PhaseProvider";

/** CTA de l'en-tête : masqué sur petit écran (menu + bouton flottant) et une fois le concours clos. */
export function HeaderCta() {
  const phase = usePhase();
  if (phase === "clos") return null;
  return (
    <div className="hidden sm:block">
      <Link href="/#candidature" className={buttonClasses("primary", "md")}>
        {fr.common.apply}
      </Link>
    </div>
  );
}
