import Link from "next/link";

/* Shared header for sub-pages — same title-card typography as the home
   sections: solid Bebas line + red-outlined second line + serif subline. */
export default function PageHeader({
  tag,
  lineOne,
  lineTwo,
  subline,
  note,
}: {
  tag: string;
  lineOne: string;
  lineTwo: string;
  subline: string;
  note?: string;
}) {
  return (
    <section id="home" className="pt-40 md:pt-48 pb-16 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="section-tag animate-fade-in">{tag}</div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <h1
            className="font-display animate-reveal-up"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 11rem)",
              lineHeight: 0.88,
              letterSpacing: "0.04em",
              color: "var(--text)",
            }}
          >
            {lineOne}
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px var(--accent-soft)",
                color: "transparent",
              }}
            >
              {lineTwo}
            </span>
          </h1>

          <div className="animate-reveal-up" style={{ animationDelay: "0.15s" }}>
            <p
              className="font-serif italic md:text-right"
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.65,
                color: "var(--text-dim)",
                maxWidth: 320,
              }}
            >
              {subline}
            </p>
            {note && (
              <p
                className="uppercase tracking-[0.25em] mt-4 md:text-right"
                style={{ fontSize: "0.55rem", color: "var(--text-dim)" }}
              >
                {note}
              </p>
            )}
          </div>
        </div>

        <div
          className="mt-10 animate-fade-in"
          style={{ height: 1, background: "var(--border-hi)", animationDelay: "0.3s" }}
        />
      </div>
    </section>
  );
}

/* Bottom call-to-action band shared by sub-pages */
export function PageCta() {
  return (
    <section
      className="py-16 md:py-24 px-6 md:px-10 text-center"
      style={{ borderTop: "1px solid var(--border)", background: "var(--bg-alt)" }}
    >
      <p
        className="font-serif italic mb-6"
        style={{ fontSize: "1.15rem", color: "var(--text-soft)" }}
      >
        Like what you see?
      </p>
      <Link
        href="/#contact"
        className="font-display inline-block no-underline transition-opacity duration-300 hover:opacity-70"
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          letterSpacing: "0.05em",
          lineHeight: 1,
          color: "var(--text)",
        }}
      >
        LET&apos;S MAKE{" "}
        <span
          style={{
            WebkitTextStroke: "1.5px var(--accent-soft)",
            color: "transparent",
          }}
        >
          A MOMENT
        </span>{" "}
        →
      </Link>
    </section>
  );
}
