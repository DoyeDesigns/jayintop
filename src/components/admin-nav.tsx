"use client";

import { ChevronUp, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

const sections = [
  {
    label: "General",
    items: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Home", href: "/admin/home" },
      { label: "About", href: "/admin/about" },
      { label: "Work", href: "/admin/work" },
      { label: "Contact", href: "/admin/contact" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Case studies", href: "/admin/case-studies" },
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "Settings", href: "/admin/settings" },
      { label: "How this works", href: "/admin/how-this-works" },
    ],
  },
];

const sectionLabelClass =
  "px-3 font-bespoke text-[12px] leading-[1.2] font-normal tracking-normal text-brand-white/50 uppercase";

const linkClass =
  "flex h-10 w-full items-center gap-3 rounded-[6px] border-b px-3 py-2 font-tanker text-[18px] leading-[1.2] font-normal tracking-normal uppercase md:text-[20px]";

function Brand({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src="/logo-white.svg"
          alt=""
          width={22}
          height={32}
          className="h-8 w-[22px] shrink-0"
        />
        <span className="truncate font-inter text-[22.46px] leading-[23.56px] font-medium tracking-[-0.04em] text-brand-white uppercase">
          Jayintop Admin
        </span>
      </div>
      {onClose ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-brand-white md:hidden"
        >
          <X className="size-5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

function AccountCard() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative mt-4 shrink-0">
      {open ? (
        <div className="absolute right-0 bottom-full left-0 mb-2 rounded-xl border border-[#373A41] bg-[#1C1C1C] p-1">
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 font-inter text-[14px] leading-[20px] font-medium text-brand-white hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            Sign out
          </Link>
        </div>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-2xl border border-[#3A3A3A] py-2 pr-3 pl-2 text-left"
      >
        <span className="relative size-9 shrink-0">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-no-repeat"
            style={{
              backgroundImage: "url(/about-yinka.png)",
              backgroundSize: "205% auto",
              backgroundPosition: "50% 11%",
            }}
          />
          <span
            aria-hidden
            className="absolute -right-px -bottom-px size-2.5 rounded-full bg-[#3DDC84] ring-2 ring-[#131313]"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-inter text-[14px] leading-[18px] font-medium text-brand-white">
            Yinka Jayeola
          </span>
          <span className="mt-0.5 block truncate font-inter text-[12px] leading-[16px] font-normal text-[#94979C]">
            hello@jayintop.com
          </span>
        </span>
        <ChevronUp
          aria-hidden
          className={`size-4 shrink-0 text-brand-white/70 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex min-h-dvh bg-[#131313]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#131313] px-4 md:hidden">
        <Brand />
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="admin-nav"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 cursor-pointer flex-col items-end justify-center gap-[6px]"
        >
          <span className="h-[3px] w-8 bg-brand-white" />
          <span className="h-[3px] w-8 bg-brand-white" />
        </button>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        id="admin-nav"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[292px] shrink-0 flex-col overflow-x-hidden bg-[#131313] px-4 pt-8 pb-6 shadow-[1px_0_0_rgba(255,255,255,0.1)] md:sticky md:top-0 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Brand onClose={() => setOpen(false)} />

        <nav className="mt-10 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {sections.map((section, index) => (
            <div key={section.label} className={index === 0 ? "" : "mt-8"}>
              <p className={sectionLabelClass}>{section.label}</p>
              <ul className="mt-2">
                {section.items.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`${linkClass} ${
                          active
                            ? "border-brand text-brand"
                            : "border-transparent text-brand-white hover:text-brand"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <AccountCard />
      </aside>

      <div className="min-h-dvh min-w-0 flex-1 pt-16 md:pt-0">{children}</div>
    </div>
  );
}
