"use client";

import { useEffect, useState } from "react";
import { fr } from "@/content/fr";
import { buttonClasses } from "@/components/ui/Button";
import { usePhase } from "@/components/PhaseProvider";

/** Bouton flottant discret sur mobile : visible après le hero, masqué dans la section du formulaire. */
export function FloatingCta() {
  const phase = usePhase();
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const form = document.getElementById("candidature");
    if (!hero || !("IntersectionObserver" in window)) return;
    const a = new IntersectionObserver(([e]) => setHeroVisible(e?.isIntersecting ?? true), {
      threshold: 0.1,
    });
    a.observe(hero);
    const b = form
      ? new IntersectionObserver(([e]) => setFormVisible(e?.isIntersecting ?? false), {
          threshold: 0.05,
        })
      : null;
    if (form && b) b.observe(form);
    return () => {
      a.disconnect();
      b?.disconnect();
    };
  }, []);

  if (phase === "clos" || heroVisible || formVisible) return null;
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center lg:hidden">
      <a
        href="#candidature"
        className={buttonClasses("primary", "md", "pointer-events-auto shadow-lg")}
      >
        {fr.floatingCta}
      </a>
    </div>
  );
}
