"use client";

import { useRef, type ReactNode } from "react";
import { FileText, X } from "lucide-react";
import { fr } from "@/content/fr";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/fmt";

export const inputClass =
  "block w-full min-h-11 rounded-xl border border-slate-500 bg-white px-3.5 py-2.5 text-base text-ink placeholder:text-slate-500 aria-[invalid=true]:border-danger aria-[invalid=true]:bg-red-50/40";

type FieldProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: (a11y: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  }) => ReactNode;
};

/** Étiquette + aide + erreur reliées au contrôle via aria-describedby. */
export function Field({ id, label, required, hint, error, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-navy mb-1.5 block font-semibold">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger ml-0.5">
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-muted mb-1.5 text-sm">
          {hint}
        </p>
      )}
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {error && (
        <p id={errId} className="text-danger mt-1.5 flex gap-1.5 text-sm font-semibold">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/** Groupe (radios / cases) avec légende, aide et erreur. */
export function Group({
  legend,
  required,
  hint,
  error,
  id,
  children,
}: {
  legend: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  id: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <fieldset
      aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
      aria-invalid={Boolean(error)}
    >
      <legend className="text-navy mb-1.5 font-semibold">
        {legend}
        {required && (
          <span aria-hidden="true" className="text-danger ml-0.5">
            *
          </span>
        )}
      </legend>
      {hint && (
        <p id={hintId} className="text-muted mb-2 text-sm">
          {hint}
        </p>
      )}
      <div className="grid gap-2">{children}</div>
      {error && (
        <p id={errId} className="text-danger mt-1.5 flex gap-1.5 text-sm font-semibold">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}

/** Case à cocher ou bouton radio avec zone tactile ≥ 44 px. */
export function Choice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <label
      className={cn(
        "border-line has-[:checked]:border-blue-strong has-[:checked]:bg-blue-soft flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border bg-white px-3.5 py-2.5",
        className,
      )}
    >
      {children}
    </label>
  );
}

export const choiceInputClass = "mt-1 h-5 w-5 shrink-0 accent-[#146aa0]";

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} Ko`
    : `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;

export { formatSize };

/** Sélecteur de fichier(s) : aperçu nom/poids, retrait avant envoi. */
export function FileField({
  id,
  label,
  required,
  hint,
  error,
  accept,
  multiple = false,
  value,
  onChange,
  maxFiles,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  accept: string;
  multiple?: boolean;
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = fr.form.file;
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const listId = `${id}-list`;

  return (
    <div>
      <p id={`${id}-label`} className="text-navy mb-1.5 font-semibold">
        {label}
        {required && (
          <span aria-hidden="true" className="text-danger ml-0.5">
            *
          </span>
        )}
      </p>
      {hint && (
        <p id={hintId} className="text-muted mb-2 text-sm">
          {hint}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (picked.length === 0) return;
          onChange(
            multiple
              ? [...value, ...picked].slice(0, maxFiles ? maxFiles + 5 : undefined)
              : picked.slice(0, 1),
          );
        }}
      />
      <button
        type="button"
        id={id}
        aria-labelledby={`${id}-label`}
        aria-describedby={
          [hintId, errId, value.length ? listId : undefined].filter(Boolean).join(" ") || undefined
        }
        onClick={() => inputRef.current?.click()}
        className={cn(
          "text-blue-strong hover:bg-blue-soft flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 font-semibold",
          error ? "border-danger" : "border-slate-500",
        )}
      >
        <FileText aria-hidden="true" className="h-5 w-5" />
        {multiple ? t.chooseMany : t.choose}
      </button>
      {value.length > 0 && (
        <ul id={listId} className="mt-2 space-y-2">
          {value.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="bg-blue-soft flex items-center justify-between gap-3 rounded-xl px-3.5 py-2"
            >
              <span className="min-w-0">
                <span className="text-navy block truncate font-semibold">{f.name}</span>
                <span className="text-muted text-sm">{formatSize(f.size)}</span>
              </span>
              <button
                type="button"
                aria-label={fmt(t.removeNamed, { name: f.name })}
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="text-navy flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p id={errId} className="text-danger mt-1.5 flex gap-1.5 text-sm font-semibold">
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
