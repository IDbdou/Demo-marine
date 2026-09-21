import { fr } from "@/content/fr";

/** Illustration originale : cages d'élevage, poissons et vagues (SVG, aucune ressource externe). */
export function HeroIllustration() {
  const fish = "M0 0c9-11 25-11 36 0-11 11-27 11-36 0Zm36 0 13-10v20Z";
  return (
    <svg
      viewBox="0 0 640 480"
      role="img"
      aria-label={fr.hero.illustrationAlt}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f3f6b" />
          <stop offset="0.55" stopColor="#2b8fcb" />
          <stop offset="1" stopColor="#cfe9f7" />
        </linearGradient>
        <linearGradient id="hi-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e88c8" />
          <stop offset="1" stopColor="#0a2a4a" />
        </linearGradient>
        <radialGradient id="hi-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4cf" stopOpacity="1" />
          <stop offset="1" stopColor="#fff4cf" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="480" fill="url(#hi-sky)" />
      <circle cx="470" cy="215" r="110" fill="url(#hi-sun)" />
      <circle cx="470" cy="215" r="34" fill="#fff4cf" />
      <rect y="228" width="640" height="252" fill="url(#hi-sea)" />

      {/* reflets */}
      <g stroke="#fff4cf" strokeLinecap="round" opacity="0.55">
        <path d="M440 240h60" strokeWidth="3" />
        <path d="M452 252h36" strokeWidth="3" />
        <path d="M462 264h16" strokeWidth="3" />
      </g>

      {/* vagues lointaines */}
      <g fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="2.5" strokeLinecap="round">
        <path d="M-20 262c30-10 60-10 90 0s60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0" />
        <path d="M-20 290c30-10 60-10 90 0s60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0 60 10 90 0 60-10 90 0" />
      </g>

      {/* cages d'élevage */}
      {[
        { x: 140, y: 318, s: 0.82 },
        { x: 320, y: 336, s: 1 },
        { x: 500, y: 318, s: 0.82 },
      ].map((c) => (
        <g key={c.x} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
          {/* filet immergé */}
          <path
            d="M-72 0 L-52 120 Q0 140 52 120 L72 0"
            fill="#fff"
            fillOpacity="0.07"
            stroke="#fff"
            strokeOpacity="0.32"
            strokeWidth="1.5"
          />
          <path
            d="M-36 8 L-26 128 M0 10 V136 M36 8 L26 128 M-64 40 Q0 58 64 40 M-60 76 Q0 94 60 76 M-56 110 Q0 126 56 110"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.28"
            strokeWidth="1.2"
          />
          {/* collier flottant */}
          <ellipse cx="0" cy="0" rx="76" ry="15" fill="#0a2a4a" fillOpacity="0.35" />
          <ellipse cx="0" cy="0" rx="76" ry="15" fill="none" stroke="#fff" strokeWidth="6" />
          <ellipse
            cx="0"
            cy="-1"
            rx="62"
            ry="10"
            fill="none"
            stroke="#7cc4ec"
            strokeWidth="2"
            strokeOpacity="0.9"
          />
          {/* montants */}
          <path
            d="M-70 -4V-30M0 -15V-44M70 -4V-30M-70 -28H70"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ))}

      {/* poissons */}
      <g fill="#cfe9f7">
        <g opacity="0.85">
          <path transform="translate(292 372) scale(0.9)" d={fish} />
          <path transform="translate(340 396) scale(0.7)" d={fish} />
          <path transform="translate(312 420) scale(0.55)" d={fish} />
        </g>
        <g opacity="0.6">
          <path transform="translate(96 384) scale(0.7)" d={fish} />
          <path transform="translate(470 392) scale(0.75) rotate(180 18 0)" d={fish} />
        </g>
        <path opacity="0.4" transform="translate(560 430) scale(0.5)" d={fish} />
      </g>

      {/* premier plan */}
      <path
        d="M-40 448c60-22 120-22 180 0s120 22 180 0 120-22 180 0 120 22 180 0V500H-40Z"
        fill="#0a2a4a"
        fillOpacity="0.85"
      />
      <path d="M0 470c80-14 160-14 240 0s160 14 240 0 120-8 160-4V480H0Z" fill="#061c33" />
    </svg>
  );
}
