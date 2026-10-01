import OpengraphImage from "./opengraph-image";

/* X / Twitter uses the same card as everywhere else. */
export const alt = "WowCandice, fashion and commercial model, London and Lagos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return OpengraphImage();
}
