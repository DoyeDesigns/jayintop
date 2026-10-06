"use client";

import Image from "next/image";
import { useState, type FormEvent, type MouseEvent } from "react";
import { sendAdminReset, signInAdmin } from "@/app/admin/actions";

const labelClass =
  "font-inter text-[14px] leading-[20px] font-medium tracking-normal text-[#CECFD2]";

const inputClass =
  "h-11 w-full rounded-lg border border-[#373A41] bg-transparent px-3.5 text-[16px] leading-[24px] font-normal tracking-normal text-[#F7F7F7] outline-none placeholder:text-[#85888E] focus:border-[#61656C]";

const gridMask = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter></defs><polygon points="-78,-36 178,-36 50,58" fill="white" filter="url(#b)"/></svg>`,
)}")`;

export function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setNotice(null);
    const result = await signInAdmin(new FormData(event.currentTarget));
    setPending(false);
    if (result?.error) setError(result.error);
  };

  const onForgot = async (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    if (!form) return;
    setPending(true);
    setError(null);
    const result = await sendAdminReset(String(new FormData(form).get("email") ?? ""));
    setPending(false);
    setNotice(result.message);
  };

  return (
    <main className="grid min-h-dvh bg-[#0C0E12] md:grid-cols-2">
      <section className="relative flex min-h-dvh flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: gridMask,
            WebkitMaskImage: gridMask,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />

        <div className="relative flex flex-1 items-center justify-center px-6 py-16">
          <form onSubmit={onSubmit} className="flex w-full max-w-[360px] flex-col">
            <img
              src="/logo-white.svg"
              alt="Jayintop"
              width={28}
              height={40}
              className="mx-auto h-10 w-7"
            />

            <h1 className="mt-6 text-center font-inter text-[30px] leading-[38px] font-semibold tracking-normal text-[#F7F7F7]">
              Welcome back Jayintop
            </h1>
            <p className="mt-3 text-center font-inter text-[16px] leading-[24px] font-normal tracking-normal text-[#94979C]">
              Welcome back! Please enter your details.
            </p>

            <label className="mt-8 flex flex-col gap-2">
              <span className={labelClass}>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={inputClass}
              />
            </label>

            <label className="mt-5 flex flex-col gap-2">
              <span className={labelClass}>Password</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                className={inputClass}
              />
            </label>

            <div className="mt-5 flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <span className="relative size-4 shrink-0">
                  <input
                    type="checkbox"
                    name="remember"
                    className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                  />
                  <span className="pointer-events-none absolute inset-0 rounded border border-[#373A41] bg-transparent peer-checked:border-brand peer-checked:bg-brand" />
                  <svg
                    viewBox="0 0 16 16"
                    aria-hidden
                    className="pointer-events-none absolute inset-0 hidden text-white peer-checked:block"
                  >
                    <path
                      d="M4 8.2 6.6 10.8 12 5.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className={labelClass}>Remember for 30 days</span>
              </label>
              <button
                type="button"
                onClick={onForgot}
                disabled={pending}
                className={`cursor-pointer hover:text-brand disabled:cursor-default ${labelClass}`}
              >
                Forgot password
              </button>
            </div>

            {error ? (
              <p className="mt-4 font-inter text-[14px] leading-[20px] text-[#F97066]" role="alert">
                {error}
              </p>
            ) : null}
            {notice ? (
              <p className="mt-4 font-inter text-[14px] leading-[20px] text-[#CECFD2]" role="status">
                {notice}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="mt-6 h-11 w-full cursor-pointer rounded-l-none rounded-full bg-brand font-tanker text-[20px] leading-[20px] tracking-normal text-white uppercase transition-colors duration-200 hover:bg-brand/70 disabled:cursor-default disabled:opacity-70 disabled:hover:bg-brand"
            >
              {pending ? "Please wait" : "Sign in"}
            </button>

            <p className="mt-8 text-center font-inter text-[14px] leading-[20px] font-normal tracking-normal text-[#94979C]">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="cursor-pointer hover:text-brand font-semibold text-[#CECFD2]"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>

        <p className="absolute bottom-8 left-8 font-inter text-[14px] leading-[20px] font-normal tracking-normal text-[#94979C]">
          © Jayintop 2026
        </p>
      </section>

      <section className="hidden items-center justify-center bg-[#F9A000] md:flex">
        <Image
          src="/cap.png"
          alt="Black Jayintop cap"
          width={582}
          height={406}
          priority
          className="h-auto w-[min(520px,72%)]"
        />
      </section>
    </main>
  );
}
