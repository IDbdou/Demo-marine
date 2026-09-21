/**
 * Configuration du site : dates, contacts, limites de fichiers, liens sociaux, URL du règlement.
 * Les textes affichés se trouvent dans `src/content/fr.ts`.
 */

/** Fuseau de référence du concours. */
export const TIMEZONE = "Africa/Casablanca";

/**
 * Fenêtre de candidature (heure du Maroc, UTC+1 sur la période du concours).
 * La clôture est inclusive jusqu'à 23:59:59 (voir `phase.ts`).
 */
export const CONTEST = {
  opensAt: "2026-11-09T00:00:00+01:00",
  closesAt: "2026-12-15T23:59:59+01:00",
} as const;

/**
 * Jalons du calendrier (jours calendaires, heure du Maroc). Les libellés affichés sont dans fr.ts,
 * rattachés par `id`. `end` absent = jalon d'un seul jour.
 */
export const MILESTONE_DATES = [
  { id: "lancement", start: "2026-11-09" },
  { id: "cloture", start: "2026-12-15" },
  { id: "preselection", start: "2026-12-16", end: "2026-12-27" },
  { id: "finalistes", start: "2026-12-28" },
  { id: "finale", start: "2027-01-27", end: "2027-01-31" },
  { id: "prix", start: "2027-01-31" },
] as const;

export type MilestoneId = (typeof MILESTONE_DATES)[number]["id"];

/**
 * URL publique du site : NEXT_PUBLIC_SITE_URL si elle est valide, sinon l'URL Vercel, sinon localhost.
 * Une valeur vide ou invalide ne fait jamais échouer le build.
 */
function resolveSiteUrl(): string {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const candidates = [process.env.NEXT_PUBLIC_SITE_URL, vercel ? `https://${vercel}` : undefined];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return new URL(candidate).origin;
    } catch {
      /* valeur invalide : essayer la suivante */
    }
  }
  return "http://localhost:3000";
}

export const SITE = {
  name: "M-MAIN1",
  url: resolveSiteUrl(),
  locale: "fr-MA",
  lang: "fr",
  /** Règlement du concours (PDF). TODO(règlement) : remplacer public/docs/reglement-m-main1.pdf. */
  rulesUrl: "/docs/reglement-m-main1.pdf",
  /** Vidéo de présentation optionnelle : renseigner `src` (YouTube/Vimeo « embed » ou MP4) pour l'afficher. */
  heroVideo: { src: "", poster: "", title: "" },
} as const;

export const CONTACTS = [
  {
    name: "Abdellah Bourti",
    role: "Responsable Programme M-MAIN1",
    email: "Abdellah.bourti@gmail.com",
    phoneDisplay: "06 40 02 91 73",
    phoneIntl: "+212640029173",
  },
  {
    name: "Fatima Zohra NADIM",
    role: "Responsable Programme M-MAIN1",
    email: "f.nadim@anda.gov.ma",
    phoneDisplay: "07 02 03 14 84",
    phoneIntl: "+212702031484",
  },
] as const;

/** URL vides dans le document source : l'icône n'est affichée que si l'URL est renseignée. */
export const SOCIAL = {
  linkedin: "",
  facebook: "",
  instagram: "",
} as const;

const MB = 1024 * 1024;

export const FILE_RULES = {
  presentation: {
    maxBytes: 15 * MB,
    maxPages: 10,
    extensions: ["pdf"],
    mimes: ["application/pdf"],
  },
  cv: { maxBytes: 5 * MB, extensions: ["pdf"], mimes: ["application/pdf"] },
  video: {
    maxBytes: 50 * MB,
    extensions: ["mp4", "mov"],
    mimes: ["video/mp4", "video/quicktime"],
  },
  legalDocs: {
    maxBytes: 10 * MB,
    maxFiles: 5,
    extensions: ["pdf", "jpg", "jpeg", "png"],
    mimes: ["application/pdf", "image/jpeg", "image/png"],
  },
  /** Plafond de la requête complète (défense en profondeur côté serveur). */
  maxTotalBytes: 130 * MB,
} as const;

export const FORM_LIMITS = {
  titleMax: 120,
  summaryMin: 300,
  summaryMax: 1500,
} as const;

export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;

/** Profils pour lesquels structure et documents juridiques sont exigés. */
export const LEGAL_ENTITY_PROFILES = ["startup", "cooperative"] as const;

export const REFERENCE_PREFIX = "MMAIN1";
export const EDITION_YEAR = 2026;
