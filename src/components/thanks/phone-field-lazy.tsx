"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { PhoneCopy } from "@/components/thanks/phone-field";

export type { PhoneCopy };

/**
 * The picker and the phone metadata load only once this mounts (the form is shown). While they
 * load, a plain required input holds the place, so the first step cannot be passed without a number.
 */
export function PhoneField({ copy }: { copy: PhoneCopy }) {
  const [Field, setField] = useState<ComponentType<{ copy: PhoneCopy }> | null>(null);

  useEffect(() => {
    let live = true;
    import("@/components/thanks/phone-field").then((mod) => live && setField(() => mod.default));
    return () => {
      live = false;
    };
  }, []);

  if (Field) return <Field copy={copy} />;
  return (
    <div className="phone-field" aria-busy>
      <label>
        <span>{copy.phone}</span>
        <input type="tel" inputMode="tel" autoComplete="tel-national" required maxLength={32} />
      </label>
    </div>
  );
}
