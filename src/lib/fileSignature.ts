export type Signature = "pdf" | "jpg" | "png" | "mp4";

/** Détecte le type réel d'un fichier à partir de ses premiers octets (magic bytes). */
export function detectSignature(buf: Uint8Array): Signature | null {
  const b = buf;
  if (
    b.length >= 5 &&
    b[0] === 0x25 &&
    b[1] === 0x50 &&
    b[2] === 0x44 &&
    b[3] === 0x46 &&
    b[4] === 0x2d
  )
    return "pdf";
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (
    b.length >= 8 &&
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a
  ) {
    return "png";
  }
  if (b.length >= 12) {
    const box = String.fromCharCode(b[4] ?? 0, b[5] ?? 0, b[6] ?? 0, b[7] ?? 0);
    // MP4 / MOV (QuickTime) : boîte « ftyp » ou, pour d'anciens MOV, moov / mdat / free / wide / skip.
    if (["ftyp", "moov", "mdat", "free", "wide", "skip"].includes(box)) return "mp4";
  }
  return null;
}

const EXT_TO_SIGNATURE: Record<string, Signature> = {
  pdf: "pdf",
  jpg: "jpg",
  jpeg: "jpg",
  png: "png",
  mp4: "mp4",
  mov: "mp4",
};

/** L'extension déclarée correspond-elle au contenu réel ? */
export function signatureMatchesExtension(ext: string, buf: Uint8Array): boolean {
  const expected = EXT_TO_SIGNATURE[ext.toLowerCase()];
  return expected !== undefined && detectSignature(buf) === expected;
}

/**
 * Estimation du nombre de pages d'un PDF (objets `/Type /Page`). Renvoie null si l'estimation est
 * impossible (PDF à flux d'objets compressés) : le contrôle est alors ignoré.
 */
export function countPdfPages(buf: Uint8Array): number | null {
  const text = Buffer.from(buf).toString("latin1");
  const counts = text.match(/\/Type\s*\/Page(?![A-Za-z])/g);
  if (counts && counts.length > 0) return counts.length;
  const declared = [...text.matchAll(/\/Type\s*\/Pages[^>]*?\/Count\s+(\d+)/g)].map((m) =>
    Number(m[1]),
  );
  return declared.length > 0 ? Math.max(...declared) : null;
}
