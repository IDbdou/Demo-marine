import type { Metadata } from "next";
import { fr } from "@/content/fr";
import { LegalPage } from "@/components/layout/LegalPage";

const page = fr.legalPages.privacy;
export const metadata: Metadata = {
  title: `${page.title} | M-MAIN1`,
  alternates: { canonical: `/${page.slug}` },
  robots: { index: false },
};

export default function PolitiqueConfidentialite() {
  return <LegalPage title={page.title} sections={page.sections} notice={page.lawNotice} />;
}
