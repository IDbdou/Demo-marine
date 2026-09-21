import { Hero } from "@/components/sections/Hero";
import { Presentation } from "@/components/sections/Presentation";
import { Eligibilite } from "@/components/sections/Eligibilite";
import { Evaluation } from "@/components/sections/Evaluation";
import { Prix } from "@/components/sections/Prix";
import { Calendrier } from "@/components/sections/Calendrier";
import { Faq } from "@/components/sections/Faq";
import { Candidature } from "@/components/sections/Candidature";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/ui/JsonLd";
import { eventLd, faqLd } from "@/lib/jsonld";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <JsonLd data={eventLd()} />
      <JsonLd data={faqLd()} />
      <Hero />
      <Presentation />
      <Eligibilite />
      <Evaluation />
      <Prix />
      <Calendrier />
      <Faq />
      <Candidature />
      <Contact />
    </>
  );
}
