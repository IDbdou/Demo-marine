import { fr } from "@/content/fr";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Evaluation() {
  const ev = fr.evaluation;
  const total = ev.criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <Section id={ev.id} title={ev.title} tone="white">
      <h3 className="text-xl font-bold">{ev.gridTitle}</h3>

      {/* Desktop / tablette : tableau accessible */}
      <Reveal className="mt-5 hidden md:block">
        <div className="card overflow-hidden">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{ev.gridTitle}</caption>
            <thead className="bg-navy text-white">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  {ev.columns.criterion}
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  {ev.columns.description}
                </th>
                <th scope="col" className="w-[30%] px-5 py-3 font-semibold">
                  {ev.columns.weight}
                </th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {ev.criteria.map((c) => (
                <tr key={c.name}>
                  <th scope="row" className="text-navy px-5 py-4 font-bold">
                    {c.name}
                  </th>
                  <td className="text-muted px-5 py-4">{c.description}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden="true"
                        className="bg-blue-soft h-2.5 flex-1 overflow-hidden rounded-full"
                      >
                        <div
                          className="bg-blue-strong h-full rounded-full"
                          style={{ width: `${c.weight * 4}%` }}
                        />
                      </div>
                      <span className="text-navy w-14 text-right font-bold tabular-nums">
                        {c.weight} %
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-soft">
                <th
                  scope="row"
                  colSpan={2}
                  className="text-navy px-5 py-4 font-bold tracking-wide uppercase"
                >
                  {ev.totalLabel}
                </th>
                <td className="text-navy px-5 py-4 text-right font-extrabold tabular-nums">
                  {total} %
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Reveal>

      {/* Mobile : cartes empilées */}
      <ul className="mt-5 space-y-3 md:hidden">
        {ev.criteria.map((c) => (
          <li key={c.name} className="card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-navy font-bold">{c.name}</h4>
              <span className="text-navy text-lg font-extrabold tabular-nums">{c.weight} %</span>
            </div>
            <p className="text-muted mt-1">{c.description}</p>
            <div
              aria-hidden="true"
              className="bg-blue-soft mt-3 h-2.5 overflow-hidden rounded-full"
            >
              <div
                className="bg-blue-strong h-full rounded-full"
                style={{ width: `${c.weight * 4}%` }}
              />
            </div>
          </li>
        ))}
        <li className="bg-blue-soft text-navy flex items-center justify-between rounded-2xl px-4 py-3 font-extrabold tracking-wide uppercase">
          <span>{ev.totalLabel}</span>
          <span className="tabular-nums">{total} %</span>
        </li>
      </ul>

      <h3 className="mt-14 text-xl font-bold">{ev.processTitle}</h3>
      <ol className="mt-6 grid gap-6 md:grid-cols-3 md:gap-4">
        {ev.steps.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            delay={i * 100}
            className="relative flex gap-4 md:flex-col md:gap-3"
          >
            {i < ev.steps.length - 1 && (
              <span
                aria-hidden="true"
                className="bg-line absolute top-12 left-6 -ml-px h-[calc(100%+0.5rem)] w-0.5 md:top-6 md:left-14 md:ml-0 md:h-0.5 md:w-[calc(100%-2rem)]"
              />
            )}
            <span className="bg-navy relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white">
              <span className="sr-only">{ev.stepLabel} </span>
              {i + 1}
            </span>
            <div>
              <h4 className="text-lg font-bold">{s.title}</h4>
              <p className="text-muted">{s.description}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
