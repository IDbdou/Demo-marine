import Link from "next/link";
import { fr } from "@/content/fr";

type Section = { title: string };

/** Structure de page juridique : rubriques prêtes, textes à compléter par le service juridique. */
export function LegalPage({
  title,
  sections,
  notice,
}: {
  title: string;
  sections: readonly Section[];
  notice?: string;
}) {
  return (
    <div className="bg-white py-14 sm:py-20">
      <article className="wrap max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {notice && (
          <p className="border-blue-strong bg-blue-soft text-navy mt-6 rounded-xl border-l-4 px-4 py-3">
            {notice}
          </p>
        )}
        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <section key={s.title} aria-labelledby={`legal-${i}`}>
              <h2 id={`legal-${i}`} className="text-xl font-bold">
                {i + 1}. {s.title}
              </h2>
              <p className="bg-sand text-muted mt-2 rounded-lg border border-dashed border-slate-400 px-4 py-3 font-semibold">
                {fr.legalPlaceholder}
              </p>
            </section>
          ))}
        </div>
        <Link
          href="/"
          className="text-blue-strong mt-10 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
        >
          {fr.legalPages.backHome}
        </Link>
      </article>
    </div>
  );
}
