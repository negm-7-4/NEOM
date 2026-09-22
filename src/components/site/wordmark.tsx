import { cn } from "@/lib/utils";

/**
 * The NEOM wordmark, set typographically.
 *
 * This is original lettering — wide-tracked capitals in the site's own type
 * family, paired with an abstract ascending-arch mark drawn for this project.
 * No third-party logo, glyph or brand asset is reproduced anywhere on the
 * site, and the mark is deliberately generic (a rising arch, for "الارتقاء")
 * rather than an imitation of any existing identity.
 */
export function Wordmark({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {showMark ? <AscentMark className="size-6 shrink-0" /> : null}
      <span
        data-ltr
        className="font-bold uppercase leading-none tracking-[0.34em]"
        /* The trailing letter-space would otherwise push the mark off-centre. */
        style={{ marginInlineEnd: "-0.34em" }}
      >
        NEOM
      </span>
    </span>
  );
}

/** Three rising arches — the project's own mark, used beside the wordmark. */
export function AscentMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="presentation"
    >
      <path
        d="M3 20V14a3 3 0 0 1 6 0v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M9 20V10a3 3 0 0 1 6 0v10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d="M15 20V6a3 3 0 0 1 6 0v14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
