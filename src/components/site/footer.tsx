import { Wordmark } from "@/components/site/wordmark";
import { footer } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-[var(--space-6)] pb-[var(--space-5)]">
      <div className="content-shell">
        <div className="glass glass-panel glass-rim flex flex-col items-center gap-[var(--space-2)] rounded-[var(--radius-panel)] px-[var(--space-3)] py-[var(--space-5)] text-center sm:px-[var(--space-5)]">
          <Wordmark className="text-xl text-charcoal sm:text-2xl" />

          <p className="max-w-[56ch] text-pretty text-[0.95rem] font-semibold leading-7 text-charcoal sm:text-base">
            {footer.name}
          </p>

          <p className="text-sm font-medium tracking-wide text-verdant">{footer.tagline}</p>

          <span
            aria-hidden
            className="h-px w-24 bg-gradient-to-l from-transparent via-sand-deep/60 to-transparent"
          />

          {/* Required clarification: this site is not affiliated with the NEOM
              development project or with the University of Oxford. */}
          <p className="max-w-[62ch] text-pretty text-xs leading-6 text-muted">
            {footer.disclaimer}
          </p>

          <p className="text-xs text-muted">
            {footer.rightsPrefix} © <span data-ltr>{year}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
