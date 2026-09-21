// Captures de la section formulaire (étapes 1, 3 et récapitulatif). Usage : node scripts/form-shots.mjs [baseUrl]
import { chromium } from "@playwright/test";
const base = process.argv[2] ?? "http://localhost:3200";
const b = await chromium.launch();
for (const width of [390, 1440]) {
  const ctx = await b.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: "networkidle" });
  await p.locator("#candidature").scrollIntoViewIfNeeded();
  await p.locator("#f-profil").waitFor({ timeout: 20000 });
  await p.getByRole("button", { name: "Continuer" }).click();
  await p.waitForTimeout(400);
  await p.locator("#candidature").screenshot({ path: `shots/form-${width}-step1-errors.png` });
  await p.locator("#f-profil").selectOption("startup");
  await p.locator("#f-nom").fill("Sara Alaoui");
  await p.locator("#f-email").fill("sara@example.com");
  await p.locator("#f-telephone").fill("0612345678");
  await p.locator("#f-residence").check();
  await p.getByRole("button", { name: "Continuer" }).click();
  await p.waitForTimeout(300);
  await p.locator("#candidature").screenshot({ path: `shots/form-${width}-step1-startup.png` });
  await ctx.close();
}
await b.close();
console.log("ok");
