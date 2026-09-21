"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type AccordionItem = { q: string; a: string };

/** Accordéon accessible : boutons aria-expanded/aria-controls, plusieurs entrées ouvrables. */
export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  const base = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="divide-line border-line shadow-soft divide-y overflow-hidden rounded-2xl border bg-white">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const panelId = `${base}-panel-${i}`;
        const buttonId = `${base}-button-${i}`;
        return (
          <div key={item.q}>
            <h3 className="text-base font-semibold">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="text-navy hover:bg-blue-soft/60 flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span>
                  <span className="text-blue-strong mr-2">{i + 1}.</span>
                  {item.q}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "text-blue-strong h-5 w-5 shrink-0 transition-transform motion-reduce:transition-none",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="text-muted px-5 pb-5 pl-[2.6rem]"
            >
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
