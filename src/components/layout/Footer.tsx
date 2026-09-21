import Link from "next/link";
import { fr } from "@/content/fr";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const f = fr.footer;
  return (
    <footer className="surface-dark bg-navy text-white">
      <div className="wrap py-12">
        <h2 className="sr-only">{f.partners}</h2>
        <ul className="flex flex-wrap items-center gap-4">
          {(
            [
              ["anda", fr.a11y.andaLogo, "ANDA"],
              ["usee", fr.a11y.useeLogo, "USEE"],
              ["halieutis", fr.a11y.halieutisLogo, "HALIEUTIS"],
            ] as const
          ).map(([name, alt, label]) => (
            <li key={name} className="rounded-xl bg-white px-4 py-3">
              <Logo name={name} alt={alt} label={label} height={40} className="text-navy" />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-4 border-t border-white/20 pt-6 text-[0.95rem] sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label={f.navLabel}>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              <li>
                <Link
                  href="/mentions-legales"
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  {f.legal}
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                >
                  {f.privacy}
                </Link>
              </li>
            </ul>
          </nav>
          <p className="text-white/85">{f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
