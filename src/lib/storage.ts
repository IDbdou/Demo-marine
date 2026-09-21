import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { EDITION_YEAR, REFERENCE_PREFIX } from "@/config/site";

/**
 * Stockage des candidatures, isolé derrière une interface simple.
 * Implémentation par défaut : dossiers sur disque (hors de public/). Pour S3, une base de données ou
 * Google Drive : implémenter `SubmissionStorage` et changer `getStorage()` (voir README).
 */
export class DuplicateSubmissionError extends Error {
  constructor() {
    super("Une candidature existe déjà pour cette adresse e-mail.");
    this.name = "DuplicateSubmissionError";
  }
}

export type SubmissionFile = {
  field: string;
  /** Nom de stockage généré par le serveur (jamais issu de l'utilisateur). */
  storedName: string;
  originalName: string;
  mime: string;
  buffer: Buffer;
};

export type SubmissionInput = {
  /** E-mail normalisé (minuscules, trim). */
  email: string;
  data: Record<string, unknown>;
  files: SubmissionFile[];
};

export interface SubmissionStorage {
  existsByEmail(email: string): Promise<boolean>;
  /** Enregistre le dossier ; lève `DuplicateSubmissionError` si l'e-mail est déjà pris. */
  saveSubmission(input: SubmissionInput): Promise<{ reference: string }>;
}

const REF_RE = new RegExp(`^${REFERENCE_PREFIX}-${EDITION_YEAR}-(\\d{4})$`);

export class FileSystemStorage implements SubmissionStorage {
  constructor(private readonly root: string) {}

  private emailKey(email: string): string {
    return createHash("sha256").update(email).digest("hex");
  }
  private indexFile(email: string): string {
    return path.join(/*turbopackIgnore: true*/ this.root, "_index", `${this.emailKey(email)}.json`);
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      await fs.access(this.indexFile(email));
      return true;
    } catch {
      return false;
    }
  }

  private async claimReference(): Promise<{ reference: string; dir: string }> {
    await fs.mkdir(this.root, { recursive: true });
    const entries = await fs.readdir(this.root);
    let n = entries.reduce((max, e) => Math.max(max, Number(REF_RE.exec(e)?.[1] ?? 0)), 0) + 1;
    for (let attempt = 0; attempt < 50; attempt++, n++) {
      const reference = `${REFERENCE_PREFIX}-${EDITION_YEAR}-${String(n).padStart(4, "0")}`;
      const dir = path.join(/*turbopackIgnore: true*/ this.root, reference);
      try {
        await fs.mkdir(dir); // atomique : échoue si le dossier existe (envois simultanés)
        return { reference, dir };
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
      }
    }
    throw new Error("Impossible de réserver un numéro de référence.");
  }

  async saveSubmission(input: SubmissionInput): Promise<{ reference: string }> {
    await fs.mkdir(path.join(/*turbopackIgnore: true*/ this.root, "_index"), { recursive: true });
    const indexFile = this.indexFile(input.email);
    try {
      await fs.writeFile(indexFile, "", { flag: "wx" }); // réservation atomique de l'e-mail
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "EEXIST") throw new DuplicateSubmissionError();
      throw e;
    }

    let dir: string | null = null;
    try {
      const claimed = await this.claimReference();
      dir = claimed.dir;
      const stored = [];
      for (const f of input.files) {
        await fs.writeFile(path.join(/*turbopackIgnore: true*/ dir, f.storedName), f.buffer);
        stored.push({
          field: f.field,
          file: f.storedName,
          originalName: f.originalName,
          mime: f.mime,
          size: f.buffer.length,
        });
      }
      const record = {
        reference: claimed.reference,
        submittedAt: new Date().toISOString(),
        ...input.data,
        files: stored,
      };
      await fs.writeFile(
        path.join(/*turbopackIgnore: true*/ dir, "data.json"),
        JSON.stringify(record, null, 2),
        "utf8",
      );
      await fs.writeFile(indexFile, claimed.reference, "utf8");
      return { reference: claimed.reference };
    } catch (e) {
      if (dir) await fs.rm(dir, { recursive: true, force: true });
      await fs.rm(indexFile, { force: true });
      throw e;
    }
  }
}

let instance: SubmissionStorage | null = null;

/** Point d'entrée unique : remplacer ici l'implémentation pour brancher S3 / une base / Drive. */
export function getStorage(): SubmissionStorage {
  instance ??= new FileSystemStorage(
    process.env.SUBMISSIONS_DIR ?? path.join(process.cwd(), "storage", "submissions"),
  );
  return instance;
}
