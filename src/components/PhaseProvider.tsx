"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { forcedNowMs, getPhase, type Phase } from "@/lib/phase";

type PhaseContextValue = {
  phase: Phase;
  /** « Maintenant » arrondi à la minute (évite de re-rendre tout le site chaque seconde). */
  minuteMs: number;
  /** Instant de rendu serveur : point de départ commun serveur/client (hydratation sûre). */
  initialNowMs: number;
};

const PhaseContext = createContext<PhaseContextValue | null>(null);

const floorMinute = (ms: number) => Math.floor(ms / 60_000) * 60_000;

/**
 * Horloge côté client. Avec NEXT_PUBLIC_FORCE_NOW, part de la date forcée et continue d'avancer.
 */
export function createClock(): () => number {
  const forced = forcedNowMs();
  const start = Date.now();
  return () => (forced !== null ? forced + (Date.now() - start) : Date.now());
}

export function PhaseProvider({
  initialNowMs,
  children,
}: {
  initialNowMs: number;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>(() => getPhase(initialNowMs));
  const [minuteMs, setMinuteMs] = useState(() => floorMinute(initialNowMs));

  useEffect(() => {
    const now = createClock();
    const tick = () => {
      const t = now();
      setPhase(getPhase(t));
      setMinuteMs(floorMinute(t));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <PhaseContext.Provider value={{ phase, minuteMs, initialNowMs }}>
      {children}
    </PhaseContext.Provider>
  );
}

export function usePhaseContext(): PhaseContextValue {
  const ctx = useContext(PhaseContext);
  if (!ctx) throw new Error("usePhaseContext doit être utilisé dans <PhaseProvider>.");
  return ctx;
}

export function usePhase(): Phase {
  return usePhaseContext().phase;
}

/** Instant courant mis à jour toutes les `intervalMs` (1 s par défaut). */
export function useNow(intervalMs = 1000): number {
  const { initialNowMs } = usePhaseContext();
  const [now, setNow] = useState(initialNowMs);
  useEffect(() => {
    const clock = createClock();
    const id = window.setInterval(() => setNow(clock()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
