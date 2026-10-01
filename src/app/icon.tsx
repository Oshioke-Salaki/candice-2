import { ImageResponse } from "next/og";
import { ACCENT, BG, INK } from "@/lib/site";
import { ogFonts } from "@/lib/og-fonts";

/* The favicon: a bold "W" with the wordmark's red full stop, on the
   site's off-black. Rendered at build time in three sizes: browser
   tab, Android home screen and the install splash. */
export const contentType = "image/png";

const SIZES = [32, 192, 512];

export function generateImageMetadata() {
  return SIZES.map((s) => ({ id: String(s), size: { width: s, height: s }, contentType }));
}

export default async function Icon({ id }: { id: string }) {
  const s = Number(id);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BG,
          paddingTop: s * 0.04,
        }}
      >
        <span
          style={{
            fontFamily: "Neue Montreal",
            fontWeight: 700,
            fontSize: s * 0.78,
            lineHeight: 1,
            letterSpacing: "-0.06em",
            color: INK,
          }}
        >
          W
        </span>
        <span
          style={{
            width: s * 0.14,
            height: s * 0.14,
            background: ACCENT,
            alignSelf: "flex-end",
            marginBottom: s * 0.21,
            marginLeft: s * 0.02,
          }}
        />
      </div>
    ),
    { width: s, height: s, fonts: await ogFonts() },
  );
}
