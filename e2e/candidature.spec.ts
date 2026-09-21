import { rmSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const pdf = (pages = 2) =>
  Buffer.from(
    "%PDF-1.4\n" +
      "1 0 obj<</Type /Pages /Count " +
      pages +
      ">>endobj\n" +
      Array.from({ length: pages }, (_, i) => `${i + 2} 0 obj<</Type /Page>>endobj\n`).join("") +
      "%%EOF",
  );

const file = (name: string, buffer: Buffer, mimeType = "application/pdf") => ({
  name,
  mimeType,
  buffer,
});

test.beforeAll(() => {
  rmSync("./storage/e2e", { recursive: true, force: true });
});

async function fillCandidate(page: Page, email: string, profil = "etudiant") {
  await page.locator("#f-profil").selectOption(profil);
  await page.locator("#f-nom").fill("Sara Alaoui");
  await page.locator("#f-email").fill(email);
  await page.locator("#f-telephone").fill("06 12 34 56 78");
  await page.locator("#f-ville").fill("Agadir");
  await page.locator("#f-residence").check();
}

async function fillProject(page: Page) {
  await page.locator("#f-titreProjet").fill("Monitoring des cages par capteurs");
  await page.getByRole("radio", { name: "Innovation technologique" }).check();
  await page
    .locator("#f-resume")
    .fill("Un système de capteurs immergés pour suivre la qualité de l’eau. ".repeat(6));
  await page.locator("#f-stade").selectOption("prototype");
}

test("parcours complet : candidature valide → page de remerciement avec référence", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#candidature").scrollIntoViewIfNeeded();

  // Étape 1 : erreurs à la validation à vide, avec résumé et focus sur le premier champ.
  await page.getByRole("button", { name: "Continuer" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Le formulaire contient des erreurs" }),
  ).toBeVisible();
  await expect(page.locator("#f-profil")).toBeFocused();
  await expect(page.locator("#f-profil")).toHaveAttribute("aria-invalid", "true");

  await fillCandidate(page, "Sara.Alaoui@Example.com");
  await page.getByRole("button", { name: "Continuer" }).click();

  // Étape 2 : résumé trop court refusé.
  await page.locator("#f-titreProjet").fill("Projet");
  await page.getByRole("radio", { name: "Innovation technologique" }).check();
  await page.locator("#f-resume").fill("trop court");
  await page.getByRole("button", { name: "Continuer" }).click();
  await expect(page.locator("#f-resume-err")).toContainText("au moins 300 caractères");
  await fillProject(page);
  await page.getByRole("button", { name: "Continuer" }).click();

  // Étape 3 : fichier trop gros / mauvais format puis fichiers valides.
  await page
    .locator("#f-presentation")
    .locator("xpath=preceding-sibling::input[@type='file']")
    .setInputFiles(file("presentation.pdf", pdf(3)));
  await expect(page.getByText("presentation.pdf")).toBeVisible();
  await page
    .locator("#f-cv")
    .locator("xpath=preceding-sibling::input[@type='file']")
    .setInputFiles(file("cv.exe", Buffer.from("MZ"), "application/octet-stream"));
  await expect(page.locator("#f-cv-err")).toContainText("format accepté");
  await page.getByRole("button", { name: "Retirer cv.exe" }).click();
  await page
    .locator("#f-cv")
    .locator("xpath=preceding-sibling::input[@type='file']")
    .setInputFiles(file("cv.pdf", pdf(1)));
  await page.locator("#f-videoUrl").fill("https://youtu.be/exemple");

  // Consentements obligatoires.
  await page.getByRole("button", { name: "Vérifier ma candidature" }).click();
  await expect(page.locator("#f-consentRules-err")).toBeVisible();
  await page.locator("#f-consentRules").check();
  await page.locator("#f-consentData").check();
  await page.locator("#f-consentTruth").check();
  await page.getByRole("button", { name: "Vérifier ma candidature" }).click();

  // Récapitulatif.
  await expect(
    page.getByRole("heading", { name: "Récapitulatif de votre candidature" }),
  ).toBeVisible();
  await expect(page.getByText("Sara Alaoui")).toBeVisible();
  await page.getByRole("button", { name: "Soumettre ma candidature" }).click();

  await page.waitForURL(/\/candidature\/merci\?ref=MMAIN1-2026-\d{4}/);
  await expect(page.getByTestId("reference")).toHaveText(/^MMAIN1-2026-\d{4}$/);
  await expect(page.getByText("Vous recevrez une confirmation par e-mail")).toBeVisible();

  // Brouillon supprimé après envoi.
  const draft = await page.evaluate(() => window.localStorage.getItem("mmain1-draft-v1"));
  expect(draft).toBeNull();
});

test("API : doublon d'e-mail (normalisé), honeypot, origine, fichier falsifié, PDF trop long", async ({
  request,
  baseURL,
}) => {
  const origin = baseURL as string;
  const base = (
    over: Record<string, string | { name: string; mimeType: string; buffer: Buffer }> = {},
  ) => ({
    profil: "etudiant",
    nom: "Test API",
    email: "api@example.com",
    telephone: "0712345678",
    ville: "",
    structure: "",
    residence: "true",
    titreProjet: "Projet API",
    axe: "pratiques",
    resume: "x".repeat(400),
    stade: "",
    videoMode: "link",
    videoUrl: "https://vimeo.com/123",
    consentRules: "true",
    consentData: "true",
    consentTruth: "true",
    presentation: file("p.pdf", pdf(2)),
    cv: file("cv.pdf", pdf(1)),
    ...over,
  });
  const post = (data: ReturnType<typeof base>, headers: Record<string, string> = { origin }) =>
    request.post("/api/candidature", { multipart: data, headers });

  const ok = await post(base());
  expect(ok.status()).toBe(201);

  const dup = await post(base({ email: "  API@Example.com " }));
  expect(dup.status()).toBe(409);
  expect((await dup.json()).code).toBe("duplicate");

  const bot = await post(base({ email: "bot@example.com", company_website: "http://spam" }));
  expect(bot.status()).toBe(201); // succès factice
  const afterBot = await post(base({ email: "bot@example.com" }));
  expect(afterBot.status()).toBe(201); // le bot n'a rien enregistré : l'e-mail est encore libre

  const badOrigin = await post(base({ email: "o@example.com" }), {
    origin: "https://evil.example",
  });
  expect(badOrigin.status()).toBe(403);

  const fake = await post(
    base({ email: "fake@example.com", cv: file("cv.pdf", Buffer.from("MZ pas un pdf")) }),
  );
  expect(fake.status()).toBe(400);
  expect((await fake.json()).fieldErrors.cv).toContain("ne correspond pas");

  const long = await post(
    base({ email: "long@example.com", presentation: file("p.pdf", pdf(12)) }),
  );
  expect(long.status()).toBe(400);
  expect((await long.json()).fieldErrors.presentation).toContain("10 pages");

  const invalid = await post(base({ email: "not-an-email", telephone: "123" }));
  expect(invalid.status()).toBe(400);
  const body = await invalid.json();
  expect(body.fieldErrors).toHaveProperty("email");
  expect(body.fieldErrors).toHaveProperty("telephone");

  const startupNoDocs = await post(base({ email: "s@example.com", profil: "startup" }));
  expect(startupNoDocs.status()).toBe(400);
  expect((await startupNoDocs.json()).fieldErrors).toHaveProperty("legalDocs");
});
