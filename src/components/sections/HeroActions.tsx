"use client";

import { fr } from "@/content/fr";
import { Button } from "@/components/ui/Button";
import { usePhase } from "@/components/PhaseProvider";

/** CTA du hero, adaptés à la phase du concours. */
export function HeroActions() {
  const phase = usePhase();
  const h = fr.hero;
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {phase === "ouvert" && (
        <Button href="#candidature" size="lg" className="w-full sm:w-auto">
          {h.ctaApply}
        </Button>
      )}
      {phase === "avant-ouverture" && (
        <Button href="#contact" size="lg" className="w-full sm:w-auto">
          {h.ctaBefore}
        </Button>
      )}
      {phase === "clos" && (
        <Button href="#calendrier" size="lg" className="w-full sm:w-auto">
          {h.ctaClosed}
        </Button>
      )}
      <Button href="#presentation" variant="secondary-dark" size="lg" className="w-full sm:w-auto">
        {h.ctaMore}
      </Button>
    </div>
  );
}
