import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

import { org, seo } from "@/content/site";

import "./globals.css";

/**
 * One family across the whole site, per the design direction.
 *
 * IBM Plex Sans Arabic covers both scripts, so the Arabic body copy and the
 * Latin "MBA" focal point share a single set of proportions — no second
 * webfont, no mismatched x-heights between the two scripts in the same line.
 * `display: "swap"` means the Arabic text is readable during the font fetch
 * rather than invisible.
 */
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  applicationName: org.wordmark,
  openGraph: {
    title: seo.title,
    description: seo.description,
    locale: "ar_SA",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f3ebdd",
  width: "device-width",
  initialScale: 1,
  // Never lock zoom: pinch-zoom is the primary accessibility affordance on a
  // phone, and the layout holds at 200% because it uses logical units.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={arabic.variable} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <a
          href="#registration"
          className="sr-only-focusable absolute z-50 m-4 rounded-[var(--radius-input)] bg-charcoal px-5 py-3 font-semibold text-ivory"
        >
          تخطَّ إلى استمارة التسجيل
        </a>
        {children}
      </body>
    </html>
  );
}
