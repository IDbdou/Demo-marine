"use client";

import { fr } from "@/content/fr";
import { MILESTONE_DATES } from "@/config/site";
import { cn } from "@/lib/cn";
import { getMilestoneStatuses, type MilestoneStatus } from "@/lib/phase";
import { usePhaseContext } from "@/components/PhaseProvider";
import { Icon } from "./Icon";

const statusLabel = fr.calendar.status;

/**
 * Timeline : verticale sur mobile, horizontale sur desktop. Les états (passé / en cours / prochaine /
 * à venir) sont calculés à partir de la date du jour, et exprimés par un texte en plus de la couleur.
 */
export function Timeline() {
  const { minuteMs } = usePhaseContext();
  const statuses = getMilestoneStatuses(minuteMs, MILESTONE_DATES);

  return (
    <ol className="relative grid gap-0 lg:grid-cols-6 lg:gap-4">
      {fr.calendar.milestones.map((m, i) => {
        const status: MilestoneStatus = statuses[m.id] ?? "upcoming";
        const highlighted = status === "current" || status === "next";
        return (
          <li
            key={m.id}
            aria-current={status === "current" ? "step" : undefined}
            className="relative flex gap-4 pb-8 last:pb-0 lg:flex-col lg:gap-3 lg:pb-0"
          >
            {/* Trait de liaison */}
            {i < fr.calendar.milestones.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-12 left-6 -ml-px h-[calc(100%-2rem)] w-0.5 lg:top-6 lg:left-14 lg:ml-0 lg:h-0.5 lg:w-[calc(100%-2rem)]",
                  status === "past" ? "bg-green" : "bg-line",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 lg:h-12 lg:w-12",
                status === "past" && "border-green bg-green text-white",
                status === "current" &&
                  "border-blue-strong bg-blue-strong ring-blue/30 text-white ring-4",
                status === "next" &&
                  "border-blue-strong text-blue-strong ring-blue/20 bg-white ring-4",
                status === "upcoming" && "border-line text-muted bg-white",
              )}
            >
              <Icon name={m.icon} className="h-5 w-5" />
            </span>
            <div
              className={cn(
                "min-w-0 flex-1 rounded-xl px-3 py-2 lg:flex-none lg:px-1",
                highlighted && "bg-blue-soft lg:bg-transparent",
              )}
            >
              <p
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase",
                  status === "past" && "bg-green/10 text-green",
                  status === "current" && "bg-blue-strong text-white",
                  status === "next" && "bg-blue-soft text-blue-strong",
                  status === "upcoming" && "bg-sand text-muted",
                )}
              >
                {statusLabel[status]}
              </p>
              <h3 className="text-navy mt-1.5 text-base font-bold">{m.label}</h3>
              <p className="text-blue-strong text-[0.95rem] font-semibold">{m.date}</p>
              <p className="text-muted text-[0.95rem]">{m.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
