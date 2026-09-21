"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { fr } from "@/content/fr";
import { buttonClasses } from "@/components/ui/Button";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Menu burger accessible : aria-expanded, focus piégé, Échap pour fermer, focus restitué. */
export function MobileMenu({ items }: { items: ReadonlyArray<{ id: string; label: string }> }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !wrapperRef.current) return;
      const nodes = Array.from(wrapperRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? fr.a11y.closeMenu : fr.a11y.openMenu}
        onClick={() => setOpen((v) => !v)}
        className="text-navy hover:bg-blue-soft inline-flex h-11 w-11 items-center justify-center rounded-full"
      >
        {open ? (
          <X aria-hidden="true" className="h-6 w-6" />
        ) : (
          <Menu aria-hidden="true" className="h-6 w-6" />
        )}
      </button>
      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={fr.a11y.menuTitle}
          className="border-line absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-white px-4 pt-2 pb-6 shadow-lg"
        >
          <nav aria-label={fr.a11y.mainNav}>
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="border-line/70 text-navy flex min-h-12 items-center border-b text-lg font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/#candidature"
            onClick={() => setOpen(false)}
            className={buttonClasses("primary", "lg", "mt-5 w-full")}
          >
            {fr.common.apply}
          </Link>
        </div>
      )}
    </div>
  );
}
