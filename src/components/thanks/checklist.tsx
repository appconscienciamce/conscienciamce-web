"use client";

import { useEffect, useState } from "react";

interface Step {
  id: string;
  label: string;
  optional?: string;
}

/** Follows the reader down the steps. Only an aid: every step is on the page. */
export function Checklist({ title, steps }: { title: string; steps: Step[] }) {
  const [current, setCurrent] = useState(steps[0].id);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const first = steps.find((step) => visible.has(step.id));
        if (first) setCurrent(first.id);
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    steps.forEach((step) => {
      const target = document.getElementById(step.id);
      if (target) observer.observe(target);
    });
    return () => observer.disconnect();
  }, [steps]);

  return (
    <nav className="thanks-checklist" aria-label={title}>
      <p>{title}</p>
      <ol>
        {steps.map((step, i) => (
          <li key={step.id}>
            <a href={`#${step.id}`} aria-current={current === step.id ? "step" : undefined}>
              <span aria-hidden>{i + 1}</span>
              <span>
                {step.label}
                {step.optional && <small>{step.optional}</small>}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
