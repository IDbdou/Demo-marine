import { describe, expect, it } from "vitest";
import { fr } from "@/content/fr";
import { MILESTONE_DATES } from "@/config/site";

describe("contenu", () => {
  it("la somme des pondérations vaut 100", () => {
    const total = fr.evaluation.criteria.reduce((sum, c) => sum + c.weight, 0);
    expect(total).toBe(100);
  });

  it("la FAQ contient 10 questions", () => {
    expect(fr.faq.items).toHaveLength(10);
  });

  it("chaque jalon du calendrier a une date machine correspondante", () => {
    expect(fr.calendar.milestones.map((m) => m.id)).toEqual(MILESTONE_DATES.map((m) => m.id));
  });

  it("applique l'espace insécable dans « 300 000 DH » et avant les deux-points", () => {
    expect(fr.presentation.keyFigures.items[3]?.value).toBe("300 000 DH");
    expect(fr.presentation.objectivesIntro).toContain(" :");
  });
});
