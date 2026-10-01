import Icon from "./icon";

/* iOS home-screen icon: the same mark at 180×180. iOS rounds the
   corners itself, so the square stays square here. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return Icon({ id: "180" });
}
