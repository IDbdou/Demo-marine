import { deepFrTypo } from "@/lib/typo";

/**
 * TOUTE la copie du site (français). Source : docs/_LANDING_PAGE_-_M-MAIN1.docx.
 * Modifier ici sans toucher aux composants. Pour une version arabe (RTL) ou anglaise :
 * créer `ar.ts` / `en.ts` avec la même forme et brancher le choix de langue dans `content/index.ts`.
 * La typographie française (espaces insécables, etc.) est appliquée automatiquement en bas de fichier.
 */
const raw = {
  lang: "fr",
  dir: "ltr",

  meta: {
    title: "Concours d’Innovation Aquacole M-MAIN1 | ANDA – Aquaculture, Maroc",
    description:
      "Concours d’innovation aquacole M-MAIN1 (Moroccan Marine Aqua Innovation) organisé par l’ANDA : startups, chercheurs, étudiants et entrepreneurs, candidatez avant le 15 décembre 2026 et concourez pour 300 000 DH de prix.",
    keywords: ["concours", "innovation", "aquaculture", "Maroc", "M-MAIN1", "ANDA", "Halieutis"],
    ogAlt: "Concours d’Innovation Aquacole M-MAIN1 – Moroccan Marine Aqua Innovation",
    organization: "Agence Nationale pour le Développement de l’Aquaculture (ANDA)",
    organizationShort: "ANDA",
    eventName: "Finale du Concours d’Innovation Aquacole M-MAIN1",
    eventLocation: "Salon Halieutis, Agadir",
  },

  a11y: {
    skipToContent: "Aller au contenu principal",
    mainNav: "Navigation principale",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    menuTitle: "Menu",
    homeLink: "M-MAIN1 – retour à l’accueil",
    decorativeVisual: "",
    andaLogo: "Logo de l’ANDA",
    useeLogo: "Logo de l’USEE",
    halieutisLogo: "Logo du Salon Halieutis",
    backToTop: "Retour en haut de page",
  },

  nav: [
    { id: "presentation", label: "Présentation" },
    { id: "eligibilite", label: "Éligibilité" },
    { id: "evaluation", label: "Évaluation" },
    { id: "prix", label: "Prix" },
    { id: "calendrier", label: "Calendrier" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
  ],

  common: {
    apply: "Je candidate",
  },

  /* ───────── Section 1 : Hero ───────── */
  hero: {
    id: "hero",
    title: "Concours d’Innovation Aquacole M-MAIN1",
    subtitleEn: "Moroccan Marine Aqua Innovation",
    tagline: "Transformez votre idée en solution innovante pour l’aquaculture marocaine",
    intro:
      "L’Agence Nationale pour le Développement de l’Aquaculture (ANDA) lance la première édition du Concours d’Innovation Aquacole M-MAIN1. Startups, chercheurs, étudiants, entrepreneurs : participez et faites la différence !",
    ctaApply: "Je candidate",
    ctaMore: "En savoir plus",
    /** Variantes selon la phase du concours. */
    ctaBefore: "Être prévenu de l’ouverture",
    ctaClosed: "Voir le calendrier",
    closingLine: "Clôture des candidatures : 15 décembre 2026",
    illustrationAlt: "Illustration : cages d’élevage en mer, poissons et vagues au lever du jour",
    videoOpen: "Lire la vidéo de présentation",
  },

  countdown: {
    beforeLabel: "Ouverture des candidatures dans",
    openLabel: "Plus que",
    closedTitle: "Les candidatures sont closes",
    closedText: "Merci à toutes et à tous pour votre intérêt pour le concours M-MAIN1.",
    daysOne: "jour",
    daysMany: "jours",
    /** Formes courtes affichées dans les cases (h / min / s). */
    unitDays: "Jours",
    unitHours: "Heures",
    unitMinutes: "Minutes",
    unitSeconds: "Secondes",
    /** Résumés statiques pour lecteurs d’écran. */
    srBefore: "Les candidatures ouvriront le 9 novembre 2026.",
    srOpen: "Les candidatures sont ouvertes jusqu’au 15 décembre 2026.",
    srClosed: "Les candidatures sont closes.",
    timerLabel: "Compte à rebours",
    reminderOpen: "pour candidater !",
    reminderBefore: "avant l’ouverture des candidatures.",
  },

  /* ───────── Section 2 : Présentation ───────── */
  presentation: {
    id: "presentation",
    title: "Un concours pour stimuler l’innovation aquacole au Maroc",
    text: "Le secteur aquacole marocain est un levier de développement socio-économique des régions côtières. Fruit de la stratégie Halieutis, l’ANDA œuvre depuis 2011 au développement d’une aquaculture durable.",
    objectivesIntro: "Le Concours M-MAIN1 vise à :",
    objectives: [
      "Encourager la créativité et l’esprit entrepreneurial",
      "Identifier et promouvoir des projets à fort potentiel d’impact",
      "Favoriser les synergies entre chercheurs, porteurs de projets et acteurs économiques",
    ],
    axesTitle: "Les 3 axes d’innovation",
    examplesLabel: "Exemples",
    axes: [
      {
        id: "technologique",
        icon: "cpu",
        title: "Innovation technologique",
        description: "IA, capteurs, traçabilité, biotechnologies, digitalisation",
        examples: ["Systèmes de monitoring", "Applications mobiles"],
      },
      {
        id: "durabilite",
        icon: "leaf",
        title: "Durabilité environnementale",
        description: "Économie circulaire, résilience climatique, efficacité énergétique",
        examples: ["Valorisation des déchets", "Énergies renouvelables"],
      },
      {
        id: "pratiques",
        icon: "settings",
        title: "Optimisation des pratiques",
        description: "Techniques d’élevage, logistique, qualité, formation",
        examples: ["Automatisation", "Chaîne du froid"],
      },
    ],
    keyFigures: {
      /** Passer à `false` pour masquer le bandeau des chiffres clés. */
      enabled: true,
      title: "Chiffres clés",
      items: [
        { value: "50-100", label: "candidatures attendues" },
        { value: "10-15", label: "finalistes" },
        { value: "4-6", label: "lauréats" },
        { value: "300 000 DH", label: "de prix" },
      ],
    },
  },

  /* ───────── Section 3 : Éligibilité ───────── */
  eligibility: {
    id: "eligibilite",
    title: "Qui peut participer ?",
    intro: "Le concours s’adresse à :",
    profiles: [
      { icon: "rocket", title: "Startups", description: "Jeunes entreprises innovantes" },
      {
        icon: "research",
        title: "Doctorants & Chercheurs",
        description: "Travaux de recherche appliquée",
      },
      { icon: "student", title: "Étudiants", description: "Niveau Master ou Ingénieur" },
      { icon: "entrepreneur", title: "Jeunes entrepreneurs", description: "Porteurs de projets" },
      { icon: "professional", title: "Professionnels", description: "Acteurs du secteur aquacole" },
      {
        icon: "cooperative",
        title: "Coopératives",
        description: "Unions et coopératives aquacoles",
      },
    ],
    conditionsTitle: "Conditions",
    conditions: [
      "Être ressortissant marocain ou résider légalement au Maroc",
      "Présenter un projet en lien avec les thématiques du concours",
      "Accepter le règlement du concours",
    ],
    exclusionsTitle: "Ne peuvent pas participer",
    exclusions: [
      "Les membres du jury et leurs proches",
      "Le personnel de l’ANDA et de l’USEE",
      "Les personnes condamnées pour fraude",
    ],
  },

  /* ───────── Section 4 : Évaluation ───────── */
  evaluation: {
    id: "evaluation",
    title: "Comment votre projet sera-t-il évalué ?",
    gridTitle: "Grille d’évaluation",
    columns: { criterion: "Critère", description: "Description", weight: "Pondération" },
    totalLabel: "Total",
    criteria: [
      {
        name: "Innovation",
        description: "Originalité, nouveauté, caractère disruptif",
        weight: 25,
      },
      {
        name: "Impact",
        description: "Potentiel d’impact sur le secteur aquacole",
        weight: 25,
      },
      {
        name: "Faisabilité",
        description: "Réalisme technique, économique et opérationnel",
        weight: 20,
      },
      {
        name: "Durabilité",
        description: "Prise en compte des enjeux environnementaux et sociaux",
        weight: 15,
      },
      {
        name: "Qualité de la présentation",
        description: "Clarté, structuration, qualité du pitch",
        weight: 15,
      },
    ],
    processTitle: "Processus d’évaluation",
    stepLabel: "Étape",
    steps: [
      { title: "Présélection", description: "Évaluation des dossiers par le comité" },
      { title: "Finale", description: "Pitchs devant le jury au Salon Halieutis" },
      { title: "Délibération", description: "Désignation des lauréats" },
    ],
  },

  /* ───────── Section 5 : Prix ───────── */
  prizes: {
    id: "prix",
    title: "Ce que vous pouvez gagner",
    total: { value: "300 000 DH", label: "de prix" },
    rewardLabel: "Récompense",
    items: [
      {
        id: "grand-prix",
        icon: "trophy",
        featured: true,
        name: "Grand Prix M-MAIN1",
        description: "Meilleur projet toutes catégories",
        reward: "Prix financier + accompagnement",
      },
      {
        id: "innovation",
        icon: "cpu",
        featured: false,
        name: "Prix de l’Innovation Technologique",
        description: "Meilleure solution technologique",
        reward: "Prix financier + mentorat",
      },
      {
        id: "durabilite",
        icon: "leaf",
        featured: false,
        name: "Prix de la Durabilité",
        description: "Meilleur projet durable",
        reward: "Prix financier + mentorat",
      },
      {
        id: "public",
        icon: "cooperative",
        featured: false,
        name: "Prix du Public",
        description: "Projet le plus voté",
        reward: "Visibilité médiatique",
      },
      {
        id: "partenaires",
        icon: "award",
        featured: false,
        name: "Prix Spéciaux Partenaires",
        description: "Prix thématiques",
        /* Adaptation éditoriale : le document indique « À définir avec les partenaires ». */
        reward: "À annoncer prochainement",
      },
    ],
    supportTitle: "Programme d’accompagnement",
    support: [
      { icon: "mentor", label: "Mentorat personnalisé" },
      { icon: "b2b", label: "Rencontres B2B" },
      { icon: "media", label: "Valorisation médiatique" },
      { icon: "industry", label: "Accompagnement à l’industrialisation" },
    ],
  },

  /* ───────── Section 6 : Calendrier ───────── */
  calendar: {
    id: "calendrier",
    title: "Les dates clés du concours",
    status: {
      past: "Terminé",
      current: "En cours",
      next: "Prochaine étape",
      upcoming: "À venir",
    },
    milestones: [
      {
        id: "lancement",
        icon: "launch",
        label: "Lancement de l’appel",
        date: "9 novembre 2026",
        description: "Ouverture des candidatures",
      },
      {
        id: "cloture",
        icon: "deadline",
        label: "Clôture",
        date: "15 décembre 2026",
        description: "Fermeture des candidatures",
      },
      {
        id: "preselection",
        icon: "review",
        label: "Présélection",
        date: "16 – 27 décembre 2026",
        description: "Évaluation des dossiers",
      },
      {
        id: "finalistes",
        icon: "announce",
        label: "Annonce des finalistes",
        date: "28 décembre 2026",
        description: "Publication des finalistes",
      },
      {
        id: "finale",
        icon: "final",
        label: "Finale",
        date: "27-31 janvier 2027",
        description: "Salon Halieutis, Agadir",
      },
      {
        id: "prix",
        icon: "trophy",
        label: "Remise des prix",
        date: "31 janvier 2027",
        description: "Cérémonie officielle",
      },
    ],
  },

  /* ───────── Section 7 : FAQ ───────── */
  faq: {
    id: "faq",
    title: "Questions fréquentes",
    items: [
      {
        q: "Qui peut participer au concours ?",
        a: "Le concours est ouvert aux startups, doctorants, chercheurs, étudiants, jeunes entrepreneurs, professionnels du secteur et coopératives.",
      },
      {
        q: "Combien de projets puis-je présenter ?",
        a: "Chaque candidat ne peut présenter qu’un seul projet.",
      },
      {
        q: "La participation est-elle payante ?",
        a: "Non, la participation est entièrement gratuite.",
      },
      {
        q: "Quels sont les documents à fournir ?",
        a: "Formulaire de candidature, présentation du projet (10 pages max), pitch vidéo (3 min max), CV, documents juridiques (pour les personnes morales).",
      },
      {
        q: "Quand aura lieu la finale ?",
        a: "La finale se tiendra au Salon Halieutis à Agadir, du 27 au 31 janvier 2027.",
      },
      {
        q: "Les frais de déplacement sont-ils pris en charge ?",
        a: "Oui, l’hébergement et le transport des finalistes seront pris en charge.",
      },
      {
        q: "Puis-je participer si mon projet est déjà commercialisé ?",
        a: "Oui, le concours est ouvert aux projets à tous les stades de développement.",
      },
      {
        q: "Comment serai-je informé des résultats ?",
        a: "Vous recevrez une notification par e-mail et les résultats seront publiés sur le site du concours.",
      },
      {
        q: "Puis-je modifier mon dossier après soumission ?",
        a: "Non, une fois soumis, le dossier n’est plus modifiable.",
      },
      {
        q: "Qui contacter en cas de question ?",
        /* « émail » corrigé en « e-mail » ; espaces autour des « / » ajoutées pour la lisibilité. */
        a: "Contactez-nous à l’e-mail : f.nadim@anda.gov.ma / abdellah.bourti@gmail.com ou au téléphone : +212 702-031484 / +212 640029173.",
      },
    ],
  },

  /* ───────── Section 8 : Formulaire ───────── */
  apply: {
    id: "candidature",
    title: "Candidatez maintenant !",
    intro:
      "Remplissez le formulaire ci-dessous pour soumettre votre projet. Vous recevrez une confirmation par e-mail.",
    submit: "Soumettre ma candidature",
    lockedBeforeTitle: "Les candidatures ne sont pas encore ouvertes",
    lockedBeforeText:
      "Le formulaire sera disponible à partir du 9 novembre 2026. Vous pouvez d’ores et déjà préparer votre dossier : formulaire de candidature, présentation du projet (10 pages max), pitch vidéo (3 min max), CV et, pour les personnes morales, documents juridiques.",
    closedTitle: "Les candidatures sont closes",
    closedText: "La période de dépôt des dossiers s’est terminée le 15 décembre 2026.",
    closedCta: "Consulter le calendrier",
    beforeCta: "Nous contacter",
  },

  form: {
    steps: ["Candidat", "Projet", "Pièces & validation"],
    stepOf: "Étape {n} sur {total}",
    progressLabel: "Progression du formulaire",
    requiredNote: "Les champs marqués d’un astérisque (*) sont obligatoires.",
    errorSummaryTitle: "Le formulaire contient des erreurs",
    errorSummaryHelp: "Corrigez les champs suivants pour continuer :",
    next: "Continuer",
    back: "Retour",
    review: "Vérifier ma candidature",
    edit: "Modifier",
    draftNotice: "Votre saisie (hors fichiers) est enregistrée sur cet appareil.",
    draftRestored: "Votre brouillon a été restauré (les fichiers doivent être ajoutés à nouveau).",
    irreversible: "Une fois soumis, le dossier n’est plus modifiable.",
    sending: "Envoi en cours…",
    uploadProgress: "Envoi des fichiers : {p} %",
    recapTitle: "Récapitulatif de votre candidature",
    recapHelp: "Vérifiez attentivement vos informations avant l’envoi définitif.",
    empty: "Non renseigné",
    yes: "Oui",
    optional: "(facultatif)",
    serverError: "Une erreur est survenue. Veuillez réessayer dans quelques instants.",
    networkError: "Connexion impossible. Vérifiez votre réseau puis réessayez.",
    honeypotLabel: "Ne pas remplir ce champ",

    blocks: {
      candidate: "Candidat",
      project: "Projet",
      files: "Pièces jointes",
      consents: "Consentements",
    },

    fields: {
      profil: {
        label: "Profil",
        placeholder: "Sélectionnez votre profil",
        options: {
          startup: "Startup",
          chercheur: "Doctorant / Chercheur",
          etudiant: "Étudiant (Master / Ingénieur)",
          entrepreneur: "Jeune entrepreneur",
          professionnel: "Professionnel du secteur",
          cooperative: "Coopérative",
        },
      },
      nom: { label: "Nom et prénom du porteur (ou du représentant)", autocomplete: "name" },
      email: { label: "E-mail", autocomplete: "email" },
      telephone: {
        label: "Téléphone",
        hint: "Formats acceptés : 06 12 34 56 78, 07…, +212 6…",
        autocomplete: "tel",
      },
      ville: { label: "Ville / région" },
      structure: {
        label: "Nom de la structure",
        hint: "Startup, coopérative, laboratoire, université…",
        requiredHint: "Obligatoire pour les startups et les coopératives.",
      },
      residence: {
        label: "Je suis ressortissant(e) marocain(e) ou je réside légalement au Maroc",
      },
      titreProjet: { label: "Titre du projet" },
      axe: {
        label: "Axe d’innovation",
        options: {
          technologique: "Innovation technologique",
          durabilite: "Durabilité environnementale",
          pratiques: "Optimisation des pratiques",
        },
      },
      resume: {
        label: "Résumé du projet",
        hint: "Entre 300 et 1 500 caractères.",
        counter: "{n} / {max} caractères (minimum {min})",
      },
      stade: {
        label: "Stade de développement",
        placeholder: "Sélectionnez un stade",
        hint: "Le concours accepte tous les stades.",
        options: {
          idee: "Idée",
          prototype: "Prototype",
          pilote: "Pilote",
          commercialise: "Commercialisé",
        },
      },
      prixVises: {
        label: "Prix visé",
        hint: "Facultatif, plusieurs choix possibles.",
        options: {
          innovation: "Prix de l’Innovation Technologique",
          durabilite: "Prix de la Durabilité",
        },
      },
      presentation: {
        label: "Présentation du projet",
        hint: "PDF, 10 pages maximum, {size} Mo maximum.",
      },
      video: {
        label: "Pitch vidéo (3 min maximum)",
        modeLink: "Un lien",
        modeFile: "Un fichier",
        modeLegend: "Je fournis mon pitch vidéo sous forme de",
        urlLabel: "Lien de la vidéo",
        urlHint: "YouTube (non répertoriée), Vimeo, Google Drive… Le lien doit être accessible.",
        fileLabel: "Fichier vidéo",
        fileHint: "MP4 ou MOV, {size} Mo maximum.",
      },
      cv: { label: "CV", hint: "PDF, {size} Mo maximum." },
      legalDocs: {
        label: "Documents juridiques",
        hint: "Personnes morales uniquement : PDF, JPG ou PNG, {count} fichiers maximum, {size} Mo chacun.",
      },
      consentRules: {
        label: "J’ai lu et j’accepte le règlement du concours",
        link: "règlement du concours",
      },
      consentData: {
        label: "J’accepte le traitement de mes données personnelles",
        link: "politique de confidentialité",
      },
      consentTruth: { label: "Je certifie l’exactitude des informations fournies" },
    },

    file: {
      choose: "Choisir un fichier",
      chooseMany: "Ajouter des fichiers",
      remove: "Retirer le fichier",
      removeNamed: "Retirer {name}",
      selected: "Fichier sélectionné",
    },

    errors: {
      required: "Ce champ est obligatoire.",
      profil: "Sélectionnez votre profil.",
      nom: "Indiquez votre nom et prénom (2 caractères minimum).",
      email: "Saisissez une adresse e-mail valide.",
      telephone: "Saisissez un numéro marocain valide (ex. 06 12 34 56 78 ou +212 6 12 34 56 78).",
      structure: "Indiquez le nom de votre structure.",
      residence: "Vous devez être ressortissant(e) marocain(e) ou résider légalement au Maroc.",
      titreProjet: "Indiquez le titre de votre projet ({max} caractères maximum).",
      axe: "Choisissez un axe d’innovation.",
      resumeMin: "Le résumé doit contenir au moins {min} caractères.",
      resumeMax: "Le résumé ne doit pas dépasser {max} caractères.",
      stade: "Sélectionnez un stade de développement valide.",
      fileRequired: "Ce document est obligatoire.",
      fileSize: "Le fichier « {name} » dépasse la taille maximale de {size} Mo.",
      fileType: "Le fichier « {name} » n’a pas un format accepté ({types}).",
      fileEmpty: "Le fichier « {name} » est vide.",
      fileCount: "Vous pouvez joindre {count} fichiers au maximum.",
      pdfPages: "La présentation ne doit pas dépasser {max} pages.",
      fileContent: "Le contenu du fichier « {name} » ne correspond pas à son format.",
      videoMode: "Indiquez comment vous fournissez votre pitch vidéo.",
      videoUrl: "Saisissez un lien vidéo valide (adresse commençant par https://).",
      videoFile: "Ajoutez votre fichier vidéo.",
      legalDocs:
        "Les documents juridiques sont obligatoires pour les startups et les coopératives.",
      consentRules: "Vous devez accepter le règlement du concours.",
      consentData: "Vous devez accepter le traitement de vos données personnelles.",
      consentTruth: "Vous devez certifier l’exactitude des informations fournies.",
    },

    api: {
      validation: "Certaines informations sont invalides. Vérifiez le formulaire.",
      duplicate:
        "Une candidature a déjà été déposée avec cette adresse e-mail. Un seul dossier est autorisé par candidat.",
      tooLarge: "Les fichiers envoyés sont trop volumineux.",
      rateLimited: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
      closedBefore: "Les candidatures ne sont pas encore ouvertes.",
      closedAfter: "Les candidatures sont closes.",
      origin: "Requête refusée.",
      server: "Une erreur est survenue. Veuillez réessayer dans quelques instants.",
    },
  },

  thanks: {
    title: "Merci, votre candidature est bien enregistrée",
    reference: "Votre numéro de référence",
    keepReference: "Conservez ce numéro : il vous sera utile pour toute correspondance.",
    confirmation: "Vous recevrez une confirmation par e-mail.",
    irreversible: "Rappel : une fois soumis, le dossier n’est plus modifiable.",
    home: "Retour à l’accueil",
    calendar: "Consulter le calendrier",
    metaTitle: "Candidature enregistrée | M-MAIN1",
  },

  /* ───────── Section 9 : Contact ───────── */
  contact: {
    id: "contact",
    title: "Besoin d’aide ?",
    emailLabel: "E-mail",
    phoneLabel: "Téléphone",
    socialTitle: "Réseaux sociaux",
    social: { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram" },
  },

  /* ───────── Section 10 : Footer ───────── */
  footer: {
    partners: "Organisateurs et partenaires",
    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
    copyright: "Copyright © 2026 ANDA",
    navLabel: "Liens légaux",
  },

  floatingCta: "Je candidate",

  notFound: {
    title: "Page introuvable",
    text: "La page que vous cherchez n’existe pas ou a été déplacée.",
    home: "Retour à l’accueil",
  },

  /* ───────── Pages annexes ───────── */
  legalPlaceholder: "[À COMPLÉTER PAR LE SERVICE JURIDIQUE ANDA]",
  legalPages: {
    mentions: {
      slug: "mentions-legales",
      title: "Mentions légales",
      sections: [
        { title: "Éditeur du site" },
        { title: "Directeur de la publication" },
        { title: "Hébergeur" },
        { title: "Propriété intellectuelle" },
        { title: "Responsabilité" },
        { title: "Contact" },
      ],
    },
    privacy: {
      slug: "politique-de-confidentialite",
      title: "Politique de confidentialité",
      sections: [
        { title: "Responsable du traitement" },
        { title: "Données collectées" },
        { title: "Finalités du traitement" },
        { title: "Durée de conservation" },
        { title: "Destinataires des données" },
        { title: "Droits d’accès, de rectification et d’opposition" },
        { title: "Contact" },
      ],
      lawNotice:
        "À faire valider par le service juridique de l’ANDA : conformité à la loi n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel et, le cas échéant, déclaration ou autorisation auprès de la CNDP.",
    },
    backHome: "Retour à l’accueil",
  },
} as const;

export const fr = deepFrTypo(raw);
export type Content = typeof fr;
