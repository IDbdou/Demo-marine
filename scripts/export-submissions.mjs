// Génère storage/submissions.csv à partir de storage/submissions/*/data.json
// Usage : npm run export:submissions   (SUBMISSIONS_DIR pour changer le dossier source)
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.env.SUBMISSIONS_DIR ?? path.join(process.cwd(), "storage", "submissions");
if (!existsSync(root)) {
  console.error(`Aucun dossier de candidatures : ${root}`);
  process.exit(1);
}

const columns = [
  "reference", "submittedAt", "profil", "nom", "email", "telephone", "ville", "structure",
  "titreProjet", "axe", "stade", "prixVises", "videoMode", "videoUrl", "resume", "fichiers",
];

// Neutralise l'injection de formules (=, +, -, @) à l'ouverture dans un tableur, et échappe les guillemets.
const cell = (v) => {
  let s = Array.isArray(v) ? v.join(" | ") : String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
};

const rows = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^MMAIN1-\d{4}-\d{4}$/.test(d.name))
  .map((d) => JSON.parse(readFileSync(path.join(root, d.name, "data.json"), "utf8")))
  .sort((a, b) => a.reference.localeCompare(b.reference))
  .map((r) => columns.map((c) => cell(c === "fichiers" ? (r.files ?? []).map((f) => f.file) : r[c])).join(";"));

const out = path.join(path.dirname(root), "submissions.csv");
// BOM UTF-8 pour un affichage correct des accents dans Excel ; séparateur « ; » (Excel FR).
writeFileSync(out, "﻿" + [columns.join(";"), ...rows].join("\r\n"), "utf8");
console.log(`${rows.length} candidature(s) exportée(s) → ${out}`);
