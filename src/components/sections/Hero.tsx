import Image from "next/image";
import { fr } from "@/content/fr";
import { SITE } from "@/config/site";
import { findPublicFile } from "@/lib/assets";
import { Countdown } from "@/components/ui/Countdown";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { HeroActions } from "./HeroActions";
import { HeroIllustration } from "./HeroIllustration";

export function Hero() {
  const h = fr.hero;
  // Photo optionnelle : déposer public/images/hero.(avif|webp|jpg|png) pour remplacer l'illustration.
  const heroImage = findPublicFile("images", "hero", ["avif", "webp", "jpg", "jpeg", "png"]);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="surface-dark from-navy to-navy-deep relative overflow-hidden bg-gradient-to-b pt-8 pb-14 text-white sm:pt-12 sm:pb-20 lg:pt-16"
    >
      <div className="wrap relative">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="flex flex-col gap-4">
            <h1
              id="hero-title"
              className="order-1 text-[2rem] leading-[1.1] font-extrabold sm:text-5xl lg:text-[3.4rem]"
            >
              {h.title}
            </h1>
            <p lang="en" className="text-blue-light order-2 text-lg font-medium italic sm:text-xl">
              {h.subtitleEn}
            </p>
            <p className="order-3 text-lg font-semibold text-white sm:text-xl">{h.tagline}</p>
            <p className="order-5 text-base text-white/90 sm:text-lg md:order-4">{h.intro}</p>
            <div className="order-4 mt-2 md:order-5">
              <HeroActions />
            </div>
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20 lg:aspect-[5/4]">
            {SITE.heroVideo.src ? (
              <LazyVideo
                src={SITE.heroVideo.src}
                poster={SITE.heroVideo.poster}
                title={SITE.heroVideo.title || h.title}
              />
            ) : heroImage ? (
              <div className="relative h-full w-full">
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <HeroIllustration />
            )}
          </div>
        </div>

        <div className="mt-10">
          <Countdown variant="hero" />
          <p className="mt-3 text-sm text-white/85 sm:text-base">{h.closingLine}</p>
        </div>
      </div>
    </section>
  );
}
