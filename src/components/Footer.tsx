export default function Footer() {
  return (
    <footer
      className="flex flex-col sm:flex-row items-center justify-between gap-4 px-10 py-8 text-center sm:text-left"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <span
        className="font-display tracking-[0.3em]"
        style={{ fontSize: "1.3rem", color: "var(--text)" }}
      >
        WC<span style={{ color: "var(--accent)" }}>.</span>
      </span>

      <span
        className="uppercase tracking-[0.15em]"
        style={{ fontSize: "0.6rem", color: "var(--text-dim)" }}
      >
        © {new Date().getFullYear()} WowCandice. All rights reserved.
      </span>

      <a
        href="#home"
        className="uppercase tracking-[0.2em] no-underline transition-opacity duration-300 hover:opacity-100"
        style={{ fontSize: "0.6rem", color: "var(--text-dim)", opacity: 0.5 }}
      >
        Back to top ↑
      </a>
    </footer>
  );
}
