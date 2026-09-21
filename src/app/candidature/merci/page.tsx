import type { Metadata } from "next";
import { CircleCheck } from "lucide-react";
import { fr } from "@/content/fr";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: fr.thanks.metaTitle,
  robots: { index: false, follow: false },
};

const REF_RE = /^MMAIN1-\d{4}-\d{4}$/;

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const reference = ref && REF_RE.test(ref) ? ref : null;
  const t = fr.thanks;
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="wrap max-w-2xl">
        <div className="card p-8 text-center sm:p-12">
          <span className="bg-green/10 text-green mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <CircleCheck aria-hidden="true" className="h-9 w-9" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold sm:text-3xl">{t.title}</h1>
          {reference && (
            <div className="mt-6" role="status">
              <p className="text-muted">{t.reference}</p>
              <p
                className="text-navy mt-1 text-3xl font-extrabold tracking-wide"
                data-testid="reference"
              >
                {reference}
              </p>
              <p className="text-muted mx-auto mt-2 text-sm">{t.keepReference}</p>
            </div>
          )}
          <p className="mx-auto mt-6 text-lg">{t.confirmation}</p>
          <p className="text-muted mx-auto mt-2 text-sm">{t.irreversible}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/">{t.home}</Button>
            <Button href="/#calendrier" variant="secondary">
              {t.calendar}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
