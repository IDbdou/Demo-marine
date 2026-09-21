import { fr } from "@/content/fr";
import { Section } from "@/components/ui/Section";
import { Accordion } from "@/components/ui/Accordion";

export function Faq() {
  return (
    <Section id={fr.faq.id} title={fr.faq.title} tone="sand">
      <div className="mx-auto max-w-3xl">
        <Accordion items={fr.faq.items} />
      </div>
    </Section>
  );
}
