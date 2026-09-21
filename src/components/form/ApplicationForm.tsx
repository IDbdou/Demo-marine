"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch, type FieldErrors, type Resolver } from "react-hook-form";
import { ArrowRight, Loader, Pencil } from "lucide-react";
import { fr } from "@/content/fr";
import { FILE_RULES, FORM_LIMITS, SITE } from "@/config/site";
import {
  AXES,
  DRAFT_FIELDS,
  PRIX_VISES,
  PROFILS,
  STADES,
  STEP_FIELDS,
  isLegalEntity,
  validateForm,
  type ApplicationValues,
  type StepIndex,
} from "@/lib/schema";
import { fmt } from "@/lib/fmt";
import { cn } from "@/lib/cn";
import { submitApplication } from "@/lib/submit";
import { Button } from "@/components/ui/Button";
import { Choice, Field, FileField, Group, choiceInputClass, formatSize, inputClass } from "./Field";

const F = fr.form;
const DRAFT_KEY = "mmain1-draft-v1";
const mb = (bytes: number) => Math.round((bytes / (1024 * 1024)) * 10) / 10;

const defaults: Partial<ApplicationValues> = {
  ville: "",
  structure: "",
  residence: false,
  stade: "",
  prixVises: [],
  videoMode: "link",
  videoUrl: "",
  legalDocs: [],
  consentRules: false,
  consentData: false,
  consentTruth: false,
  resume: "",
  titreProjet: "",
};

function readDraft(): Partial<ApplicationValues> | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<ApplicationValues>) : null;
  } catch {
    return null;
  }
}
function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* stockage indisponible : sans conséquence */
  }
}

/** Formulaire de candidature en 3 étapes + récapitulatif, validation zod identique à celle du serveur. */
export function ApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState<StepIndex>(0);
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  /** Champs dont l'erreur est visible (après passage sur le champ ou tentative de validation). */
  const [shown, setShown] = useState<ReadonlySet<string>>(new Set());
  const [summary, setSummary] = useState<Array<[string, string]>>([]);
  const [draftRestored, setDraftRestored] = useState(false);
  const submittingRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<StepIndex | "all">(0);
  useEffect(() => {
    stageRef.current = reviewing ? "all" : step;
  }, [reviewing, step]);

  const resolver: Resolver<ApplicationValues> = useCallback(async (values) => {
    const errs = validateForm(values, stageRef.current);
    const keys = Object.keys(errs);
    if (keys.length === 0) return { values, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const k of keys) errors[k] = { type: "validation", message: errs[k] ?? F.errors.required };
    return { values: {}, errors: errors as FieldErrors<ApplicationValues> };
  }, []);

  const {
    register,
    control,
    trigger,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm<ApplicationValues>({ resolver, mode: "onChange", defaultValues: defaults });

  const profil = useWatch({ control, name: "profil" });
  const legal = isLegalEntity(profil);
  const videoMode = useWatch({ control, name: "videoMode" });
  const resume = useWatch({ control, name: "resume" }) ?? "";
  const allValues = useWatch({ control });

  /* Brouillon local (texte uniquement, jamais les fichiers). */
  useEffect(() => {
    const draft = readDraft();
    if (draft && Object.keys(draft).length > 0) {
      reset({ ...defaults, ...draft });
      // Lecture unique de localStorage après montage (indisponible côté serveur).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraftRestored(true);
    }
  }, [reset]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const draft: Record<string, unknown> = {};
        for (const k of DRAFT_FIELDS) draft[k] = allValues[k];
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* stockage indisponible */
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [allValues]);
  const err = (name: keyof ApplicationValues): string | undefined => {
    if (!shown.has(name)) return undefined;
    const e = errors[name];
    return e && typeof e.message === "string" ? e.message : undefined;
  };

  /** Résumé figé au moment de la soumission (il ne bouge pas quand l'utilisateur corrige). */
  const snapshot = (errs: Record<string, string>): Array<[string, string]> =>
    STEP_FIELDS.flat().flatMap((f) => (errs[f] ? [[f, errs[f]] as [string, string]] : []));

  const reveal = (names: readonly string[]) =>
    setShown((prev) => (names.every((n) => prev.has(n)) ? prev : new Set([...prev, ...names])));

  const focusField = (name: string) => {
    window.setTimeout(() => document.getElementById(`f-${name}`)?.focus(), 30);
  };

  const scrollToTop = () =>
    formTopRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });

  const goTo = (s: StepIndex, review = false) => {
    setStep(s);
    setReviewing(review);
    setSummary([]);
    setBanner(null);
    scrollToTop();
    window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 50);
  };

  const next = async () => {
    const ok = await trigger();
    if (!ok) {
      const errs = validateForm(getValues(), stageRef.current);
      reveal(STEP_FIELDS[step] ?? []);
      const items = snapshot(errs);
      setSummary(items);
      if (items[0]) focusField(items[0][0]);
      return;
    }
    if (step < 2) goTo((step + 1) as StepIndex);
    else goTo(2, true);
  };

  const send = async () => {
    if (submittingRef.current) return;
    const allErrors = validateForm(getValues(), "all");
    const firstBad = Object.keys(allErrors)[0];
    if (firstBad) {
      const s = STEP_FIELDS.findIndex((fields) =>
        fields.includes(firstBad as keyof ApplicationValues),
      );
      for (const [k, m] of Object.entries(allErrors))
        setError(k as keyof ApplicationValues, { type: "validation", message: m });
      goTo(Math.max(0, s) as StepIndex);
      reveal(Object.keys(allErrors));
      setSummary(snapshot(allErrors));
      focusField(firstBad);
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setProgress(0);
    setBanner(null);

    const v = getValues();
    const fd = new FormData();
    const textFields = [
      "profil",
      "nom",
      "email",
      "telephone",
      "ville",
      "structure",
      "titreProjet",
      "axe",
      "resume",
      "stade",
      "videoMode",
      "videoUrl",
    ] as const;
    for (const k of textFields) fd.append(k, String(v[k] ?? ""));
    for (const k of ["residence", "consentRules", "consentData", "consentTruth"] as const)
      fd.append(k, String(Boolean(v[k])));
    for (const p of v.prixVises ?? []) fd.append("prixVises", p);
    if (v.presentation) fd.append("presentation", v.presentation);
    if (v.cv) fd.append("cv", v.cv);
    if (v.videoMode === "file" && v.videoFile) fd.append("videoFile", v.videoFile);
    for (const d of v.legalDocs ?? []) fd.append("legalDocs", d);
    fd.append("company_website", honeypotRef.current?.value ?? "");

    const res = await submitApplication(fd, setProgress);
    submittingRef.current = false;
    setSubmitting(false);

    if (res.ok) {
      clearDraft();
      router.push(`/candidature/merci?ref=${encodeURIComponent(res.reference)}`);
      return;
    }
    if (res.fieldErrors && Object.keys(res.fieldErrors).length > 0) {
      const names = Object.keys(res.fieldErrors);
      for (const [k, m] of Object.entries(res.fieldErrors))
        setError(k as keyof ApplicationValues, { type: "server", message: m });
      const s = STEP_FIELDS.findIndex((fields) =>
        fields.includes(names[0] as keyof ApplicationValues),
      );
      goTo(Math.max(0, s) as StepIndex);
      reveal(names);
      setSummary(snapshot(res.fieldErrors));
      focusField(names[0] ?? "");
      return;
    }
    if (res.code === "duplicate") {
      setError("email", { type: "server", message: res.message });
      goTo(0);
      reveal(["email"]);
      setSummary(snapshot({ email: res.message }));
      focusField("email");
      return;
    }
    setBanner(res.message);
    window.setTimeout(() => document.getElementById("form-banner")?.focus(), 30);
  };

  const label = (name: keyof typeof F.fields) => F.fields[name].label;
  const fileAccept = (exts: readonly string[]) => exts.map((e) => `.${e}`).join(",");

  const stepTitles = F.steps;
  const stepNumber = reviewing ? 3 : step + 1;

  return (
    <div ref={formTopRef} className="card text-ink mx-auto max-w-3xl scroll-mt-24 p-5 sm:p-9">
      {/* Progression */}
      <nav aria-label={F.progressLabel} className="mb-8">
        <p className="text-muted mb-3 text-sm font-semibold">
          {fmt(F.stepOf, { n: stepNumber, total: stepTitles.length })}
        </p>
        <ol className="grid grid-cols-3 gap-2">
          {stepTitles.map((title, i) => {
            const done = reviewing ? true : i < step;
            const current = reviewing ? i === 2 : i === step;
            return (
              <li key={title} aria-current={current ? "step" : undefined}>
                <div
                  aria-hidden="true"
                  className={cn(
                    "h-2 rounded-full",
                    done || current ? "bg-green" : "bg-line",
                    current && !done && "bg-blue-strong",
                  )}
                />
                <span
                  className={cn(
                    "mt-1.5 block text-xs font-semibold sm:text-sm",
                    current ? "text-navy" : "text-muted",
                  )}
                >
                  {i + 1}. {title}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      <p className="text-muted mb-4 text-sm">{F.requiredNote}</p>
      {draftRestored && (
        <p role="status" className="bg-blue-soft text-navy mb-4 rounded-xl px-4 py-2 text-sm">
          {F.draftRestored}
        </p>
      )}

      {summary.length > 0 && (
        <div
          role="alert"
          className="border-danger mb-6 rounded-xl border-2 bg-red-50 p-4"
          id="form-error-summary"
        >
          <p className="text-danger font-bold">{F.errorSummaryTitle}</p>
          <p className="text-sm">{F.errorSummaryHelp}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {summary.map(([name, message]) => (
              <li key={name}>
                <a
                  href={`#f-${name}`}
                  className="text-danger font-semibold underline"
                  onClick={(e) => {
                    e.preventDefault();
                    focusField(name);
                  }}
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {banner && (
        <div
          id="form-banner"
          tabIndex={-1}
          role="alert"
          className="border-danger text-danger mb-6 rounded-xl border-2 bg-red-50 p-4 font-semibold"
        >
          {banner}
        </div>
      )}

      <form
        noValidate
        onSubmit={(e) => e.preventDefault()}
        onBlur={(e) => {
          const name = (e.target as Element).getAttribute("name");
          if (name && name !== "company_website") reveal([name]);
        }}
        aria-busy={submitting}
      >
        {/* Honeypot anti-spam : invisible pour les humains, ignoré des lecteurs d'écran. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            {F.honeypotLabel}
            <input
              ref={honeypotRef}
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </label>
        </div>

        {/* ───── Étape 1 ───── */}
        {!reviewing && step === 0 && (
          <fieldset className="space-y-5">
            <legend className="text-navy mb-5 text-xl font-bold">
              <h3 ref={headingRef} tabIndex={-1} className="outline-none">
                {F.blocks.candidate}
              </h3>
            </legend>
            <Field id="f-profil" label={label("profil")} required error={err("profil")}>
              {(a) => (
                <select {...a} className={inputClass} {...register("profil")} defaultValue="">
                  <option value="" disabled>
                    {F.fields.profil.placeholder}
                  </option>
                  {PROFILS.map((p) => (
                    <option key={p} value={p}>
                      {F.fields.profil.options[p]}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field id="f-nom" label={label("nom")} required error={err("nom")}>
              {(a) => (
                <input
                  {...a}
                  type="text"
                  autoComplete={F.fields.nom.autocomplete}
                  className={inputClass}
                  {...register("nom")}
                />
              )}
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="f-email" label={label("email")} required error={err("email")}>
                {(a) => (
                  <input
                    {...a}
                    type="email"
                    inputMode="email"
                    autoComplete={F.fields.email.autocomplete}
                    className={inputClass}
                    {...register("email")}
                  />
                )}
              </Field>
              <Field
                id="f-telephone"
                label={label("telephone")}
                required
                hint={F.fields.telephone.hint}
                error={err("telephone")}
              >
                {(a) => (
                  <input
                    {...a}
                    type="tel"
                    inputMode="tel"
                    autoComplete={F.fields.telephone.autocomplete}
                    className={inputClass}
                    {...register("telephone")}
                  />
                )}
              </Field>
            </div>
            <Field
              id="f-ville"
              label={
                <>
                  {label("ville")} <span className="text-muted font-normal">{F.optional}</span>
                </>
              }
              error={err("ville")}
            >
              {(a) => (
                <input
                  {...a}
                  type="text"
                  autoComplete="address-level2"
                  className={inputClass}
                  {...register("ville")}
                />
              )}
            </Field>
            <Field
              id="f-structure"
              label={label("structure")}
              required={legal}
              hint={legal ? F.fields.structure.requiredHint : F.fields.structure.hint}
              error={err("structure")}
            >
              {(a) => (
                <input
                  {...a}
                  type="text"
                  autoComplete="organization"
                  className={inputClass}
                  {...register("structure")}
                />
              )}
            </Field>
            <div>
              <Choice>
                <input
                  id="f-residence"
                  type="checkbox"
                  className={choiceInputClass}
                  aria-invalid={Boolean(err("residence"))}
                  aria-describedby={err("residence") ? "f-residence-err" : undefined}
                  {...register("residence")}
                />
                <span>
                  {F.fields.residence.label}
                  <span aria-hidden="true" className="text-danger ml-0.5">
                    *
                  </span>
                </span>
              </Choice>
              {err("residence") && (
                <p
                  id="f-residence-err"
                  className="text-danger mt-1.5 flex gap-1.5 text-sm font-semibold"
                >
                  <span aria-hidden="true">⚠</span>
                  <span>{err("residence")}</span>
                </p>
              )}
            </div>
          </fieldset>
        )}

        {/* ───── Étape 2 ───── */}
        {!reviewing && step === 1 && (
          <fieldset className="space-y-5">
            <legend className="text-navy mb-5 text-xl font-bold">
              <h3 ref={headingRef} tabIndex={-1} className="outline-none">
                {F.blocks.project}
              </h3>
            </legend>
            <Field
              id="f-titreProjet"
              label={label("titreProjet")}
              required
              error={err("titreProjet")}
            >
              {(a) => (
                <input
                  {...a}
                  type="text"
                  maxLength={FORM_LIMITS.titleMax + 20}
                  className={inputClass}
                  {...register("titreProjet")}
                />
              )}
            </Field>
            <Group id="f-axe-group" legend={label("axe")} required error={err("axe")}>
              {AXES.map((a, i) => (
                <Choice key={a}>
                  <input
                    id={i === 0 ? "f-axe" : undefined}
                    type="radio"
                    value={a}
                    className={choiceInputClass}
                    {...register("axe")}
                  />
                  <span>{F.fields.axe.options[a]}</span>
                </Choice>
              ))}
            </Group>
            <Field
              id="f-resume"
              label={label("resume")}
              required
              hint={F.fields.resume.hint}
              error={err("resume")}
            >
              {(a) => (
                <>
                  <textarea
                    {...a}
                    rows={8}
                    className={cn(inputClass, "resize-y")}
                    {...register("resume")}
                  />
                  <p
                    aria-live="off"
                    className={cn(
                      "mt-1 text-sm",
                      resume.trim().length > FORM_LIMITS.summaryMax ||
                        (resume.trim().length > 0 && resume.trim().length < FORM_LIMITS.summaryMin)
                        ? "text-danger font-semibold"
                        : "text-muted",
                    )}
                  >
                    {fmt(F.fields.resume.counter, {
                      n: resume.trim().length,
                      max: FORM_LIMITS.summaryMax,
                      min: FORM_LIMITS.summaryMin,
                    })}
                  </p>
                </>
              )}
            </Field>
            <Field
              id="f-stade"
              label={
                <>
                  {label("stade")} <span className="text-muted font-normal">{F.optional}</span>
                </>
              }
              hint={F.fields.stade.hint}
              error={err("stade")}
            >
              {(a) => (
                <select {...a} className={inputClass} {...register("stade")}>
                  <option value="">{F.fields.stade.placeholder}</option>
                  {STADES.map((s) => (
                    <option key={s} value={s}>
                      {F.fields.stade.options[s]}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Group
              id="f-prixVises-group"
              legend={
                <>
                  {label("prixVises")} <span className="text-muted font-normal">{F.optional}</span>
                </>
              }
              hint={F.fields.prixVises.hint}
            >
              {PRIX_VISES.map((p, i) => (
                <Choice key={p}>
                  <input
                    id={i === 0 ? "f-prixVises" : undefined}
                    type="checkbox"
                    value={p}
                    className={choiceInputClass}
                    {...register("prixVises")}
                  />
                  <span>{F.fields.prixVises.options[p]}</span>
                </Choice>
              ))}
            </Group>
          </fieldset>
        )}

        {/* ───── Étape 3 ───── */}
        {!reviewing && step === 2 && (
          <fieldset className="space-y-6">
            <legend className="text-navy mb-5 text-xl font-bold">
              <h3 ref={headingRef} tabIndex={-1} className="outline-none">
                {F.blocks.files}
              </h3>
            </legend>

            <Controller
              control={control}
              name="presentation"
              render={({ field }) => (
                <FileField
                  id="f-presentation"
                  label={label("presentation")}
                  required
                  hint={fmt(F.fields.presentation.hint, {
                    size: mb(FILE_RULES.presentation.maxBytes),
                  })}
                  accept={fileAccept(FILE_RULES.presentation.extensions)}
                  value={field.value ? [field.value] : []}
                  onChange={(files) => {
                    field.onChange(files[0]);
                    reveal(["presentation"]);
                    void trigger("presentation");
                  }}
                  error={err("presentation")}
                />
              )}
            />

            <Group
              id="f-videoMode-group"
              legend={F.fields.video.label}
              required
              hint={F.fields.video.modeLegend}
              error={err("videoMode")}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <Choice>
                  <input
                    id="f-videoMode"
                    type="radio"
                    value="link"
                    className={choiceInputClass}
                    {...register("videoMode")}
                  />
                  <span>{F.fields.video.modeLink}</span>
                </Choice>
                <Choice>
                  <input
                    type="radio"
                    value="file"
                    className={choiceInputClass}
                    {...register("videoMode")}
                  />
                  <span>{F.fields.video.modeFile}</span>
                </Choice>
              </div>
            </Group>
            {videoMode === "link" ? (
              <Field
                id="f-videoUrl"
                label={F.fields.video.urlLabel}
                required
                hint={F.fields.video.urlHint}
                error={err("videoUrl")}
              >
                {(a) => (
                  <input
                    {...a}
                    type="url"
                    inputMode="url"
                    placeholder="https://"
                    className={inputClass}
                    {...register("videoUrl")}
                  />
                )}
              </Field>
            ) : (
              <Controller
                control={control}
                name="videoFile"
                render={({ field }) => (
                  <FileField
                    id="f-videoFile"
                    label={F.fields.video.fileLabel}
                    required
                    hint={fmt(F.fields.video.fileHint, { size: mb(FILE_RULES.video.maxBytes) })}
                    accept={fileAccept(FILE_RULES.video.extensions)}
                    value={field.value ? [field.value] : []}
                    onChange={(files) => {
                      field.onChange(files[0]);
                      reveal(["videoFile"]);
                      void trigger("videoFile");
                    }}
                    error={err("videoFile")}
                  />
                )}
              />
            )}

            <Controller
              control={control}
              name="cv"
              render={({ field }) => (
                <FileField
                  id="f-cv"
                  label={label("cv")}
                  required
                  hint={fmt(F.fields.cv.hint, { size: mb(FILE_RULES.cv.maxBytes) })}
                  accept={fileAccept(FILE_RULES.cv.extensions)}
                  value={field.value ? [field.value] : []}
                  onChange={(files) => {
                    field.onChange(files[0]);
                    reveal(["cv"]);
                    void trigger("cv");
                  }}
                  error={err("cv")}
                />
              )}
            />

            {legal && (
              <Controller
                control={control}
                name="legalDocs"
                render={({ field }) => (
                  <FileField
                    id="f-legalDocs"
                    label={label("legalDocs")}
                    required
                    multiple
                    maxFiles={FILE_RULES.legalDocs.maxFiles}
                    hint={fmt(F.fields.legalDocs.hint, {
                      count: FILE_RULES.legalDocs.maxFiles,
                      size: mb(FILE_RULES.legalDocs.maxBytes),
                    })}
                    accept={fileAccept(FILE_RULES.legalDocs.extensions)}
                    value={field.value ?? []}
                    onChange={(files) => {
                      field.onChange(files);
                      reveal(["legalDocs"]);
                      void trigger("legalDocs");
                    }}
                    error={err("legalDocs")}
                  />
                )}
              />
            )}

            <div className="border-line space-y-3 border-t pt-6">
              <h4 className="text-navy text-lg font-bold">{F.blocks.consents}</h4>
              <ConsentRow
                id="f-consentRules"
                error={err("consentRules")}
                reg={register("consentRules")}
                label={F.fields.consentRules.label}
                link={{ phrase: F.fields.consentRules.link, href: SITE.rulesUrl, external: true }}
              />
              <ConsentRow
                id="f-consentData"
                error={err("consentData")}
                reg={register("consentData")}
                label={F.fields.consentData.label}
                link={{
                  phrase: F.fields.consentData.link,
                  href: "/politique-de-confidentialite",
                  external: true,
                }}
              />
              <ConsentRow
                id="f-consentTruth"
                error={err("consentTruth")}
                reg={register("consentTruth")}
                label={F.fields.consentTruth.label}
              />
              <p className="bg-blue-soft text-navy rounded-xl px-4 py-3 font-semibold">
                {F.irreversible}
              </p>
            </div>
          </fieldset>
        )}

        {/* ───── Récapitulatif ───── */}
        {reviewing && (
          <Recap headingRef={headingRef} values={getValues()} onEdit={(s) => goTo(s)} />
        )}

        {/* Actions */}
        <div className="border-line mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
          {step > 0 || reviewing ? (
            <Button
              variant="secondary"
              disabled={submitting}
              onClick={() => (reviewing ? goTo(2) : goTo((step - 1) as StepIndex))}
            >
              {F.back}
            </Button>
          ) : (
            <span />
          )}
          {reviewing ? (
            <Button
              variant="primary"
              size="lg"
              disabled={submitting}
              onClick={send}
              aria-disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin motion-reduce:animate-none"
                  />
                  {F.sending}
                </>
              ) : (
                fr.apply.submit
              )}
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={next}>
              {step === 2 ? F.review : F.next}
              <ArrowRight aria-hidden="true" className="h-5 w-5" />
            </Button>
          )}
        </div>

        {submitting && (
          <div className="mt-4" role="status">
            <p className="text-navy text-sm font-semibold">
              {fmt(F.uploadProgress, { p: progress })}
            </p>
            <div aria-hidden="true" className="bg-line mt-1 h-2 overflow-hidden rounded-full">
              <div
                className="bg-green h-full transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
        <p className="text-muted mt-4 text-sm">{F.draftNotice}</p>
      </form>
    </div>
  );
}

function ConsentRow({
  id,
  label,
  link,
  error,
  reg,
}: {
  id: string;
  label: string;
  link?: { phrase: string; href: string; external?: boolean };
  error?: string;
  reg: ReturnType<ReturnType<typeof useForm<ApplicationValues>>["register"]>;
}) {
  const parts = link && label.includes(link.phrase) ? label.split(link.phrase) : null;
  return (
    <div>
      <Choice>
        <input
          id={id}
          type="checkbox"
          className={choiceInputClass}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          {...reg}
        />
        <span>
          {parts && link ? (
            <>
              {parts[0]}
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="text-blue-strong font-semibold underline"
              >
                {link.phrase}
              </a>
              {parts[1]}
            </>
          ) : (
            label
          )}
          <span aria-hidden="true" className="text-danger ml-0.5">
            *
          </span>
        </span>
      </Choice>
      {error && (
        <p id={`${id}-err`} className="text-danger mt-1.5 flex gap-1.5 text-sm font-semibold">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function Recap({
  values: v,
  onEdit,
  headingRef,
}: {
  values: ApplicationValues;
  onEdit: (s: StepIndex) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const empty = F.empty;
  const rows: Array<{ title: string; step: StepIndex; items: Array<[string, string]> }> = [
    {
      title: F.blocks.candidate,
      step: 0,
      items: [
        [F.fields.profil.label, v.profil ? F.fields.profil.options[v.profil] : empty],
        [F.fields.nom.label, v.nom || empty],
        [F.fields.email.label, v.email || empty],
        [F.fields.telephone.label, v.telephone || empty],
        [F.fields.ville.label, v.ville || empty],
        [F.fields.structure.label, v.structure || empty],
        [F.fields.residence.label, v.residence ? F.yes : empty],
      ],
    },
    {
      title: F.blocks.project,
      step: 1,
      items: [
        [F.fields.titreProjet.label, v.titreProjet || empty],
        [F.fields.axe.label, v.axe ? F.fields.axe.options[v.axe] : empty],
        [F.fields.resume.label, v.resume || empty],
        [F.fields.stade.label, v.stade ? F.fields.stade.options[v.stade] : empty],
        [
          F.fields.prixVises.label,
          (v.prixVises ?? []).map((p) => F.fields.prixVises.options[p]).join(", ") || empty,
        ],
      ],
    },
    {
      title: F.blocks.files,
      step: 2,
      items: [
        [
          F.fields.presentation.label,
          v.presentation ? `${v.presentation.name} (${formatSize(v.presentation.size)})` : empty,
        ],
        [
          F.fields.video.label,
          v.videoMode === "link"
            ? v.videoUrl || empty
            : v.videoFile
              ? `${v.videoFile.name} (${formatSize(v.videoFile.size)})`
              : empty,
        ],
        [F.fields.cv.label, v.cv ? `${v.cv.name} (${formatSize(v.cv.size)})` : empty],
        ...(isLegalEntity(v.profil)
          ? ([
              [
                F.fields.legalDocs.label,
                (v.legalDocs ?? []).map((f) => `${f.name} (${formatSize(f.size)})`).join(", ") ||
                  empty,
              ],
            ] as Array<[string, string]>)
          : []),
      ],
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h3 ref={headingRef} tabIndex={-1} className="text-navy text-xl font-bold outline-none">
          {F.recapTitle}
        </h3>
        <p className="text-muted mt-1">{F.recapHelp}</p>
      </div>
      {rows.map((block) => (
        <section
          key={block.title}
          aria-label={block.title}
          className="border-line rounded-xl border"
        >
          <div className="border-line bg-blue-soft flex items-center justify-between gap-3 border-b px-4 py-2">
            <h4 className="text-navy font-bold">{block.title}</h4>
            <button
              type="button"
              onClick={() => onEdit(block.step)}
              className="text-blue-strong inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold hover:bg-white"
            >
              <Pencil aria-hidden="true" className="h-4 w-4" />
              {F.edit}
              <span className="sr-only"> {block.title}</span>
            </button>
          </div>
          <dl className="divide-line divide-y">
            {block.items.map(([k, val]) => (
              <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                <dt className="text-muted text-sm font-semibold">{k}</dt>
                <dd className="break-words whitespace-pre-line">{val}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      <p className="bg-blue-soft text-navy rounded-xl px-4 py-3 font-semibold">{F.irreversible}</p>
    </div>
  );
}
