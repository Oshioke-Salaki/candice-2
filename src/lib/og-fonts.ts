import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* Neue Montreal for the generated icons and share card, read straight
   from the repo at build time. */
export async function ogFonts() {
  const dir = join(process.cwd(), "src/fonts");
  const [bold, italic] = await Promise.all([
    readFile(join(dir, "ppneuemontreal-bold.otf")),
    readFile(join(dir, "ppneuemontreal-italic.otf")),
  ]);
  return [
    { name: "Neue Montreal", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Neue Montreal", data: italic, weight: 400 as const, style: "italic" as const },
  ];
}
