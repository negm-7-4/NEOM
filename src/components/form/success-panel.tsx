"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { form as formCopy } from "@/content/site";

/**
 * Confirmation shown once Resend has accepted the request.
 *
 * The wording is deliberately "sent", not "delivered": provider acceptance is
 * not proof the mail reached the inbox, and the UI must not claim more than
 * the API actually told us.
 */
export function SuccessPanel({
  reference,
  onReset,
}: {
  reference: string;
  onReset: () => void;
}) {
  const reduced = useReducedMotion();
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied — the reference is selectable on screen.
    }
  }, [reference]);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.56, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-6 px-2 py-10 text-center sm:py-14"
    >
      <motion.span
        aria-hidden
        initial={reduced ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.12, duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex size-16 items-center justify-center rounded-full bg-verdant text-ivory shadow-[0_12px_30px_-12px_rgba(47,107,79,0.8)]"
      >
        <CheckIcon className="size-8 stroke-[2.5]" />
      </motion.span>

      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold leading-9 text-charcoal sm:text-3xl">
          {formCopy.success.title}
        </h3>
        <p className="mx-auto max-w-prose text-base leading-7 text-muted sm:text-lg">
          {formCopy.success.body}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2 rounded-[var(--radius-input)] border border-verdant/25 bg-verdant-pale/60 px-5 py-4">
        <span className="text-sm font-medium text-muted">
          {formCopy.success.referenceLabel}
        </span>
        <div className="flex items-center justify-between gap-3">
          <code
            data-ltr
            className="select-all text-lg font-bold tracking-[0.06em] text-charcoal"
          >
            {reference}
          </code>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={copy}
            aria-label="نسخ الرقم المرجعي"
          >
            {copied ? (
              <CheckIcon className="size-5 text-verdant" />
            ) : (
              <CopyIcon className="size-5" />
            )}
          </Button>
        </div>
        <span className="text-xs leading-5 text-muted">{formCopy.success.note}</span>
      </div>

      <Button type="button" variant="outline" onClick={onReset}>
        {formCopy.success.again}
      </Button>
    </motion.div>
  );
}
