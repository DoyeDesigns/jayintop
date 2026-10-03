"use client";

import { ChevronDown } from "lucide-react";
import { useState, type FormEvent } from "react";
import { submitContact } from "@/app/contact/actions";
import { countries, defaultCountry, type Country } from "@/lib/countries";

const fieldClass =
  "w-full rounded-lg border border-[#D5D7DA] bg-[#1A1A1A]/40 px-[14px] py-[10px] font-bespoke text-[16px] leading-[1.5] font-normal text-brand-white outline-none placeholder:font-bespoke placeholder:text-[16px] placeholder:leading-[1.5] placeholder:text-[#8A8A8A]";

const labelClass =
  "font-bespoke text-[16px] leading-[1.5] font-normal text-brand-white";

export function ContactForm({ label }: { label: string }) {
  const [country, setCountry] = useState<Country>(defaultCountry);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await submitContact(new FormData(event.currentTarget));
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  return (
    <form onSubmit={submit} className="mx-auto flex w-full max-w-[480px] flex-col gap-5">
      <div className="flex flex-col gap-5 md:flex-row md:gap-8">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className={labelClass}>
            First name <span className="text-brand">*</span>
          </span>
          <input
            required
            name="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            className={`${fieldClass} h-[44px]`}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className={labelClass}>
            Last name <span className="text-brand">*</span>
          </span>
          <input
            required
            name="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last name"
            autoComplete="family-name"
            className={`${fieldClass} h-[44px]`}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>
          Email <span className="text-brand">*</span>
        </span>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          className={`${fieldClass} h-[44px]`}
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Phone number</span>
        <div className="relative">
          <div className="flex h-[44px] items-center rounded-lg border border-[#D5D7DA] bg-[#1A1A1A]/40">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={countriesOpen}
              onClick={() => setCountriesOpen((open) => !open)}
              className="flex h-full shrink-0 cursor-pointer items-center gap-1 px-[14px] font-bespoke text-[16px] leading-[1.5] text-brand-white"
            >
              {country.iso}
              <ChevronDown size={16} strokeWidth={1.5} />
            </button>
            <input type="hidden" name="phone" value={phone ? `+${country.dial} ${phone}` : ""} />
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={country.placeholder}
              autoComplete="tel"
              className="h-full min-w-0 flex-1 bg-transparent pr-[14px] font-bespoke text-[16px] leading-[1.5] font-normal text-brand-white outline-none placeholder:font-bespoke placeholder:text-[16px] placeholder:leading-[1.5] placeholder:text-[#8A8A8A]"
            />
          </div>
          {countriesOpen ? (
            <>
              <button
                type="button"
                aria-label="Close country list"
                onClick={() => setCountriesOpen(false)}
                className="fixed inset-0 z-20 cursor-default"
              />
              <ul
                role="listbox"
                aria-label="Country code"
                className="absolute top-[calc(100%+8px)] right-0 left-0 z-30 max-h-60 overflow-y-auto rounded-lg border border-[#D5D7DA] bg-[#1A1A1A] py-1"
              >
                {countries.map((item) => (
                  <li key={item.iso}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={item.iso === country.iso}
                      onClick={() => {
                        setCountry(item);
                        setCountriesOpen(false);
                      }}
                      className="flex w-full cursor-pointer items-center justify-between px-[14px] py-2 text-left font-bespoke text-[16px] leading-[1.5] text-brand-white hover:bg-white/5"
                    >
                      <span>{item.name}</span>
                      <span className="text-[#8A8A8A]">+{item.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>
          Message <span className="text-brand">*</span>
        </span>
        <textarea
          required
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Leave us a message..."
          className={`${fieldClass} h-[130px] resize-y py-[10px]`}
        />
      </label>

      {error ? (
        <p className="font-bespoke text-[16px] leading-[1.5] text-[#F97066]" role="alert">
          {error}
        </p>
      ) : null}
      {sent ? (
        <p className="font-bespoke text-[16px] leading-[1.5] text-brand-white" role="status">
          Message sent. I will get back to you.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="h-[52px] cursor-pointer rounded-tr-[1000px] rounded-br-[1000px] bg-brand font-tanker text-[20px] leading-[1.2] font-normal tracking-normal text-brand-white uppercase disabled:cursor-default disabled:opacity-70"
      >
        {pending ? "Sending" : label}
      </button>
    </form>
  );
}
