"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";

export interface PhoneCopy {
  phone: string;
  phoneHint: string;
  phoneCountry: string;
  phoneSearch: string;
  phoneEmpty: string;
  phoneRequired: string;
  phoneInvalid: string;
}

/** Main markets first, in this order; everything else follows alphabetically. */
const PRIORITY: CountryCode[] = ["AR", "CO", "ES", "MX", "UY", "CL", "PE", "US"];

const ZONE_COUNTRY: Record<string, CountryCode> = {
  "America/Bogota": "CO",
  "Europe/Madrid": "ES",
  "Atlantic/Canary": "ES",
  "Africa/Ceuta": "ES",
  "America/Montevideo": "UY",
  "America/Santiago": "CL",
  "America/Punta_Arenas": "CL",
  "Pacific/Easter": "CL",
  "America/Lima": "PE",
  "America/Caracas": "VE",
  "America/Guayaquil": "EC",
  "America/La_Paz": "BO",
  "America/Asuncion": "PY",
  "America/Panama": "PA",
  "America/Costa_Rica": "CR",
  "America/Guatemala": "GT",
  "America/El_Salvador": "SV",
  "America/Tegucigalpa": "HN",
  "America/Managua": "NI",
  "America/Santo_Domingo": "DO",
  "America/Havana": "CU",
  "America/Puerto_Rico": "PR",
  "Europe/Lisbon": "PT",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Rome": "IT",
  "America/Sao_Paulo": "BR",
  "America/Fortaleza": "BR",
  "America/Bahia": "BR",
  "America/Manaus": "BR",
  "America/Recife": "BR",
  "America/Belem": "BR",
  "America/Cuiaba": "BR",
  "America/Campo_Grande": "BR",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Phoenix": "US",
  "America/Detroit": "US",
  "America/Anchorage": "US",
  "America/Boise": "US",
  "Pacific/Honolulu": "US",
};

const MEXICO_ZONES = new Set([
  "Mexico_City", "Monterrey", "Merida", "Cancun", "Chihuahua", "Hermosillo", "Tijuana",
  "Mazatlan", "Matamoros", "Bahia_Banderas", "Ojinaga", "Ciudad_Juarez",
]);

/** A guess from the device time zone; Argentina when nothing matches. */
function guessCountry(): CountryCode {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (zone.startsWith("America/Argentina/") || zone === "America/Buenos_Aires") return "AR";
    if (MEXICO_ZONES.has(zone.replace("America/", ""))) return "MX";
    return ZONE_COUNTRY[zone] ?? "AR";
  } catch {
    return "AR";
  }
}

interface Option {
  code: CountryCode;
  name: string;
  dial: string;
  /** Lowercase, accent-free name for matching. */
  key: string;
}

const fold = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function buildOptions(): Option[] {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames(["es"], { type: "region" });
  } catch {
    names = null;
  }
  const all = getCountries().map((code) => {
    const name = names?.of(code) ?? code;
    return { code, name, dial: getCountryCallingCode(code), key: fold(name) };
  });
  const collator = new Intl.Collator("es");
  const first = PRIORITY.map((code) => all.find((o) => o.code === code)).filter((o): o is Option => !!o);
  const rest = all.filter((o) => !PRIORITY.includes(o.code)).sort((a, b) => collator.compare(a.name, b.name));
  return [...first, ...rest];
}

function parse(value: string, country: CountryCode) {
  return parsePhoneNumberFromString(value, value.trim().startsWith("+") ? undefined : country);
}

/**
 * WhatsApp reaches Argentine mobiles only with the 9 after +54. People often type
 * their number without it ("11 2345-6789"), which still validates as a landline,
 * so it is added here: a WhatsApp field is a mobile field.
 */
function whatsappNumber(callingCode: string, nationalNumber: string, e164: string): string {
  if (callingCode === "54" && !nationalNumber.startsWith("9")) return `+549${nationalNumber}`;
  return e164;
}

function Flag({ code, eager = false }: { code: string; eager?: boolean }) {
  return (
    // Static SVGs: they render the same on Windows, where flag emoji show up as letters.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="phone-flag"
      src={`/flags/${code}.svg`}
      alt=""
      width={24}
      height={16}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export default function PhoneField({ copy }: { copy: PhoneCopy }) {
  const uid = useId();
  const inputId = `${uid}-tel`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;
  const listId = `${uid}-list`;

  const options = useMemo(buildOptions, []);
  const [country, setCountry] = useState<CountryCode>(guessCountry);
  const [national, setNational] = useState("");
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.code === country) ?? options[0];

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return options;
    const digits = q.replace(/^\+/, "");
    if (/^\d+$/.test(digits)) return options.filter((o) => o.dial.startsWith(digits));
    return options.filter((o) => o.key.includes(q) || o.code.toLowerCase() === q);
  }, [options, query]);

  const parsed = useMemo(() => (national.trim() ? parse(national, country) : undefined), [national, country]);
  const error = !national.trim() ? copy.phoneRequired : parsed?.isValid() ? "" : copy.phoneInvalid;
  const e164 = error || !parsed ? "" : whatsappNumber(parsed.countryCallingCode, parsed.nationalNumber, parsed.number);

  // The browser's own validation drives the step: Continue only moves on when this is empty.
  useEffect(() => inputRef.current?.setCustomValidity(error), [error]);

  // Close on a tap outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>("[aria-selected='true']")?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const openList = () => {
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.code === country)));
    setOpen(true);
  };

  const choose = (option: Option) => {
    setCountry(option.code);
    // Re-format the digits already typed for the new country.
    setNational((value) => (value.trim().startsWith("+") ? value : new AsYouType(option.code).input(value)));
    setOpen(false);
    inputRef.current?.focus();
  };

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(filtered.length - 1);
    } else if (e.key === "Enter") {
      // Never submit the form from the search box.
      e.preventDefault();
      if (filtered[active]) choose(filtered[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const deleting = (e.nativeEvent as InputEvent).inputType?.startsWith("delete");
    const digitsOf = (text: string) => text.replace(/\D/g, "");

    // A pasted or typed international number picks its own country.
    if (raw.trim().startsWith("+")) {
      const typer = new AsYouType();
      typer.input(raw);
      const detected = typer.getCountry();
      const nationalNumber = typer.getNumber()?.nationalNumber;
      if (detected && nationalNumber) {
        setCountry(detected);
        setNational(new AsYouType(detected).input(nationalNumber));
      } else {
        setNational(raw.replace(/[^\d+\s]/g, ""));
      }
      return;
    }

    let digits = digitsOf(raw);
    // Deleting a separator would just put it back: take the digit before it instead.
    if (deleting && digits === digitsOf(national)) digits = digits.slice(0, -1);
    setNational(new AsYouType(country).input(digits));
  };

  return (
    <div className="phone-field" ref={rootRef}>
      <label htmlFor={inputId}>
        <span>{copy.phone}</span>
      </label>
      <small className="roadmap-hint" id={hintId}>
        {copy.phoneHint}
      </small>

      <div className="phone-row">
        <button
          type="button"
          ref={triggerRef}
          className="phone-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label={`${copy.phoneCountry}: ${selected.name} +${selected.dial}`}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && !open) {
              e.preventDefault();
              openList();
            }
          }}
        >
          <Flag code={selected.code} eager />
          <span className="phone-dial">+{selected.dial}</span>
          <span aria-hidden className="phone-caret" />
        </button>

        <input
          ref={inputRef}
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          maxLength={32}
          required
          value={national}
          aria-invalid={touched && !!error}
          aria-describedby={`${hintId}${touched && error ? ` ${errorId}` : ""}`}
          onChange={onNumberChange}
          onBlur={() => setTouched(true)}
          onInvalid={(e) => {
            // Our inline message replaces the browser bubble; keep the focus move.
            e.preventDefault();
            setTouched(true);
            e.currentTarget.focus();
          }}
        />
        <input type="hidden" name="phone" value={e164} />

        {open && (
          <div className="phone-pop">
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={filtered[active] ? `${uid}-opt-${filtered[active].code}` : undefined}
              aria-label={copy.phoneSearch}
              placeholder={copy.phoneSearch}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onSearchKey}
            />
            <ul ref={listRef} id={listId} role="listbox" aria-label={copy.phoneCountry}>
              {filtered.map((option, index) => (
                <li
                  key={option.code}
                  id={`${uid}-opt-${option.code}`}
                  role="option"
                  aria-selected={index === active}
                  data-current={option.code === country ? "" : undefined}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => choose(option)}
                  onPointerMove={() => index !== active && setActive(index)}
                >
                  <Flag code={option.code} />
                  <span className="phone-name">{option.name}</span>
                  <span className="phone-code">+{option.dial}</span>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="phone-none" role="presentation">
                  {copy.phoneEmpty}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {touched && error && (
        <small className="phone-error" id={errorId} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
