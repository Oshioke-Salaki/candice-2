import { ArrowUpIcon } from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-350 flex-col gap-4 px-5 py-8 text-sm text-ink-dim sm:flex-row sm:items-center sm:justify-between md:px-10">
        <span className="text-base font-bold tracking-tight text-ink">
          WowCandice<span className="text-accent">.</span>
        </span>
        <span>© {new Date().getFullYear()} WowCandice. London and Lagos.</span>
        <a href="#home" className="inline-flex items-center gap-2 transition-colors hover:text-ink">
          Back to top <ArrowUpIcon size={14} />
        </a>
      </div>
    </footer>
  );
}
