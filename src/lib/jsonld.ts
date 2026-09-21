import { fr } from "@/content/fr";
import { SITE } from "@/config/site";

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: fr.meta.organization,
    alternateName: fr.meta.organizationShort,
    url: SITE.url,
    logo: `${SITE.url}/logos/anda.svg`,
  };
}

/** Finale au Salon Halieutis, Agadir, 27-31 janvier 2027 (données du document source). */
export function eventLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: fr.meta.eventName,
    description: fr.meta.description,
    startDate: "2027-01-27",
    endDate: "2027-01-31",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Salon Halieutis",
      address: { "@type": "PostalAddress", addressLocality: "Agadir", addressCountry: "MA" },
    },
    organizer: { "@type": "Organization", name: fr.meta.organization, url: SITE.url },
    image: [`${SITE.url}/opengraph-image`],
    url: SITE.url,
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fr.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
