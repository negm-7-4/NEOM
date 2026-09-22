import { Backdrop } from "@/components/site/backdrop";
import { Benefits } from "@/components/site/benefits";
import { Hero } from "@/components/site/hero";
import { RegistrationSection } from "@/components/site/registration-section";
import { SiteFooter } from "@/components/site/footer";

/**
 * Composition, top to bottom, matching the reference:
 *   backdrop (fixed, parallaxed) → hero with brand capsule and MBA focal point
 *   → glass benefits panel → registration panel → footer with the org name.
 *
 * The page itself is a server component. Only the pieces that genuinely need
 * the client (motion, the form, the canvas host) carry "use client", so the
 * HTML that arrives already contains every word of the Arabic copy — the hero
 * and the form labels are readable before any JavaScript executes.
 */
export default function HomePage() {
  return (
    <>
      <Backdrop />
      <main className="relative flex min-h-dvh flex-col">
        <Hero />
        <Benefits />
        <RegistrationSection />
        <SiteFooter />
      </main>
    </>
  );
}
