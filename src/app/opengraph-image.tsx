import { ImageResponse } from "next/og";
import { fr } from "@/content/fr";

export const alt = fr.meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "linear-gradient(160deg, #0A2A4A 0%, #061C33 70%)",
        color: "#fff",
      }}
    >
      <div style={{ fontSize: 34, color: "#7CC4EC", fontWeight: 700, letterSpacing: 2 }}>
        ANDA · 1RE ÉDITION
      </div>
      <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>
        {fr.hero.title}
      </div>
      <div style={{ fontSize: 38, fontStyle: "italic", color: "#7CC4EC", marginTop: 20 }}>
        {fr.hero.subtitleEn}
      </div>
      <div style={{ display: "flex", marginTop: 48, fontSize: 30 }}>
        <div
          style={{ background: "#1E7B4B", padding: "14px 30px", borderRadius: 60, fontWeight: 700 }}
        >
          {fr.hero.closingLine}
        </div>
      </div>
    </div>,
    size,
  );
}
