import { z } from "zod";
import { fr } from "@/content/fr";
import { FILE_RULES, FORM_LIMITS, LEGAL_ENTITY_PROFILES } from "@/config/site";
import { fmt } from "@/lib/fmt";

/**
 * Schéma de validation partagé client / serveur.
 * Côté client, une validation par étape (voir `stepSchemas`) ; côté serveur, `applicationSchema` complet.
 */
const E = fr.form.errors;

export const PROFILS = [
  "startup",
  "chercheur",
  "etudiant",
  "entrepreneur",
  "professionnel",
  "cooperative",
] as const;
export const AXES = ["technologique", "durabilite", "pratiques"] as const;
export const STADES = ["idee", "prototype", "pilote", "commercialise"] as const;
export const PRIX_VISES = ["innovation", "durabilite"] as const;
export const VIDEO_MODES = ["link", "file"] as const;

export type Profil = (typeof PROFILS)[number];

export function isLegalEntity(profil: string | undefined): boolean {
  return (LEGAL_ENTITY_PROFILES as readonly string[]).includes(profil ?? "");
}

export function isFileLike(v: unknown): v is File {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as File).name === "string" &&
    typeof (v as File).size === "number" &&
    typeof (v as File).arrayBuffer === "function"
  );
}

export function fileExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i < 0 ? "" : name.slice(i + 1).toLowerCase();
}

const mb = (bytes: number) => Math.round((bytes / (1024 * 1024)) * 10) / 10;

export type FileRule = { maxBytes: number; extensions: readonly string[] };

/** Contrôle taille / extension. Renvoie un message d'erreur ou null. */
export function checkFile(file: File, rule: FileRule): string | null {
  if (file.size === 0) return fmt(E.fileEmpty, { name: file.name });
  if (file.size > rule.maxBytes)
    return fmt(E.fileSize, { name: file.name, size: mb(rule.maxBytes) });
  if (!rule.extensions.includes(fileExtension(file.name))) {
    return fmt(E.fileType, {
      name: file.name,
      types: rule.extensions.map((e) => e.toUpperCase()).join(", "),
    });
  }
  return null;
}

const fileField = z.custom<File>(isFileLike, { error: E.fileRequired });

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Numéros marocains : 06…, 07…, 05… ou +212… / 00212… (avec ou sans espaces, points, tirets). */
export function normalizePhone(raw: string): string {
  return raw.replace(/[\s.\-()]/g, "").replace(/^\+2120/, "+212");
}
const PHONE_RE = /^(?:\+212|00212|0)[5-7]\d{8}$/;

/* ───────── Étape 1 : candidat ───────── */
const candidateShape = {
  profil: z.enum(PROFILS, { error: E.profil }),
  nom: z.string({ error: E.nom }).trim().min(2, E.nom).max(120, E.nom),
  email: z.string({ error: E.email }).trim().max(160, E.email).pipe(z.email(E.email)),
  telephone: z
    .string({ error: E.telephone })
    .refine((v) => PHONE_RE.test(normalizePhone(v)), E.telephone),
  ville: z.string().trim().max(80).default(""),
  structure: z.string().trim().max(120).default(""),
  residence: z.boolean().refine((v) => v === true, E.residence),
};

/* ───────── Étape 2 : projet ───────── */
const projectShape = {
  titreProjet: z
    .string({ error: E.required })
    .trim()
    .min(1, fmt(E.titreProjet, { max: FORM_LIMITS.titleMax }))
    .max(FORM_LIMITS.titleMax, fmt(E.titreProjet, { max: FORM_LIMITS.titleMax })),
  axe: z.enum(AXES, { error: E.axe }),
  resume: z
    .string({ error: E.required })
    .trim()
    .min(FORM_LIMITS.summaryMin, fmt(E.resumeMin, { min: FORM_LIMITS.summaryMin }))
    .max(FORM_LIMITS.summaryMax, fmt(E.resumeMax, { max: FORM_LIMITS.summaryMax })),
  stade: z.union([z.enum(STADES), z.literal("")], { error: E.stade }).default(""),
  prixVises: z.array(z.enum(PRIX_VISES)).default([]),
};

/* ───────── Étape 3 : pièces + consentements ───────── */
const filesShape = {
  profil: z.string(),
  presentation: fileField,
  cv: fileField,
  videoMode: z.enum(VIDEO_MODES, { error: E.videoMode }),
  videoUrl: z.string().trim().default(""),
  videoFile: fileField.optional(),
  legalDocs: z.array(fileField).default([]),
};

const consentShape = {
  consentRules: z.boolean().refine((v) => v === true, E.consentRules),
  consentData: z.boolean().refine((v) => v === true, E.consentData),
  consentTruth: z.boolean().refine((v) => v === true, E.consentTruth),
};

type Add = (path: string, message: string) => void;

function refineCandidate(d: { profil?: string; structure?: string }, add: Add) {
  if (isLegalEntity(d.profil) && !d.structure?.trim()) add("structure", E.structure);
}

function refineFiles(
  d: {
    profil?: string;
    presentation?: File;
    cv?: File;
    videoMode?: string;
    videoUrl?: string;
    videoFile?: File;
    legalDocs?: File[];
  },
  add: Add,
) {
  if (d.presentation) {
    const m = checkFile(d.presentation, FILE_RULES.presentation);
    if (m) add("presentation", m);
  }
  if (d.cv) {
    const m = checkFile(d.cv, FILE_RULES.cv);
    if (m) add("cv", m);
  }
  if (d.videoMode === "link") {
    let ok = false;
    try {
      const u = new URL(d.videoUrl ?? "");
      ok = u.protocol === "https:" && u.hostname.includes(".");
    } catch {
      ok = false;
    }
    if (!ok) add("videoUrl", E.videoUrl);
  } else if (d.videoMode === "file") {
    if (!d.videoFile) add("videoFile", E.videoFile);
    else {
      const m = checkFile(d.videoFile, FILE_RULES.video);
      if (m) add("videoFile", m);
    }
  }
  if (isLegalEntity(d.profil)) {
    const docs = d.legalDocs ?? [];
    if (docs.length === 0) add("legalDocs", E.legalDocs);
  }
  const docs = d.legalDocs ?? [];
  if (docs.length > FILE_RULES.legalDocs.maxFiles) {
    add("legalDocs", fmt(E.fileCount, { count: FILE_RULES.legalDocs.maxFiles }));
  }
  for (const f of docs) {
    const m = checkFile(f, FILE_RULES.legalDocs);
    if (m) {
      add("legalDocs", m);
      break;
    }
  }
}

export const candidateSchema = z.object(candidateShape);
export const projectSchema = z.object(projectShape);
export const filesSchema = z.object({ ...filesShape, ...consentShape });
export const applicationSchema = z.object({
  ...filesShape,
  ...candidateShape,
  ...projectShape,
  ...consentShape,
});

export type FieldErrors = Record<string, string>;
export type StepIndex = 0 | 1 | 2;

/**
 * Validation par étape (ou complète). Les règles conditionnelles sont exécutées même si d'autres champs
 * sont invalides (Zod 4 les ignorerait sinon) : l'utilisateur voit toutes ses erreurs d'un coup.
 * Renvoie la première erreur de chaque champ.
 */
export function validateForm(data: unknown, step: StepIndex | "all"): FieldErrors {
  const errors: FieldErrors = {};
  const add: Add = (path, message) => {
    if (!(path in errors)) errors[path] = message;
  };
  const run = (schema: z.ZodType) => {
    const r = schema.safeParse(data);
    if (!r.success)
      for (const issue of r.error.issues) add(String(issue.path[0] ?? "_"), issue.message);
  };
  const d = (data ?? {}) as Record<string, never>;
  if (step === 0 || step === "all") {
    run(candidateSchema);
    refineCandidate(d, add);
  }
  if (step === 1 || step === "all") run(projectSchema);
  if (step === 2 || step === "all") {
    run(filesSchema);
    refineFiles(d, add);
  }
  return errors;
}
export type ApplicationValues = z.input<typeof applicationSchema>;
export type ApplicationData = z.output<typeof applicationSchema>;

/** Champs (hors fichiers) sauvegardés dans le brouillon local. */
export const DRAFT_FIELDS = [
  "profil",
  "nom",
  "email",
  "telephone",
  "ville",
  "structure",
  "residence",
  "titreProjet",
  "axe",
  "resume",
  "stade",
  "prixVises",
  "videoMode",
  "videoUrl",
  "consentRules",
  "consentData",
  "consentTruth",
] as const satisfies ReadonlyArray<keyof ApplicationValues>;

/** Champs affichés par étape (pour le résumé d'erreurs et le focus). */
export const STEP_FIELDS: ReadonlyArray<ReadonlyArray<keyof ApplicationValues>> = [
  ["profil", "nom", "email", "telephone", "ville", "structure", "residence"],
  ["titreProjet", "axe", "resume", "stade", "prixVises"],
  [
    "presentation",
    "videoMode",
    "videoUrl",
    "videoFile",
    "cv",
    "legalDocs",
    "consentRules",
    "consentData",
    "consentTruth",
  ],
];
