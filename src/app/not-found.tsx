import { fr } from "@/content/fr";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-white py-24">
      <div className="wrap max-w-2xl text-center">
        <p className="text-blue-strong text-6xl font-extrabold" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 text-3xl font-extrabold">{fr.notFound.title}</h1>
        <p className="text-muted mx-auto mt-3">{fr.notFound.text}</p>
        <Button href="/" className="mt-8">
          {fr.notFound.home}
        </Button>
      </div>
    </div>
  );
}
