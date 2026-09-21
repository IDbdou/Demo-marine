import { fr } from "@/content/fr";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export function Presentation() {
  const p = fr.presentation;
  return (
    <Section id={p.id} title={p.title} tone="white">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <p className="text-ink text-lg">{p.text}</p>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-navy font-semibold">{p.objectivesIntro}</p>
          <ul className="mt-3 space-y-3">
            {p.objectives.map((o) => (
              <li key={o} className="flex gap-3">
                <span className="bg-green mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <h3 className="mt-14 text-xl font-bold sm:text-2xl">{p.axesTitle}</h3>
      <ul className="mt-6 grid gap-5 md:grid-cols-3">
        {p.axes.map((axis, i) => (
          <Reveal as="li" key={axis.id} delay={i * 90} className="card flex flex-col p-6">
            <span className="bg-blue-soft text-blue-strong flex h-14 w-14 items-center justify-center rounded-2xl">
              <Icon name={axis.icon} className="h-7 w-7" />
            </span>
            <h4 className="mt-5 text-xl font-bold">{axis.title}</h4>
            <p className="text-muted mt-2">{axis.description}</p>
            <div className="border-line mt-5 border-t pt-4">
              <p className="text-blue-strong text-xs font-bold tracking-wider uppercase">
                {p.examplesLabel}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {axis.examples.map((ex) => (
                  <li
                    key={ex}
                    className="bg-blue-soft text-navy rounded-full px-3 py-1 text-sm font-semibold"
                  >
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>

      {p.keyFigures.enabled && (
        <Reveal className="mt-14">
          <section
            aria-label={p.keyFigures.title}
            className="surface-dark bg-navy rounded-3xl px-6 py-8 text-white sm:px-10"
          >
            <ul className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
              {p.keyFigures.items.map((item) => (
                <li key={item.label} className="text-center lg:text-left">
                  <p className="text-3xl font-extrabold text-white sm:text-4xl">{item.value}</p>
                  <p className="text-blue-light mt-1">{item.label}</p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}
    </Section>
  );
}
