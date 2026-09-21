import { fr } from "@/content/fr";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/ui/Timeline";
import { Countdown } from "@/components/ui/Countdown";

export function Calendrier() {
  const c = fr.calendar;
  return (
    <Section id={c.id} title={c.title} tone="white">
      <Timeline />
      <div className="bg-blue-soft mt-12 rounded-2xl px-5 py-4">
        <Countdown variant="inline" />
      </div>
    </Section>
  );
}
