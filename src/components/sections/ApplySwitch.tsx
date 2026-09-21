"use client";

import { Lock, CircleCheck } from "lucide-react";
import { fr } from "@/content/fr";
import { usePhase } from "@/components/PhaseProvider";
import { Button } from "@/components/ui/Button";
import { LazyApplicationForm } from "@/components/form/LazyApplicationForm";

/** Contenu de la section formulaire selon la phase : verrouillé, actif ou clos. */
export function ApplySwitch() {
  const phase = usePhase();
  const a = fr.apply;

  if (phase === "avant-ouverture") {
    return (
      <div className="card mx-auto max-w-3xl p-7 sm:p-9" role="status">
        <div className="flex items-start gap-4">
          <span className="bg-blue-soft text-blue-strong flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <Lock aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="text-xl font-bold">{a.lockedBeforeTitle}</h3>
            <p className="text-muted mt-2">{a.lockedBeforeText}</p>
            <Button href="#contact" variant="secondary" className="mt-5">
              {a.beforeCta}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (phase === "clos") {
    return (
      <div className="card mx-auto max-w-3xl p-7 sm:p-9" role="status">
        <div className="flex items-start gap-4">
          <span className="bg-blue-soft text-navy flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <CircleCheck aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="text-xl font-bold">{a.closedTitle}</h3>
            <p className="text-muted mt-2">{a.closedText}</p>
            <Button href="#calendrier" variant="secondary" className="mt-5">
              {a.closedCta}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return <LazyApplicationForm />;
}
