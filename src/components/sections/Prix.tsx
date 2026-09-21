import { fr } from "@/content/fr";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export function Prix() {
  const p = fr.prizes;
  const [featured, ...others] = p.items;
  return (
    <Section id={p.id} title={p.title} tone="soft">
      {featured && (
        <Reveal>
          <article className="surface-dark from-navy shadow-soft relative overflow-hidden rounded-3xl bg-gradient-to-br to-[#0d3d6b] p-7 text-white sm:p-10">
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="text-blue-light flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30">
                <Icon name={featured.icon} className="h-11 w-11" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="text-2xl font-extrabold sm:text-3xl">{featured.name}</h3>
                <p className="mt-1 text-lg text-white/90">{featured.description}</p>
                <p className="text-navy mt-4 inline-flex rounded-full bg-white px-4 py-1.5 font-bold">
                  <span className="sr-only">{p.rewardLabel} : </span>
                  {featured.reward}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      )}

      <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 80} className="card flex flex-col p-6">
            <span className="bg-blue-soft text-blue-strong flex h-12 w-12 items-center justify-center rounded-xl">
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{item.name}</h3>
            <p className="text-muted mt-1">{item.description}</p>
            <p className="text-navy mt-auto pt-4 font-semibold">
              <span className="sr-only">{p.rewardLabel} : </span>
              {item.reward}
            </p>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-navy text-3xl font-extrabold sm:text-4xl">{p.total.value}</p>
        <p className="text-blue-strong text-xl font-semibold">{p.total.label}</p>
      </Reveal>

      <div className="mt-12">
        <h3 className="text-xl font-bold sm:text-2xl">{p.supportTitle}</h3>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.support.map((s) => (
            <li
              key={s.label}
              className="ring-line flex items-center gap-3 rounded-2xl bg-white px-4 py-4 ring-1"
            >
              <span className="bg-green/10 text-green flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <span className="text-navy font-semibold">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
