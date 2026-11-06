"use client";

import { useEffect, useRef, useState } from "react";
import { CtaContent } from "@/components/cta-content";
import { track } from "@/lib/analytics";

interface RoadmapCopy {
  endpoint: string | null;
  fields: { name: string; email: string; project: string; goal: string };
  submit: string;
  sending: string;
  sent: string;
  failed: string;
  unavailable: string;
}

type Status = "idle" | "sending" | "sent" | "failed";

const TIMEOUT_MS = 15000;

/**
 * Sends only to a real endpoint. Without one the button stays off: telling
 * someone their answers arrived when they did not is worse than waiting.
 */
export function RoadmapForm({ copy }: { copy: RoadmapCopy }) {
  const [status, setStatus] = useState<Status>("idle");
  // Until React is here a submit would be a native one, with the answers in the URL.
  const [ready, setReady] = useState(false);
  const resultRef = useRef<HTMLParagraphElement>(null);
  // Same id on every retry: an answer stored behind a failed response can be told apart.
  const submissionId = useRef("");
  const { endpoint, fields } = copy;

  useEffect(() => setReady(true), []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!endpoint || status === "sending") return;
    setStatus("sending");
    submissionId.current ||= crypto.randomUUID();
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // A redirect means this is not the endpoint that stores the answers.
        redirect: "error",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        body: JSON.stringify({ ...Object.fromEntries(new FormData(e.currentTarget)), submissionId: submissionId.current }),
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
    <form className="roadmap-form" method="post" onSubmit={onSubmit} aria-busy={status === "sending"}>
      <label>
        <span>{fields.name}</span>
        <input name="name" type="text" autoComplete="name" maxLength={200} required />
      </label>
      <label>
        <span>{fields.email}</span>
        <input name="email" type="email" autoComplete="email" maxLength={320} required />
      </label>
      <label className="is-wide">
        <span>{fields.project}</span>
        <textarea name="project" rows={3} maxLength={5000} required />
      </label>
      <label className="is-wide">
        <span>{fields.goal}</span>
        <textarea name="goal" rows={3} maxLength={5000} required />
      </label>
      <div className="roadmap-actions">
        <button type="submit" className="btn btn-solid" disabled={!endpoint || !ready || status === "sending"}>
          <CtaContent label={status === "sending" ? copy.sending : copy.submit} />
        </button>
        {!endpoint && <p className="thanks-note">{copy.unavailable}</p>}
        {status === "failed" && (
          <p ref={resultRef} tabIndex={-1} className="thanks-note" role="alert">
            {copy.failed}
          </p>
        )}
      </div>
    </form>
  );
}
