import nodemailer from "nodemailer";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Confirmation = { to: string; nom: string; reference: string; titreProjet: string };

/**
 * E-mail de confirmation via SMTP (variables SMTP_*). Sans configuration SMTP, le message est
 * journalisé en console (développement) et la fonction renvoie « false ».
 */
export async function sendConfirmation(c: Confirmation): Promise<boolean> {
  const subject = `Candidature M-MAIN1 enregistrée – ${c.reference}`;
  const text = [
    `Bonjour ${c.nom},`,
    "",
    `Nous confirmons la bonne réception de votre candidature au Concours d’Innovation Aquacole M-MAIN1.`,
    `Référence : ${c.reference}`,
    `Projet : ${c.titreProjet}`,
    "",
    "Rappel : une fois soumis, le dossier n’est plus modifiable.",
    "",
    "L’équipe M-MAIN1 – ANDA",
  ].join("\n");
  const html = `<p>Bonjour ${escapeHtml(c.nom)},</p>
<p>Nous confirmons la bonne réception de votre candidature au Concours d’Innovation Aquacole M-MAIN1.</p>
<p><strong>Référence :</strong> ${escapeHtml(c.reference)}<br><strong>Projet :</strong> ${escapeHtml(c.titreProjet)}</p>
<p>Rappel : une fois soumis, le dossier n’est plus modifiable.</p>
<p>L’équipe M-MAIN1 – ANDA</p>`;

  const host = process.env.SMTP_HOST;
  if (!host) {
    console.info(
      `[mail:dev] SMTP non configuré — e-mail non envoyé.\nÀ : ${c.to}\nObjet : ${subject}\n${text}`,
    );
    return false;
  }
  const transport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? "" }
      : undefined,
  });
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "no-reply@localhost";
  await transport.sendMail({ from, to: c.to, subject, text, html });
  const internal = process.env.SUBMISSIONS_NOTIFY_EMAIL;
  if (internal) {
    await transport.sendMail({
      from,
      to: internal,
      subject: `[Copie interne] ${subject}`,
      text: `${text}\n\nCandidat : ${c.to}`,
      html: `${html}<p>Candidat : ${escapeHtml(c.to)}</p>`,
    });
  }
  return true;
}
