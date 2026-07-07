/* ─── Cloudinary delivery helpers ─────────────────────────────
   All site media lives on Cloudinary under the `candice/` folder.
   The cloud name is public — it appears in every delivered URL. */

const CLOUD = "hc8f1wui";
const BASE = `https://res.cloudinary.com/${CLOUD}`;

/** next/image loader — Cloudinary does the resizing + format work,
    so Vercel's image optimizer is bypassed entirely. `src` is the
    Cloudinary public ID (e.g. "candice/about/01"). */
export function cldLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return `${BASE}/image/upload/f_auto,q_${quality ?? "auto"},w_${width},c_limit/${src}`;
}

/** Plain image URL for non-next/image uses (CSS backgrounds etc.). */
export function cldImage(publicId: string, width = 1280) {
  return `${BASE}/image/upload/f_auto,q_auto,w_${width},c_limit/${publicId}`;
}

/** Video delivery URL — auto codec + quality, capped height. */
export function cldVideo(publicId: string, maxHeight = 1280) {
  return `${BASE}/video/upload/q_auto,vc_auto,h_${maxHeight},c_limit/${publicId}.mp4`;
}

/** Poster frame generated from the video itself at `offset` seconds. */
export function cldPoster(publicId: string, offset = 1, width = 1280) {
  return `${BASE}/video/upload/so_${offset},w_${width},c_limit,f_jpg,q_auto/${publicId}.jpg`;
}

/** Campaign frame public ID, e.g. campaignFrame("meji-meji", 3). */
export function campaignFrame(id: string, n: number) {
  return `candice/campaigns/${id}/${id}-${String(n).padStart(2, "0")}`;
}
