import { CONTEST, MILESTONE_DATES, type MilestoneId } from "@/config/site";

export type Phase = "avant-ouverture" | "ouvert" | "clos";

export type ContestWindow = { opensAt: string; closesAt: string };

export type Remaining = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Sous ce seuil, le compte à rebours passe en heures / minutes / secondes. */
export const HMS_THRESHOLD_MS = 48 * HOUR;

function toMs(value: Date | number | string): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

/** Instant d'ouverture (inclus). */
export function opensAtMs(window: ContestWindow = CONTEST): number {
  return toMs(window.opensAt);
}

/**
 * Instant à partir duquel le concours est clos : la seconde 23:59:59 est encore « ouvert »,
 * la clôture effective est donc 1 s plus tard (00:00:00 le lendemain).
 */
export function closedFromMs(window: ContestWindow = CONTEST): number {
  return toMs(window.closesAt) + SECOND;
}

export function getPhase(now: Date | number, window: ContestWindow = CONTEST): Phase {
  const t = toMs(now);
  if (t < opensAtMs(window)) return "avant-ouverture";
  if (t < closedFromMs(window)) return "ouvert";
  return "clos";
}

/** Cible du compte à rebours : ouverture avant, clôture pendant, aucune après. */
export function getCountdownTarget(now: Date | number, window: ContestWindow = CONTEST) {
  const phase = getPhase(now, window);
  const targetMs =
    phase === "avant-ouverture"
      ? opensAtMs(window)
      : phase === "ouvert"
        ? closedFromMs(window)
        : null;
  return { phase, targetMs };
}

export function getRemaining(now: Date | number, targetMs: number): Remaining {
  const totalMs = Math.max(0, targetMs - toMs(now));
  return {
    totalMs,
    days: Math.floor(totalMs / DAY),
    hours: Math.floor((totalMs % DAY) / HOUR),
    minutes: Math.floor((totalMs % HOUR) / MINUTE),
    seconds: Math.floor((totalMs % MINUTE) / SECOND),
  };
}

/** « jours » tant qu'il reste au moins 48 h, « hms » ensuite. */
export function getCountdownMode(remaining: Remaining): "days" | "hms" {
  return remaining.totalMs >= HMS_THRESHOLD_MS ? "days" : "hms";
}

export type MilestoneStatus = "past" | "current" | "next" | "upcoming";

/** Début de journée (heure du Maroc, +01:00) pour une date `YYYY-MM-DD`. */
function dayStartMs(day: string): number {
  return toMs(`${day}T00:00:00+01:00`);
}

/**
 * Statut de chaque jalon : passé, en cours (le jour, ou la période, en cours),
 * « next » pour le premier jalon à venir s'il n'y a rien en cours, sinon « upcoming ».
 */
export function getMilestoneStatuses(
  now: Date | number,
  milestones: ReadonlyArray<{ id: MilestoneId; start: string; end?: string }> = MILESTONE_DATES,
): Record<string, MilestoneStatus> {
  const t = toMs(now);
  const result: Record<string, MilestoneStatus> = {};
  let anyCurrent = false;
  let nextAssigned = false;
  for (const m of milestones) {
    const start = dayStartMs(m.start);
    const endExclusive = dayStartMs(m.end ?? m.start) + DAY;
    if (t >= endExclusive) result[m.id] = "past";
    else if (t >= start) {
      result[m.id] = "current";
      anyCurrent = true;
    } else result[m.id] = "upcoming";
  }
  if (!anyCurrent) {
    for (const m of milestones) {
      if (!nextAssigned && result[m.id] === "upcoming") {
        result[m.id] = "next";
        nextAssigned = true;
      }
    }
  }
  return result;
}

/**
 * « Maintenant » de l'application. `NEXT_PUBLIC_FORCE_NOW` permet de simuler une date (tests, recette).
 * Valeur ISO 8601 avec fuseau, ex. 2026-11-20T10:00:00+01:00. À ne pas définir en production.
 */
export function forcedNowMs(
  env: string | undefined = process.env.NEXT_PUBLIC_FORCE_NOW,
): number | null {
  if (!env) return null;
  const t = new Date(env).getTime();
  return Number.isNaN(t) ? null : t;
}

export function getServerNowMs(): number {
  return forcedNowMs() ?? Date.now();
}
