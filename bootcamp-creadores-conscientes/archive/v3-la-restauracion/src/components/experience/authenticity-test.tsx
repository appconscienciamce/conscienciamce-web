"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Verdict = { title: string; body: string };

/**
 * Self-assessment. Runs only in this browser: answers are not stored or sent.
 * Items mix fit and not-fit on purpose, so the reader has to think about each.
 * Every tap answers with a pulse on the mark and light across the row.
 */
export function AuthenticityTest({
  title,
  intro,
  fit,
  notFit,
  idle,
  partial,
  fitVerdict,
  notFitVerdict,
  children,
}: {
  title: string;
  intro: string;
  fit: string[];
  notFit: string[];
  idle: Verdict;
  partial: Verdict;
  fitVerdict: Verdict;
  notFitVerdict: Verdict;
  children: React.ReactNode;
}) {
  const items = Array.from({ length: Math.max(fit.length, notFit.length) }).flatMap((_, i) => [
    ...(fit[i] ? [{ text: fit[i], good: true }] : []),
    ...(notFit[i] ? [{ text: notFit[i], good: false }] : []),
  ]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [pulse, setPulse] = useState<{ row: number; n: number }>({ row: -1, n: 0 });

  const toggle = (i: number) => {
    setPulse((prev) => ({ row: i, n: prev.n + 1 }));
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const marked = [...checked].map((i) => items[i]);
  const anyBad = marked.some((m) => !m.good);
  const goodCount = marked.filter((m) => m.good).length;

  const state = anyBad ? "notFit" : goodCount >= 2 ? "fit" : marked.length ? "partial" : "idle";
  const verdict = { idle, partial, fit: fitVerdict, notFit: notFitVerdict }[state];

  return (
    <div className="mx-auto mt-14 grid max-w-[76rem] gap-8 lg:mt-20 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h3 className="display text-[clamp(2rem,3.4vw,3rem)] italic">{title}</h3>
        <p className="mt-2 text-[var(--muted)]">{intro}</p>
        <ul className="mt-6 border-t border-[var(--rule)]">
          {items.map((item, i) => {
            const on = checked.has(i);
            const pulsing = pulse.row === i;
            return (
              <li key={item.text} className="border-b border-[var(--rule)]">
                <motion.button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => toggle(i)}
                  whileTap={{ scale: 0.985 }}
                  className="group relative grid w-full grid-cols-[1.75rem_1fr] items-start gap-3 overflow-hidden py-4 text-left text-[1.0625rem] leading-snug"
                >
                  {pulsing && (
                    <motion.span
                      key={pulse.n}
                      aria-hidden
                      initial={{ x: "-100%", opacity: 0.9 }}
                      animate={{ x: "100%", opacity: 0 }}
                      transition={{ duration: 0.75, ease: "easeOut" }}
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(201,168,106,0.32),transparent)]"
                    />
                  )}
                  <span
                    aria-hidden
                    className={`relative mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border transition-colors duration-300 ${
                      on ? "border-[var(--gold)] bg-[var(--gold)]" : "border-[var(--fg)] group-hover:border-[var(--gold)]"
                    }`}
                  >
                    {pulsing && (
                      <motion.span
                        key={pulse.n}
                        initial={{ scale: 0.6, opacity: 0.9 }}
                        animate={{ scale: 3.4, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full border border-[var(--gold)]"
                      />
                    )}
                    {on && <span className="h-1.5 w-1.5 rounded-full bg-[var(--bg)]" />}
                  </span>
                  <span className={`relative transition-colors duration-300 ${on ? "text-[var(--gold)]" : ""}`}>{item.text}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lg:col-span-4 lg:col-start-9">
        <div className="surface-ink notched flex min-h-[21rem] flex-col items-center justify-center p-8 text-center lg:sticky lg:top-16">
          <p className="label text-[var(--muted)]">Dictamen</p>
          <div aria-live="polite" className="mt-4 flex flex-1 flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={state}
                initial={state === "fit" ? { scale: 1.9, opacity: 0, rotate: -14 } : { opacity: 0, y: 8 }}
                animate={state === "fit" ? { scale: 1, opacity: 1, rotate: -7 } : { opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={state === "fit" ? { type: "spring", stiffness: 420, damping: 18 } : { duration: 0.25 }}
              >
                <p
                  className={`display text-[clamp(2.25rem,3.6vw,3rem)] italic leading-none ${
                    state === "fit" ? "rounded-full border-2 border-[var(--gold)] px-7 py-5 text-[var(--gold)]" : ""
                  }`}
                >
                  {verdict.title}
                </p>
              </motion.div>
            </AnimatePresence>
            <p className="mt-6 max-w-[17rem] text-[var(--muted)]">{verdict.body}</p>
          </div>
          {state === "fit" && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </div>
  );
}
