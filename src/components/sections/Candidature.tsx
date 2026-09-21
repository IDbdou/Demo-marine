import { fr } from "@/content/fr";
import { Section } from "@/components/ui/Section";
import { ApplySwitch } from "./ApplySwitch";

export function Candidature() {
  const a = fr.apply;
  return (
    <Section id={a.id} title={a.title} tone="navy">
      <p className="max-w-2xl text-lg text-white/90">{a.intro}</p>
      <div className="mt-8">
        <ApplySwitch />
      </div>
    </Section>
  );
}
