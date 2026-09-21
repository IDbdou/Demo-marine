import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { countPdfPages, detectSignature, signatureMatchesExtension } from "@/lib/fileSignature";
import { rateLimit, resetRateLimit } from "@/lib/rateLimit";
import { DuplicateSubmissionError, FileSystemStorage } from "@/lib/storage";
import { escapeHtml } from "@/lib/mailer";

const bytes = (...n: number[]) => new Uint8Array(n);

describe("fileSignature", () => {
  it("reconnaît PDF, JPEG, PNG, MP4", () => {
    expect(detectSignature(Buffer.from("%PDF-1.7 ..."))).toBe("pdf");
    expect(detectSignature(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe("jpg");
    expect(detectSignature(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toBe("png");
    expect(detectSignature(Buffer.from("\0\0\0\x18ftypmp42\0\0\0\0"))).toBe("mp4");
    expect(detectSignature(Buffer.from("MZ executable"))).toBeNull();
  });

  it("refuse une extension qui ne correspond pas au contenu", () => {
    expect(signatureMatchesExtension("pdf", Buffer.from("%PDF-1.4"))).toBe(true);
    expect(
      signatureMatchesExtension("pdf", bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)),
    ).toBe(false);
    expect(signatureMatchesExtension("exe", Buffer.from("%PDF-1.4"))).toBe(false);
  });

  it("compte les pages d'un PDF", () => {
    const pdf =
      "%PDF-1.4\n1 0 obj<</Type /Pages /Count 2>>endobj\n2 0 obj<</Type /Page>>endobj\n3 0 obj<</Type/Page>>endobj";
    expect(countPdfPages(Buffer.from(pdf))).toBe(2);
    expect(countPdfPages(Buffer.from("%PDF-1.5 compressé"))).toBeNull();
  });
});

describe("rateLimit", () => {
  it("bloque au-delà du plafond puis libère après la fenêtre", () => {
    resetRateLimit();
    const cfg = { max: 2, windowMs: 1000 };
    expect(rateLimit("ip", cfg, 0).ok).toBe(true);
    expect(rateLimit("ip", cfg, 10).ok).toBe(true);
    expect(rateLimit("ip", cfg, 20).ok).toBe(false);
    expect(rateLimit("ip", cfg, 1500).ok).toBe(true);
  });
});

describe("FileSystemStorage", () => {
  let dir = "";
  afterEach(async () => {
    if (dir) await rm(dir, { recursive: true, force: true });
  });

  it("enregistre un dossier, attribue des références séquentielles et refuse les doublons d'e-mail", async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "mmain1-"));
    const storage = new FileSystemStorage(dir);
    const input = (email: string) => ({
      email,
      data: { nom: "Test" },
      files: [
        {
          field: "cv",
          storedName: "cv.pdf",
          originalName: "cv.pdf",
          mime: "application/pdf",
          buffer: Buffer.from("%PDF-1"),
        },
      ],
    });

    expect(await storage.existsByEmail("a@b.ma")).toBe(false);
    const first = await storage.saveSubmission(input("a@b.ma"));
    const second = await storage.saveSubmission(input("c@d.ma"));
    expect(first.reference).toMatch(/^MMAIN1-2026-0001$/);
    expect(second.reference).toBe("MMAIN1-2026-0002");
    expect(await storage.existsByEmail("a@b.ma")).toBe(true);
    await expect(storage.saveSubmission(input("a@b.ma"))).rejects.toBeInstanceOf(
      DuplicateSubmissionError,
    );

    const files = await readdir(path.join(dir, first.reference));
    expect(files.sort()).toEqual(["cv.pdf", "data.json"]);
    const data = JSON.parse(await readFile(path.join(dir, first.reference, "data.json"), "utf8"));
    expect(data.reference).toBe(first.reference);
  });

  it("gère deux envois simultanés du même e-mail (un seul gagne)", async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "mmain1-"));
    const storage = new FileSystemStorage(dir);
    const make = () => storage.saveSubmission({ email: "x@y.ma", data: {}, files: [] });
    const results = await Promise.allSettled([make(), make(), make()]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
  });
});

describe("escapeHtml", () => {
  it("échappe les caractères dangereux", () => {
    expect(escapeHtml(`<img src=x onerror="a">&'`)).toBe(
      "&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;",
    );
  });
});
