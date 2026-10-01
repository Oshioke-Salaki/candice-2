import { ImageResponse } from "next/og";
import { ACCENT, BG, INK } from "@/lib/site";
import { ogFonts } from "@/lib/og-fonts";

/* The share card shown when the link is posted (WhatsApp, iMessage,
   X, LinkedIn...): the hero headline beside the cover portrait. */
export const alt = "WowCandice, fashion and commercial model, London and Lagos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PORTRAIT =
  "https://res.cloudinary.com/hc8f1wui/image/upload/c_crop,w_0.9,h_0.62,g_auto/c_fill,w_500,h_630,g_auto,f_jpg,q_85/candice/hero/hero";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BG }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            fontFamily: "Neue Montreal",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: INK, letterSpacing: "-0.02em" }}>
            WowCandice<span style={{ color: ACCENT }}>.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 150, fontStyle: "italic", fontWeight: 400, color: ACCENT, lineHeight: 0.95, letterSpacing: "-0.04em" }}>
              Wow
            </div>
            <div style={{ fontSize: 150, fontWeight: 700, color: INK, lineHeight: 0.95, letterSpacing: "-0.05em" }}>
              Candice
            </div>
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
              <span style={{ color: INK }}>Fashion and commercial model</span>
              <span style={{ color: "#909096" }}>London and Lagos</span>
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PORTRAIT} width={500} height={630} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
