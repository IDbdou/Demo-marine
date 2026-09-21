import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import { fr } from "@/content/fr";
import { SITE } from "@/config/site";
import { getServerNowMs } from "@/lib/phase";
import { PhaseProvider } from "@/components/PhaseProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationLd } from "@/lib/jsonld";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

/** La page est régénérée chaque minute : la phase affichée côté serveur reste à jour. */
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: fr.meta.title,
  description: fr.meta.description,
  keywords: [...fr.meta.keywords],
  applicationName: "M-MAIN1",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "/",
    siteName: "M-MAIN1",
    title: fr.meta.title,
    description: fr.meta.description,
  },
  twitter: { card: "summary_large_image", title: fr.meta.title, description: fr.meta.description },
};

export const viewport: Viewport = { themeColor: "#0A2A4A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nowMs = getServerNowMs();
  return (
    <html lang={fr.lang} dir={fr.dir} className={openSans.variable} data-scroll-behavior="smooth">
      <body>
        <JsonLd data={organizationLd()} />
        <a
          href="#main"
          className="sr-only-focusable text-navy fixed top-4 left-4 z-[100] rounded-full bg-white px-5 py-3 font-semibold shadow-lg"
        >
          {fr.a11y.skipToContent}
        </a>
        <PhaseProvider initialNowMs={nowMs}>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <FloatingCta />
        </PhaseProvider>
      </body>
    </html>
  );
}
