# Concours d'Innovation Aquacole M-MAIN1 — landing page

Site officiel du concours **M-MAIN1 (Moroccan Marine Aqua Innovation)** organisé par l'ANDA : landing page en 10 sections et formulaire de candidature fonctionnel.

Source de vérité des contenus : `docs/_LANDING_PAGE_-_M-MAIN1.docx` (extrait dans `docs/source-content.md`).
Plan et hypothèses : `PLAN.md`.

**Stack** : Next.js (App Router) · TypeScript strict · Tailwind CSS 4 · react-hook-form + zod · lucide-react · nodemailer · Vitest · Playwright.

## Démarrage

Prérequis : Node.js ≥ 20.

```bash
npm install
cp .env.example .env.local   # puis adapter
npm run dev                  # http://localhost:3000
```

| Script                       | Rôle                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                | Serveur de développement                                                     |
| `npm run build` / `start`    | Build et serveur de production                                               |
| `npm run lint`               | ESLint                                                                       |
| `npm run typecheck`          | TypeScript (`tsc --noEmit`)                                                  |
| `npm run test`               | Tests unitaires Vitest                                                       |
| `npm run test:e2e`           | Tests Playwright (formulaire de bout en bout, API). Lance son propre serveur |
| `npm run export:submissions` | Génère `storage/submissions.csv` à partir des candidatures reçues            |
| `npm run format`             | Prettier                                                                     |

Première utilisation de Playwright : `npx playwright install chromium`.

## Où modifier quoi

| Je veux modifier…                                    | Fichier                                                   |
| ---------------------------------------------------- | --------------------------------------------------------- |
| **Tous les textes** (FAQ, prix, critères, libellés…) | `src/content/fr.ts`                                       |
| **Dates d'ouverture / clôture**, jalons du calendrier | `src/config/site.ts` (`CONTEST`, `MILESTONE_DATES`)       |
| Contacts, réseaux sociaux, URL du règlement          | `src/config/site.ts` (`CONTACTS`, `SOCIAL`, `SITE`)       |
| Limites de fichiers, longueur du résumé, anti-spam   | `src/config/site.ts` (`FILE_RULES`, `FORM_LIMITS`, `RATE_LIMIT`) |
| **Couleurs de la charte**                            | `src/app/globals.css`, bloc `:root` (tokens `--navy`, `--blue`, `--green`…) |
| Police                                               | `src/app/layout.tsx` (`next/font`, auto-hébergée)         |
| Masquer les chiffres clés                            | `presentation.keyFigures.enabled = false` dans `fr.ts`    |
| Illustration du hero                                 | Déposer `public/images/hero.(avif\|webp\|jpg\|png)` : elle remplace le SVG |
| Vidéo de présentation                                | `SITE.heroVideo` dans `site.ts` (chargée au clic, sans autoplay) |
| Logos                                                | Remplacer `public/logos/{anda,usee,halieutis}.svg` (ou `.png`) |

> Les dates de la fenêtre de candidature ne sont lues **que** dans `config/site.ts`. Fuseau : `Africa/Casablanca` (UTC+1 sur la période).
> La clôture est effective à 23:59:59 incluse ; le compte à rebours cible donc minuit.

### Version arabe / anglaise (préparation)

Toute la copie est dans un dictionnaire typé (`fr.ts`, exporté sous `fr`). Pour ajouter une langue : créer `ar.ts` / `en.ts` avec la même forme, choisir le dictionnaire selon la langue, et renseigner `lang` / `dir` (`rtl` pour l'arabe). Aucune traduction n'est fournie.

## Tester les 3 phases (override de date)

`NEXT_PUBLIC_FORCE_NOW` simule la date « maintenant » (côté client **et** serveur, y compris pour la fenêtre acceptée par l'API). C'est une variable `NEXT_PUBLIC_` : elle est intégrée au build, il faut donc **redémarrer** `npm run dev` (ou refaire `npm run build`) après l'avoir modifiée.

```bash
# PowerShell
$env:NEXT_PUBLIC_FORCE_NOW="2026-11-20T10:00:00+01:00"; npm run dev
# bash
NEXT_PUBLIC_FORCE_NOW=2026-11-20T10:00:00+01:00 npm run dev
```

| Valeur                          | Phase               |
| ------------------------------- | ------------------- |
| `2026-10-01T10:00:00+01:00`     | avant l'ouverture   |
| `2026-11-20T10:00:00+01:00`     | candidatures ouvertes |
| `2026-12-15T22:00:00+01:00`     | ouvert, dernières heures (h/min/s) |
| `2026-12-16T10:00:00+01:00`     | clos                |

**Ne jamais définir cette variable en production.**

## Candidatures : stockage, e-mail, sécurité

- Route : `POST /api/candidature` (multipart). Elle revalide tout côté serveur avec le même schéma zod que le client (`src/lib/schema.ts`) et applique la fenêtre de dates.
- Codes : `201` succès · `400` validation · `403` hors fenêtre ou origine refusée · `409` e-mail déjà utilisé · `413` requête trop volumineuse · `429` trop de tentatives · `500`.
- **Stockage par défaut** : `storage/submissions/<référence>/` avec `data.json` + fichiers (noms générés par le serveur, hors de `public/`, ignoré par git). Un index `_index/` garantit un seul dossier par e-mail (comparaison normalisée) même en cas d'envois simultanés. Dossier modifiable via `SUBMISSIONS_DIR`.
- **Brancher un autre stockage** (S3, base de données, Google Drive) : implémenter l'interface `SubmissionStorage` de `src/lib/storage.ts` (`existsByEmail`, `saveSubmission`) et changer la fonction `getStorage()`. Le reste du code (API, validation) n'est pas concerné.
- **E-mail** : avec `SMTP_HOST` (et `SMTP_*`), confirmation au candidat et copie à `SUBMISSIONS_NOTIFY_EMAIL`. Sans SMTP, le message est journalisé en console. Un échec d'e-mail n'annule pas la candidature.
- **Sécurité** : honeypot, limitation de débit par IP (en mémoire — un seul processus ; à remplacer par Redis en multi-instances), contrôle du type réel des fichiers (signature) et de l'extension, plafonds de taille, contrôle du nombre de pages du PDF (estimation), vérification de l'en-tête `Origin`, CSP et en-têtes de sécurité (`next.config.ts`), échappement des contenus dans les e-mails.
- Le **stockage sur disque exige un serveur Node persistant** (VPS, Docker avec volume). Sur Vercel/serverless, le disque est éphémère : brancher un stockage externe avant déploiement.

## Déploiement

**Node / Docker** : `npm ci && npm run build && npm start` (port 3000, variable `PORT`). Monter un volume sur `storage/`. Placer le site derrière un proxy HTTPS qui transmet `X-Forwarded-For`/`X-Forwarded-Host` et autorise des corps de requête jusqu'à ~130 Mo (`client_max_body_size` pour nginx).

**Vercel** : possible pour les pages, mais remplacer le stockage disque (voir ci-dessus) et noter la limite de ~4,5 Mo par requête des fonctions serverless, incompatible avec l'envoi de fichiers vidéo : prévoir un envoi direct vers un stockage objet.

La page d'accueil est régénérée chaque minute (`revalidate = 60`) pour que la phase affichée reste à jour côté serveur ; le compte à rebours se met ensuite à jour côté navigateur.

## À compléter avant mise en ligne

- [ ] **Logos** ANDA / USEE / Salon Halieutis : remplacer les SVG provisoires de `public/logos/` (`TODO(logo)`).
- [ ] **Charte graphique officielle ANDA** : remplacer les couleurs de départ dans `globals.css`.
- [ ] **Photos / vidéo d'aquaculture** : déposer `public/images/hero.*` ; renseigner `SITE.heroVideo`. Aujourd'hui : illustration SVG originale.
- [ ] **Règlement du concours (PDF)** : remplacer `public/docs/reglement-m-main1.pdf` (fichier provisoire).
- [ ] **Mentions légales** et **Politique de confidentialité** : textes à fournir par le service juridique (marqués `[À COMPLÉTER PAR LE SERVICE JURIDIQUE ANDA]`) ; faire valider la conformité **loi 09-08 / CNDP**.
- [ ] **URL LinkedIn / Facebook / Instagram** dans `SOCIAL` (icônes masquées tant qu'elles sont vides).
- [ ] **Nom de domaine** : `NEXT_PUBLIC_SITE_URL` (canonical, sitemap, Open Graph, JSON-LD).
- [ ] **SMTP** : `SMTP_*` et `SUBMISSIONS_NOTIFY_EMAIL`.
- [ ] **Stockage** adapté à l'hébergement retenu (voir plus haut) et sauvegarde de `storage/`.
- [ ] Confirmer avec l'ANDA : taille maximale de la vidéo (défaut 50 Mo), formats acceptés, et la formulation « À annoncer prochainement » pour les Prix Spéciaux Partenaires.
- [ ] Vérifier que `NEXT_PUBLIC_FORCE_NOW` n'est **pas** défini en production.
- [ ] Relire le libellé du numéro de référence (`MMAIN1-2026-0001`) et le contenu de l'e-mail de confirmation (`src/lib/mailer.ts`).
