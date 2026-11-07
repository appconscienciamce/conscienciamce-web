"use client";

import { useEffect, useRef, useState } from "react";
import { CtaContent } from "@/components/cta-content";
import { track } from "@/lib/analytics";

interface RoadmapCopy {
  id: string;
  endpoint: string | null;
  fields: { name: string; email: string; project: string; goal: string; projectHint?: string; goalHint?: string };
  file: { name: string; open: string; close: string; hint: string };
  next: string;
  back: string;
  partOne: string;
  partTwo: string;
  hook: string;
  more: { name: string; label: string; hint?: string; part?: number; rows: number; maxLength: number }[];
  submit: string;
  sending: string;
  sent: string;
  failed: string;
  unavailable: string;
}

type Status = "idle" | "sending" | "sent" | "failed";

function Extra({ field }: { field: RoadmapCopy["more"][number] }) {
  return (
    <label className="is-wide">
      <span>{field.label}</span>
      {field.hint && <small className="roadmap-hint">{field.hint}</small>}
      {field.rows === 1 ? (
        <input name={field.name} type="text" maxLength={field.maxLength} />
      ) : (
        <textarea name={field.name} rows={field.rows} maxLength={field.maxLength} />
      )}
    </label>
  );
}

const TIMEOUT_MS = 15000;

/**
 * A closed file: the form opens on a tap, so the next steps stay in sight, and it asks
 * four questions and then four more. Sends only to a real endpoint: without one the button
 * stays off, because telling someone their answers arrived when they did not is worse than waiting.
 */
export function RoadmapFile({ copy }: { copy: RoadmapCopy }) {
  const [open, setOpen] = useState(false);
  const [part, setPart] = useState<1 | 2>(1);
  const [status, setStatus] = useState<Status>("idle");
  // Until React is here a submit would be a native one, with the answers in the URL.
  const [ready, setReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);
  // Same id on every retry: an answer stored behind a failed response can be told apart.
  const submissionId = useRef("");
  const { endpoint, fields, more } = copy;

  useEffect(() => {
    setReady(true);
    // The confirmation mail links straight to this step.
    if (window.location.hash === `#${copy.id}`) setOpen(true);
  }, [copy.id]);

  const firstPartValid = () => {
    const controls = formRef.current?.querySelectorAll<HTMLInputElement>("[data-part='1'] input,[data-part='1'] textarea");
    return Array.from(controls ?? []).every((control) => control.reportValidity());
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (part === 1) {
      if (firstPartValid()) setPart(2);
      return;
    }
    if (!endpoint || status === "sending") return;
    setStatus("sending");
    submissionId.current ||= crypto.randomUUID();
    const answers = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const extras = more.flatMap(({ name, label }) => {
      const answer = answers[name]?.trim();
      delete answers[name];
      return answer ? [`${label}\n${answer}`] : [];
    });
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // A redirect means this is not the endpoint that stores the answers.
        redirect: "error",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        body: JSON.stringify({ ...answers, goal: [answers.goal, ...extras].join("\n\n"), submissionId: submissionId.current }),
      });
      if (!response.ok) throw new Error(`Roadmap endpoint answered ${response.status}`);
      setStatus("sent");
      track("roadmap_submit");
    } catch {
      setStatus("failed");
    }
  };

  // After the render: the message does not exist until then.
  useEffect(() => {
    if (status === "sent" || status === "failed") resultRef.current?.focus();
  }, [status]);

  if (status === "sent") {
    return (
      <p ref={resultRef} tabIndex={-1} className="roadmap-sent" role="status">
        {copy.sent}
      </p>
    );
  }

  return (
    <div className="roadmap-file" data-open={open ? "" : undefined}>
      <button type="button" className="roadmap-file-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span aria-hidden className="roadmap-file-icon" />
        <span className="roadmap-file-name">
          <strong>{copy.file.name}</strong>
          <small>{copy.file.hint}</small>
        </span>
        <span className="roadmap-file-action">{open ? copy.file.close : copy.file.open}</span>
      </button>

      <div className="roadmap-fold" inert={!open}>
        <div>
          <form ref={formRef} className="roadmap-form" method="post" onSubmit={onSubmit} aria-busy={status === "sending"}>
            <p className="roadmap-part">{part === 1 ? copy.partOne : copy.partTwo}</p>

            <div className="roadmap-fields" data-part="1" hidden={part !== 1}>
              <label>
                <span>{fields.name}</span>
                <input name="name" type="text" autoComplete="name" maxLength={200} required />
              </label>
              <label>
                <span>{fields.email}</span>
                <input name="email" type="email" autoComplete="email" maxLength={320} required />
              </label>
              {more
                .filter((field) => field.part === 1)
                .map((field) => (
                  <Extra key={field.name} field={field} />
                ))}
              <label className="is-wide">
                <span>{fields.project}</span>
                {fields.projectHint && <small className="roadmap-hint">{fields.projectHint}</small>}
                <textarea name="project" rows={3} maxLength={1500} required />
              </label>
              <label className="is-wide">
                <span>{fields.goal}</span>
                {fields.goalHint && <small className="roadmap-hint">{fields.goalHint}</small>}
                <textarea name="goal" rows={2} maxLength={400} required />
              </label>
            </div>

            <div className="roadmap-fields" data-part="2" hidden={part !== 2}>
              <p className="roadmap-hook is-wide">{copy.hook}</p>
              {more
                .filter((field) => field.part !== 1)
                .map((field) => (
                  <Extra key={field.name} field={field} />
                ))}
            </div>

            <div className="roadmap-actions">
              <button type="submit" className="btn btn-solid" disabled={(part === 2 && !endpoint) || !ready || status === "sending"}>
                <CtaContent label={part === 1 ? copy.next : status === "sending" ? copy.sending : copy.submit} />
              </button>
              {part === 2 && (
                <button type="button" className="roadmap-back" onClick={() => setPart(1)}>
                  {copy.back}
                </button>
              )}
              {!endpoint && <p className="thanks-note">{copy.unavailable}</p>}
              {status === "failed" && (
                <p ref={resultRef} tabIndex={-1} className="thanks-note" role="alert">
                  {copy.failed}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
