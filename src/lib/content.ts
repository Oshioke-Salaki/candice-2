/* Site-wide contact details. One label per intent: every "contact"
   button on the page reads BOOK_LABEL. */
export const EMAIL = "candicefarinde@gmail.com";
export const BOOK_LABEL = "Book Candice";
export const BOOK_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent("Booking enquiry")}`;

export const SOCIALS = [
  { name: "Instagram", handle: "@wowcandice", href: "https://www.instagram.com/wowcandice" },
  { name: "TikTok", handle: "@wowcandice", href: "https://www.tiktok.com/@wowcandice" },
  { name: "WhatsApp", handle: "+353 83 804 5399", href: "https://wa.me/353838045399" },
];

export const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#film", label: "Film" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
];
