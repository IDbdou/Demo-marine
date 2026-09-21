// Captures pleine page + contrôle du débordement horizontal.
// Usage : node scripts/shots.mjs [baseUrl] [label] [largeurs séparées par des virgules]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const label = process.argv[3] ?? "default";
const widths = (process.argv[4] ?? "360,768,1440").split(",").map(Number);
mkdirSync("shots", { recursive: true });

const browser = await chromium.launch();
for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 700 ? 780 : 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.screenshot({ path: `shots/${label}-${width}-fold.png` });
  await page.screenshot({ path: `shots/${label}-${width}-full.png`, fullPage: true });
  console.log(`${label} @${width}px overflow-x=${overflow}px`);
  await ctx.close();
}
await browser.close();
