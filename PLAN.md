# PLAN — Landing page M-MAIN1

Source de vérité : `docs/_LANDING_PAGE_-_M-MAIN1.docx` (extrait dans `docs/source-content.md`, vérifié : 10 sections, 7 tableaux, FAQ de 10 questions, 2 contacts, notes).

## Architecture

- Next.js (App Router) + TypeScript strict + Tailwind CSS 4 (tokens dans `globals.css`, `@theme`).
- Toute la copie dans `src/content/fr.ts` ; dates, contacts, limites de fichiers, réseaux dans `src/config/site.ts`.
- Composants serveur par défaut. `"use client"` uniquement : Countdown/PhaseProvider, Accordion, formulaire, menu mobile, Reveal, bouton flottant.
- Logique de phase pure (`lib/phase.ts`) partagée client/serveur, testée avec Vitest.
- Schéma zod unique (`lib/schema.ts`) utilisé par react-hook-form et par l'API.
- Stockage isolé derrière une interface (`lib/storage.ts`), implémentation fichiers par défaut.

## Étapes

1. Config + tokens + `fr.ts` + `site.ts`
2. Layout, header, footer, menu mobile
3. Hero + compte à rebours + `phase.ts` (tests)
4. Sections 2 à 7
5. Formulaire + API + stockage + e-mail
6. Pages annexes (mentions, confidentialité, merci, 404)
7. SEO / JSON-LD / sitemap / robots / OG
8. Vérifications (lint, typecheck, test, build), captures, tests bout en bout du formulaire, README

## Hypothèses

- Date du jour du système : 20/09/2026 → phase « avant ouverture » par défaut.
- Heure du Maroc : UTC+1 fixe en pratique sur la période (le Maroc suspend l'heure d'été pendant le Ramadan ; les dates du concours sont interprétées en `+01:00`). Le calcul passe par `Intl` avec `Africa/Casablanca` pour l'affichage.
- Palette : valeurs de départ du cahier des charges, à remplacer en un seul endroit.
- Le nombre de pages PDF est estimé côté serveur (comptage des objets `/Type /Page`) ; les PDF à flux d'objets compressés peuvent échapper au contrôle (non bloquant dans ce cas).
