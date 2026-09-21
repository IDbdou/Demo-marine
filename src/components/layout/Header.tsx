import Link from "next/link";
import { fr } from "@/content/fr";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "./MobileMenu";
import { HeaderCta } from "./HeaderCta";

export function Header() {
  return (
    <header className="border-line sticky top-0 z-50 border-b bg-white">
      <div className="wrap relative flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label={fr.a11y.homeLink}
            className="text-navy flex items-center gap-2"
          >
            <svg aria-hidden="true" viewBox="0 0 32 32" className="h-8 w-8" fill="none">
              <circle cx="16" cy="16" r="15" fill="#0A2A4A" />
              <path
                d="M5 19c3.5-4.5 6 4.5 9.500 0s6 4.500 9.500 0 2.500-1.500 3-2"
                stroke="#7CC4EC"
                strokeWidth="2.200"
                strokeLinecap="round"
              />
              <path
                d="M9 13c2-3 4.500-3 7-1.500S21 12 23 10"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                opacity=".85"
              />
            </svg>
            <span className="text-xl font-extrabold tracking-tight whitespace-nowrap">M-MAIN1</span>
          </Link>
          <span aria-hidden="true" className="bg-line hidden h-6 w-px md:block" />
          <Logo
            name="anda"
            alt={fr.a11y.andaLogo}
            label="ANDA"
            height={32}
            className="text-navy hidden md:inline-flex"
          />
        </div>

        <nav aria-label={fr.a11y.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {fr.nav.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  className="text-navy hover:bg-blue-soft inline-flex min-h-11 items-center rounded-full px-3 text-[0.95rem] font-semibold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <HeaderCta />
          <MobileMenu items={fr.nav} />
        </div>
      </div>
    </header>
  );
}
