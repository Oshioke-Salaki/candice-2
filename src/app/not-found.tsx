import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-350 flex-col justify-end px-5 pt-24 pb-16 md:px-10 md:pb-24">
      <p className="text-sm tabular-nums text-ink-dim">404</p>
      <h1 className="mt-4 text-[clamp(3.5rem,12vw,10rem)] leading-[0.92] font-bold tracking-[-0.045em]">
        Wrong
        <br />
        <span className="font-normal italic text-accent">set.</span>
      </h1>
      <p className="mt-8 max-w-[40ch] text-lg leading-relaxed text-ink-soft">
        This page doesn&rsquo;t exist. The work is one click away.
      </p>
      <Link
        href="/#work"
        className="mt-8 inline-flex h-12 w-fit items-center bg-accent px-7 text-base font-medium text-on-accent transition-transform active:scale-[0.98]"
      >
        View work
      </Link>
    </main>
  );
}
