import { NextResponse } from "next/server";
import { fr } from "@/content/fr";
import { FILE_RULES, RATE_LIMIT, SITE } from "@/config/site";
import { getPhase, getServerNowMs } from "@/lib/phase";
import { rateLimit } from "@/lib/rateLimit";
import {
  fileExtension,
  isFileLike,
  isLegalEntity,
  normalizeEmail,
  normalizePhone,
  validateForm,
  type FieldErrors,
} from "@/lib/schema";
import { countPdfPages, signatureMatchesExtension } from "@/lib/fileSignature";
import { DuplicateSubmissionError, getStorage, type SubmissionFile } from "@/lib/storage";
import { sendConfirmation } from "@/lib/mailer";
import { STATUS_BY_CODE, type ApiError, type ApiErrorCode, type ApiSuccess } from "@/lib/apiTypes";
import { fmt } from "@/lib/fmt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const M = fr.form.api;
const E = fr.form.errors;

const MESSAGES: Record<ApiErrorCode, string> = {
  validation: M.validation,
  duplicate: M.duplicate,
  too_large: M.tooLarge,
  rate_limited: M.rateLimited,
  closed_before: M.closedBefore,
  closed_after: M.closedAfter,
  origin: M.origin,
  server: M.server,
};

function fail(
  code: ApiErrorCode,
  extra?: { fieldErrors?: FieldErrors; headers?: Record<string, string> },
) {
  const body: ApiError = {
    ok: false,
    code,
    message: MESSAGES[code],
    fieldErrors: extra?.fieldErrors,
  };
  return NextResponse.json(body, { status: STATUS_BY_CODE[code], headers: extra?.headers });
}

function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const requestHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return host === requestHost || host === new URL(SITE.url).host;
}

function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

const str = (fd: FormData, key: string): string => {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
};
const bool = (fd: FormData, key: string): boolean => ["true", "on", "1"].includes(str(fd, key));
const oneFile = (fd: FormData, key: string): File | undefined => {
  const v = fd.get(key);
  return isFileLike(v) ? v : undefined;
};

export async function POST(req: Request) {
  try {
    if (!originAllowed(req)) return fail("origin");

    const rl = rateLimit(`candidature:${clientIp(req)}`, {
      ...RATE_LIMIT,
      max: Number(process.env.RATE_LIMIT_MAX) || RATE_LIMIT.max,
    });
    if (!rl.ok)
      return fail("rate_limited", { headers: { "Retry-After": String(rl.retryAfterSec) } });

    // Même règle de dates que l'interface (fuseau Africa/Casablanca, override NEXT_PUBLIC_FORCE_NOW).
    const phase = getPhase(getServerNowMs());
    if (phase === "avant-ouverture") return fail("closed_before");
    if (phase === "clos") return fail("closed_after");

    const declared = Number(req.headers.get("content-length") ?? 0);
    if (declared > FILE_RULES.maxTotalBytes) return fail("too_large");

    let fd: FormData;
    try {
      fd = await req.formData();
    } catch {
      return fail("validation");
    }

    // Honeypot : un robot remplit ce champ caché. Réponse de succès factice, rien n'est enregistré.
    if (str(fd, "company_website").trim() !== "") {
      return NextResponse.json({ ok: true, reference: "MMAIN1-0000" } satisfies ApiSuccess, {
        status: 201,
      });
    }

    const values = {
      profil: str(fd, "profil"),
      nom: str(fd, "nom"),
      email: str(fd, "email"),
      telephone: str(fd, "telephone"),
      ville: str(fd, "ville"),
      structure: str(fd, "structure"),
      residence: bool(fd, "residence"),
      titreProjet: str(fd, "titreProjet"),
      axe: str(fd, "axe"),
      resume: str(fd, "resume"),
      stade: str(fd, "stade"),
      prixVises: fd.getAll("prixVises").filter((v): v is string => typeof v === "string"),
      presentation: oneFile(fd, "presentation"),
      cv: oneFile(fd, "cv"),
      videoMode: str(fd, "videoMode"),
      videoUrl: str(fd, "videoUrl"),
      videoFile: oneFile(fd, "videoFile"),
      legalDocs: fd.getAll("legalDocs").filter(isFileLike),
      consentRules: bool(fd, "consentRules"),
      consentData: bool(fd, "consentData"),
      consentTruth: bool(fd, "consentTruth"),
    };

    const fieldErrors = validateForm(values, "all");
    if (Object.keys(fieldErrors).length > 0) return fail("validation", { fieldErrors });

    // Contrôle du contenu réel des fichiers (signature) et estimation du nombre de pages du PDF.
    const files: SubmissionFile[] = [];
    const contentErrors: FieldErrors = {};
    const collect = async (field: string, file: File | undefined, storedBase: string) => {
      if (!file) return;
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = fileExtension(file.name);
      if (!signatureMatchesExtension(ext, buffer)) {
        contentErrors[field] = fmt(E.fileContent, { name: file.name });
        return;
      }
      files.push({
        field,
        storedName: `${storedBase}.${ext === "jpeg" ? "jpg" : ext}`,
        originalName: file.name.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 120),
        mime: file.type || "application/octet-stream",
        buffer,
      });
      if (field === "presentation") {
        const pages = countPdfPages(buffer);
        if (pages !== null && pages > FILE_RULES.presentation.maxPages) {
          contentErrors[field] = fmt(E.pdfPages, { max: FILE_RULES.presentation.maxPages });
        }
      }
    };
    await collect("presentation", values.presentation, "presentation");
    await collect("cv", values.cv, "cv");
    if (values.videoMode === "file") await collect("videoFile", values.videoFile, "pitch-video");
    for (const [i, doc] of values.legalDocs.entries()) {
      await collect("legalDocs", doc, `documents-juridiques-${i + 1}`);
    }
    if (Object.keys(contentErrors).length > 0)
      return fail("validation", { fieldErrors: contentErrors });

    const email = normalizeEmail(values.email);
    const storage = getStorage();
    if (await storage.existsByEmail(email)) return fail("duplicate");

    const legal = isLegalEntity(values.profil);
    let reference: string;
    try {
      ({ reference } = await storage.saveSubmission({
        email,
        files,
        data: {
          profil: values.profil,
          nom: values.nom.trim(),
          email,
          telephone: normalizePhone(values.telephone),
          ville: values.ville.trim(),
          structure: values.structure.trim(),
          personneMorale: legal,
          residence: values.residence,
          titreProjet: values.titreProjet.trim(),
          axe: values.axe,
          resume: values.resume.trim(),
          stade: values.stade,
          prixVises: values.prixVises,
          videoMode: values.videoMode,
          videoUrl: values.videoMode === "link" ? values.videoUrl.trim() : "",
          consentements: { reglement: true, donnees: true, exactitude: true },
        },
      }));
    } catch (e) {
      if (e instanceof DuplicateSubmissionError) return fail("duplicate");
      throw e;
    }

    // L'échec de l'e-mail ne doit pas invalider une candidature déjà enregistrée.
    try {
      await sendConfirmation({
        to: email,
        nom: values.nom.trim(),
        reference,
        titreProjet: values.titreProjet.trim(),
      });
    } catch (e) {
      console.error("[mail] échec d'envoi de la confirmation", e);
    }

    return NextResponse.json({ ok: true, reference } satisfies ApiSuccess, { status: 201 });
  } catch (e) {
    console.error("[api/candidature]", e);
    return fail("server");
  }
}
