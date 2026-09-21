"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const ApplicationForm = dynamic(() => import("./ApplicationForm").then((m) => m.ApplicationForm), {
  ssr: false,
  loading: () => <FormPlaceholder />,
});

function FormPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="card mx-auto min-h-[42rem] max-w-3xl animate-pulse motion-reduce:animate-none"
    />
  );
}

/**
 * Le formulaire (react-hook-form, zod…) n'est téléchargé que lorsque la section approche de l'écran :
 * il ne pèse donc pas sur le chargement initial de la page.
 */
export function LazyApplicationForm() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{near ? <ApplicationForm /> : <FormPlaceholder />}</div>;
}
