import { Reveal } from "@/components/site/reveal";
import { RegistrationForm } from "@/components/form/registration-form";
import { form as formCopy, hero } from "@/content/site";

/**
 * The registration panel.
 *
 * Note the opacity relationship the brief asks for: the outer panel uses
 * `glass-form` (88% fill) rather than the `glass-card` used by the decorative
 * benefit cards (52%). Field text has to stay readable over a moving
 * background — decorative copy can afford to let the scene through, form input
 * cannot.
 */
export function RegistrationSection() {
  return (
    <section
      id={hero.ctaTargetId}
      aria-labelledby="registration-heading"
      /* scroll-margin so the CTA anchor does not park the heading under the
         top edge of the viewport. */
      className="relative scroll-mt-6 py-[var(--space-4)] sm:py-[var(--space-6)]"
    >
      <div className="content-shell">
        <Reveal>
          <div className="glass glass-form glass-rim rounded-[var(--radius-panel)] p-[var(--space-3)] sm:p-[var(--space-5)] lg:p-[var(--space-6)]">
            <div className="flex flex-col gap-[var(--space-4)]">
              <header className="flex flex-col gap-2">
                <h2
                  id="registration-heading"
                  className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight text-charcoal"
                >
                  {formCopy.heading}
                </h2>
                <p className="max-w-[58ch] text-pretty text-base leading-7 text-muted">
                  {formCopy.intro}
                </p>
              </header>

              <RegistrationForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
