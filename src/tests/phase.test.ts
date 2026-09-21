import { describe, expect, it } from "vitest";
import {
  forcedNowMs,
  getCountdownMode,
  getCountdownTarget,
  getMilestoneStatuses,
  getPhase,
  getRemaining,
} from "@/lib/phase";
import { CONTEST, MILESTONE_DATES } from "@/config/site";

const at = (iso: string) => new Date(iso);

describe("getPhase", () => {
  it("avant l'ouverture", () => {
    expect(getPhase(at("2026-11-08T23:59:59+01:00"))).toBe("avant-ouverture");
    expect(getPhase(at("2026-09-20T12:00:00+01:00"))).toBe("avant-ouverture");
  });

  it("pile à l'ouverture", () => {
    expect(getPhase(at("2026-11-09T00:00:00+01:00"))).toBe("ouvert");
  });

  it("pendant la période", () => {
    expect(getPhase(at("2026-11-20T10:00:00+01:00"))).toBe("ouvert");
  });

  it("dernière seconde encore ouverte", () => {
    expect(getPhase(at("2026-12-15T23:59:59+01:00"))).toBe("ouvert");
    expect(getPhase(at("2026-12-15T23:59:59.900+01:00"))).toBe("ouvert");
  });

  it("juste après la clôture", () => {
    expect(getPhase(at("2026-12-16T00:00:00+01:00"))).toBe("clos");
    expect(getPhase(at("2027-01-01T00:00:00+01:00"))).toBe("clos");
  });

  it("indépendant du fuseau d'expression de « maintenant » et du changement d'heure européen", () => {
    // Même instant exprimé en UTC : 2026-12-15T22:59:59Z = 23:59:59 au Maroc
    expect(getPhase(at("2026-12-15T22:59:59Z"))).toBe("ouvert");
    expect(getPhase(at("2026-12-15T23:00:00Z"))).toBe("clos");
    // Bascule à l'heure d'hiver en Europe (25 octobre 2026) : aucun effet sur la phase
    expect(getPhase(at("2026-10-25T01:30:00+02:00"))).toBe("avant-ouverture");
    expect(getPhase(at("2026-10-25T01:30:00+01:00"))).toBe("avant-ouverture");
    // Ouverture exprimée à l'heure de Paris (CET = +01:00 en novembre)
    expect(getPhase(at("2026-11-08T23:00:00Z"))).toBe("ouvert");
    expect(getPhase(at("2026-11-08T22:59:59Z"))).toBe("avant-ouverture");
  });

  it("accepte des fenêtres personnalisées", () => {
    const w = { opensAt: "2030-01-01T00:00:00+01:00", closesAt: "2030-01-02T23:59:59+01:00" };
    expect(getPhase(at("2030-01-01T12:00:00+01:00"), w)).toBe("ouvert");
  });
});

describe("getCountdownTarget / getRemaining", () => {
  it("cible l'ouverture avant, la clôture pendant, rien après", () => {
    const before = getCountdownTarget(at("2026-10-01T00:00:00+01:00"));
    expect(before.phase).toBe("avant-ouverture");
    expect(before.targetMs).toBe(new Date(CONTEST.opensAt).getTime());

    const open = getCountdownTarget(at("2026-11-20T10:00:00+01:00"));
    expect(open.phase).toBe("ouvert");
    expect(open.targetMs).toBe(new Date(CONTEST.closesAt).getTime() + 1000);

    expect(getCountdownTarget(at("2027-01-01T00:00:00+01:00")).targetMs).toBeNull();
  });

  it("décompose le temps restant", () => {
    const now = at("2026-12-13T21:00:00+01:00"); // 2 j 3 h avant minuit du 15 au 16
    const target = getCountdownTarget(now).targetMs as number;
    const r = getRemaining(now, target);
    expect(r).toMatchObject({ days: 2, hours: 3, minutes: 0, seconds: 0 });
    expect(getCountdownMode(r)).toBe("days");
  });

  it("passe en h/min/s sous 48 h", () => {
    const now = at("2026-12-14T23:59:59+01:00");
    const r = getRemaining(now, getCountdownTarget(now).targetMs as number);
    expect(r.totalMs).toBeLessThan(48 * 3600 * 1000);
    expect(getCountdownMode(r)).toBe("hms");
    const last = at("2026-12-15T23:59:59+01:00");
    const r2 = getRemaining(last, getCountdownTarget(last).targetMs as number);
    expect(r2).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 1 });
  });

  it("ne renvoie jamais de valeur négative", () => {
    expect(
      getRemaining(at("2030-01-01T00:00:00Z"), at("2026-01-01T00:00:00Z").getTime()).totalMs,
    ).toBe(0);
  });
});

describe("getMilestoneStatuses", () => {
  it("met en avant la prochaine étape avant le lancement", () => {
    const s = getMilestoneStatuses(at("2026-09-20T12:00:00+01:00"));
    expect(s.lancement).toBe("next");
    expect(s.cloture).toBe("upcoming");
  });

  it("marque l'étape en cours pendant une période", () => {
    const s = getMilestoneStatuses(at("2026-12-20T10:00:00+01:00"));
    expect(s.lancement).toBe("past");
    expect(s.cloture).toBe("past");
    expect(s.preselection).toBe("current");
    expect(s.finalistes).toBe("upcoming");
  });

  it("entre deux jalons, la suivante est « next »", () => {
    const s = getMilestoneStatuses(at("2026-11-20T10:00:00+01:00"));
    expect(s.lancement).toBe("past");
    expect(s.cloture).toBe("next");
  });

  it("tout est passé après la remise des prix", () => {
    const s = getMilestoneStatuses(at("2027-02-01T00:00:00+01:00"));
    expect(Object.values(s).every((v) => v === "past")).toBe(true);
    expect(Object.keys(s)).toHaveLength(MILESTONE_DATES.length);
  });
});

describe("forcedNowMs", () => {
  it("lit et valide la variable d'override", () => {
    expect(forcedNowMs("2026-11-20T10:00:00+01:00")).toBe(
      new Date("2026-11-20T10:00:00+01:00").getTime(),
    );
    expect(forcedNowMs("nimportequoi")).toBeNull();
    expect(forcedNowMs(undefined)).toBeNull();
  });
});
