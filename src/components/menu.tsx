"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { linkedSocials } from "@/lib/socials";

const pages = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Selected work", href: "/selected-work" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
];

type SocialIcon = { name: string; src: string; href: string };

type MenuContextValue = {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  socials: SocialIcon[];
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenu() {
  const menu = useContext(MenuContext);
  if (!menu) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return menu;
}

export function MenuProvider({
  children,
  links = [],
}: {
  children: ReactNode;
  links?: { label: string; url: string }[];
}) {
  const [open, setOpen] = useState(false);
  const socials = linkedSocials(links);

  return (
    <MenuContext.Provider
      value={{
        open,
        openMenu: () => setOpen(true),
        closeMenu: () => setOpen(false),
        socials,
      }}
    >
      <div className={open ? "h-dvh overflow-hidden" : "contents"}>{children}</div>
      {open ? <Menu /> : null}
    </MenuContext.Provider>
  );
}

function MenuBars({ crossed, className }: { crossed: boolean; className: string }) {
  const bar =
    "absolute top-0 left-0 h-[4px] w-full origin-center bg-brand-white transition-transform duration-300 ease-out";

  return (
    <span className={`relative block h-[14px] ${className}`}>
      <span className={`${bar} ${crossed ? "translate-y-[5px] rotate-45" : ""}`} />
      <span
        className={`${bar} ${crossed ? "translate-y-[5px] -rotate-45" : "translate-y-[10px]"}`}
      />
    </span>
  );
}

function Menu() {
  const { closeMenu, socials } = useMenu();
  const [crossed, setCrossed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCrossed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
      autoFocus
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu();
      }}
      className="fixed inset-0 z-50 flex h-dvh flex-col overflow-hidden bg-brand text-brand-white outline-none"
    >
      <div className="flex h-[93px] w-full items-center justify-end px-8 md:h-auto md:px-10 md:py-4">
        <div className="hidden items-center gap-5 md:flex">
          <span className="invisible h-[52px] w-[154px]" aria-hidden />
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="inline-flex h-[52px] w-[86px] cursor-pointer items-center justify-center"
          >
            <MenuBars crossed={crossed} className="w-[38px]" />
          </button>
        </div>
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close menu"
          className="inline-flex h-[49px] cursor-pointer items-center justify-center md:hidden"
        >
          <MenuBars crossed={crossed} className="w-[43px]" />
        </button>
      </div>
      <nav className="flex-1 px-12 md:flex md:items-center">
        <ul className="flex flex-col gap-4 md:gap-0">
          {pages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                onClick={closeMenu}
                className="font-grotesk text-[37.2px] leading-none font-bold tracking-normal uppercase md:font-tanker md:text-[80px] md:leading-[1.2] md:font-normal"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden px-12 md:block">
        <div className="flex items-center justify-between border-t border-brand-white/50 py-6">
          <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
            <img
              src="/logo-white.svg"
              alt=""
              width={22}
              height={32}
              className="h-8 w-[22px]"
            />
            <span className="font-inter text-[30px] leading-[31.47px] font-medium tracking-[-0.04em] uppercase">
              Jayintop
            </span>
          </Link>
          <ul className="flex items-center gap-5">
            {socials.map((social) => (
              <li key={social.name}>
                <a href={social.href} aria-label={social.name} className="inline-flex">
                  <span
                    className="h-6 w-6 bg-brand-white mask-(--icon) mask-center mask-no-repeat mask-contain"
                    style={{ "--icon": `url("${social.src}")` } as CSSProperties}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
