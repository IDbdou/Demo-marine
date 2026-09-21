import { fr } from "@/content/fr";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export function Eligibilite() {
  const e = fr.eligibility;
  return (
    <Section id={e.id} title={e.title} tone="soft">
      <p className="text-lg">{e.intro}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {e.profiles.map((p, i) => (
          <Reveal
            as="li"
            key={p.title}
            delay={(i % 3) * 80}
            className="card flex items-start gap-4 p-5"
          >
            <span className="bg-blue-soft text-blue-strong flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
              <Icon name={p.icon} className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="text-muted">{p.description}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Reveal className="card p-6">
          <h3 className="text-xl font-bold">{e.conditionsTitle}</h3>
          <ul className="mt-4 space-y-3">
            {e.conditions.map((c) => (
              <li key={c} className="flex gap-3">
                <span className="bg-green mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={90} className="card p-6">
          <h3 className="text-xl font-bold">{e.exclusionsTitle}</h3>
          <ul className="mt-4 space-y-3">
            {e.exclusions.map((c) => (
              <li key={c} className="flex gap-3">
                <span className="bg-danger mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                  <Icon name="cross" className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
