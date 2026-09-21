"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { fr } from "@/content/fr";
import { cn } from "@/lib/cn";
import { getCountdownMode, getCountdownTarget, getRemaining } from "@/lib/phase";
import { useNow } from "@/components/PhaseProvider";

const t = fr.countdown;
const pad = (n: number) => String(n).padStart(2, "0");
const plural = (n: number) => (n > 1 ? t.daysMany : t.daysOne);

/**
 * Compte à rebours. Hydratation sûre : le premier rendu utilise l'instant de rendu serveur,
 * le tick (aria-hidden, aria-live="off") démarre après montage ; un résumé statique reste lisible
 * par les lecteurs d'écran et un message poli n'est émis que lors d'un changement de phase.
 */
export function Countdown({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "inline";
  className?: string;
}) {
  const now = useNow(1000);
  const { phase, targetMs } = getCountdownTarget(now);
  const [announcement, setAnnouncement] = useState("");
  const previousPhase = useRef(phase);

  useEffect(() => {
    if (previousPhase.current !== phase) {
      previousPhase.current = phase;
      setAnnouncement(phase === "ouvert" ? t.srOpen : phase === "clos" ? t.srClosed : t.srBefore);
    }
  }, [phase]);

  const srSummary =
    phase === "avant-ouverture" ? t.srBefore : phase === "ouvert" ? t.srOpen : t.srClosed;
  const remaining = targetMs === null ? null : getRemaining(now, targetMs);
  const mode = remaining ? getCountdownMode(remaining) : "days";

  const sentenceDays = remaining ? `${remaining.days} ${plural(remaining.days)}` : "";
  const sentenceHms = remaining
    ? `${remaining.hours} h ${pad(remaining.minutes)} min ${pad(remaining.seconds)} s`
    : "";
  const amount = mode === "days" ? sentenceDays : sentenceHms;

  const headline =
    phase === "ouvert"
      ? `${t.openLabel} ${amount} ${t.reminderOpen}`
      : phase === "avant-ouverture"
        ? `${t.beforeLabel} ${amount}`
        : t.closedTitle;

  const cells =
    remaining &&
    (mode === "days"
      ? [
          [remaining.days, t.unitDays],
          [remaining.hours, t.unitHours],
          [remaining.minutes, t.unitMinutes],
          [remaining.seconds, t.unitSeconds],
        ]
      : [
          [remaining.hours, t.unitHours],
          [remaining.minutes, t.unitMinutes],
          [remaining.seconds, t.unitSeconds],
        ]);

  if (variant === "inline") {
    return (
      <div
        role="group"
        aria-label={t.timerLabel}
        aria-live="off"
        className={cn("flex items-center gap-3", className)}
      >
        <span className="sr-only">{srSummary}</span>
        <Clock
          aria-hidden="true"
          className="text-blue-strong h-6 w-6 shrink-0"
          strokeWidth={1.75}
        />
        <p aria-hidden="true" className="text-navy text-lg font-semibold">
          {headline}
        </p>
        <p role="status" className="sr-only">
          {announcement}
        </p>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={t.timerLabel}
      aria-live="off"
      className={cn("rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5", className)}
    >
      <p className="sr-only">{srSummary}</p>
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <div aria-hidden="true" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <p className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
          <Clock className="text-blue-light h-6 w-6 shrink-0" strokeWidth={1.75} />
          <span>
            {phase === "clos"
              ? t.closedTitle
              : phase === "ouvert"
                ? `${t.openLabel}`
                : t.beforeLabel}
          </span>
        </p>
        {cells && (
          <div className="flex gap-2 sm:gap-3">
            {cells.map(([value, label]) => (
              <div
                key={label}
                className="text-navy min-w-[4.25rem] rounded-xl bg-white px-2 py-1.5 text-center sm:min-w-[5rem]"
              >
                <div className="text-2xl leading-none font-bold tabular-nums sm:text-3xl">
                  {pad(Number(value))}
                </div>
                <div className="text-muted mt-1 text-xs font-semibold tracking-wide uppercase">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}
        {phase === "ouvert" && (
          <p className="text-base font-semibold text-white sm:text-lg">{t.reminderOpen}</p>
        )}
      </div>
    </div>
  );
}
