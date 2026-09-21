import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/** Renvoie le chemin public (`/dir/name.ext`) du premier fichier existant, sinon null. */
export function findPublicFile(dir: string, name: string, exts: readonly string[]): string | null {
  for (const ext of exts) {
    const rel = path.join("public", dir, `${name}.${ext}`);
    if (existsSync(path.join(process.cwd(), rel))) return `/${dir}/${name}.${ext}`;
  }
  return null;
}
