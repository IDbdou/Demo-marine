import { Mail, Phone } from "lucide-react";
import { fr } from "@/content/fr";
import { CONTACTS, SOCIAL } from "@/config/site";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const socialPaths = {
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.55 4.77 5.87V21h-4v-5.1c0-1.22-.02-2.78-1.75-2.78-1.75 0-2.02 1.32-2.02 2.68V21h-4V9.75Z",
  facebook:
    "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.93.26-1.55 1.6-1.55h1.7V3.4c-.3-.04-1.3-.13-2.5-.13-2.5 0-4.2 1.5-4.2 4.3v2.23H7.3V13h2.8v8h3.4Z",
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.15 3.22-1.67 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85C2.42 3.92 3.94 2.37 7.15 2.27 8.42 2.2 8.8 2.2 12 2.2ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-9.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
} as const;

export function Contact() {
  const c = fr.contact;
  // Réseaux : icône affichée seulement si l'URL est renseignée dans config/site.ts (jamais de lien mort).
  const socials = (Object.keys(socialPaths) as Array<keyof typeof socialPaths>).filter(
    (k) => SOCIAL[k],
  );
  return (
    <Section id={c.id} title={c.title} tone="soft">
      <ul className="grid gap-5 md:grid-cols-2">
        {CONTACTS.map((p, i) => (
          <Reveal as="li" key={p.email} delay={i * 90} className="card p-6">
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-muted">{p.role}</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href={`mailto:${p.email}`}
                  className="text-blue-strong inline-flex min-h-11 items-center gap-3 font-semibold underline-offset-4 hover:underline"
                >
                  <Mail aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                  <span className="sr-only">{c.emailLabel} : </span>
                  <span className="break-all">{p.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${p.phoneIntl}`}
                  className="text-blue-strong inline-flex min-h-11 items-center gap-3 font-semibold underline-offset-4 hover:underline"
                >
                  <Phone aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                  <span className="sr-only">{c.phoneLabel} : </span>
                  {p.phoneDisplay}
                </a>
              </li>
            </ul>
          </Reveal>
        ))}
      </ul>

      {socials.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">{c.socialTitle}</h3>
          <ul className="mt-3 flex gap-3">
            {socials.map((k) => (
              <li key={k}>
                <a
                  href={SOCIAL[k]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={c.social[k]}
                  className="bg-navy hover:bg-blue-strong flex h-11 w-11 items-center justify-center rounded-full text-white"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                  >
                    <path d={socialPaths[k]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
