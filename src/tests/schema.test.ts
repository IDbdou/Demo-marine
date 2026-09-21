import { describe, expect, it } from "vitest";
import { normalizePhone, validateForm } from "@/lib/schema";

const pdf = (name = "a.pdf", size = 1000) =>
  new File([new Uint8Array(size).fill(1)], name, { type: "application/pdf" });

const valid = {
  profil: "etudiant",
  nom: "Sara Alaoui",
  email: "sara@example.com",
  telephone: "06 12 34 56 78",
  ville: "Agadir",
  structure: "",
  residence: true,
  titreProjet: "Projet",
  axe: "technologique",
  resume: "x".repeat(320),
  stade: "",
  prixVises: [],
  presentation: pdf("p.pdf"),
  cv: pdf("cv.pdf"),
  videoMode: "link",
  videoUrl: "https://youtu.be/abc",
  legalDocs: [],
  consentRules: true,
  consentData: true,
  consentTruth: true,
};

describe("applicationSchema", () => {
  it("accepte un dossier valide", () => {
    expect(validateForm(valid, "all")).toEqual({});
  });

  it("exige la structure et les documents juridiques pour une startup, même avec d'autres erreurs", () => {
    const r = Object.keys(validateForm({ ...valid, profil: "startup", email: "nope" }, 0));
    expect(r).toContain("email");
    expect(r).toContain("structure");

    const fp = Object.keys(validateForm({ ...valid, profil: "cooperative", cv: undefined }, 2));
    expect(fp).toContain("cv");
    expect(fp).toContain("legalDocs");
  });

  it("rejette mauvais téléphone, résumé trop court, fichier trop gros ou de mauvais format", () => {
    const paths = Object.keys(
      validateForm(
        {
          ...valid,
          telephone: "12345",
          resume: "court",
          presentation: pdf("p.exe"),
          cv: pdf("cv.pdf", 6 * 1024 * 1024),
          residence: false,
        },
        "all",
      ),
    );
    for (const p of ["telephone", "resume", "presentation", "cv", "residence"])
      expect(paths).toContain(p);
  });

  it("valide le mode vidéo", () => {
    expect(validateForm({ ...valid, videoUrl: "http://x.com/v" }, 2)).toHaveProperty("videoUrl");
    expect(validateForm({ ...valid, videoMode: "file" }, 2)).toHaveProperty("videoFile");
  });
});

describe("normalizePhone", () => {
  it("accepte les formats marocains", () => {
    for (const p of ["0612345678", "+212 6 12 34 56 78", "00212712345678", "+212 (0)612345678"]) {
      expect(validateForm({ ...valid, telephone: p }, 0), p).toEqual({});
    }
    expect(normalizePhone("06.12.34.56.78")).toBe("0612345678");
  });
});
