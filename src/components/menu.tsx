"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
  shown: boolean;
  covered: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  socials: SocialIcon[];
};

const menuMs = 500;
const barMs = 380;
const menuEase = "cubic-bezier(0.22, 1, 0.36, 1)";

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
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [covered, setCovered] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const barTimer = useRef<number | null>(null);
  const socials = linkedSocials(links);

  const clearCloseTimers = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (barTimer.current) window.clearTimeout(barTimer.current);
  };

  const openMenu = () => {
    clearCloseTimers();
    setCovered(true);
    setShown(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpen(true));
    });
  };

  const closeMenu = () => {
    setOpen(false);
    clearCloseTimers();
    barTimer.current = window.setTimeout(() => setCovered(false), barMs);
    closeTimer.current = window.setTimeout(() => setShown(false), menuMs + 40);
  };

  const finishClose = () => {
    if (open) return;
    clearCloseTimers();
    setCovered(false);
    setShown(false);
  };

  return (
    <MenuContext.Provider
      value={{
        open,
        shown,
        covered,
        openMenu,
        closeMenu,
        socials,
      }}
    >
      <div className={shown ? "h-dvh overflow-hidden" : "contents"}>{children}</div>
      {shown ? <Menu open={open} onClosed={finishClose} /> : null}
    </MenuContext.Provider>
  );
}

function MenuBars({ crossed, className }: { crossed: boolean; className: string }) {
  const bar =
    "absolute top-0 left-0 h-[4px] w-full origin-center bg-brand-white transition-transform ease-out motion-reduce:transition-none motion-reduce:delay-0";
  const motion = {
    transitionDuration: `${menuMs}ms`,
    transitionTimingFunction: menuEase,
  };

  return (
    <span className={`relative block h-[14px] ${className}`}>
      <span
        className={`${bar} ${crossed ? "translate-y-[5px] rotate-45" : ""}`}
        style={motion}
      />
      <span
        className={`${bar} ${crossed ? "translate-y-[5px] -rotate-45" : "translate-y-[10px]"}`}
        style={motion}
      />
    </span>
  );
}

function Menu({ open, onClosed }: { open: boolean; onClosed: () => void }) {
  const { closeMenu, covered, socials } = useMenu();
  const [crossed, setCrossed] = useState(false);

  useEffect(() => {
    setCrossed(open);
  }, [open]);

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
      className="fixed inset-0 z-50 text-brand-white outline-none"
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[93px] items-center justify-end px-8 md:h-[84px] md:px-10 ${
        covered ? "bg-brand" : "invisible"
      }`}>
        <div className="pointer-events-auto hidden items-center gap-5 md:flex">
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
          className="pointer-events-auto inline-flex h-[49px] cursor-pointer items-center justify-center md:hidden"
        >
          <MenuBars crossed={crossed} className="w-[43px]" />
        </button>
      </div>
      <div className="absolute inset-x-0 top-[93px] bottom-0 overflow-hidden md:top-[84px]">
      <div
        onTransitionEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.propertyName !== "transform") return;
          if (!open) onClosed();
        }}
        style={{ transitionTimingFunction: menuEase }}
        className={`h-full will-change-transform transition-transform duration-500 motion-reduce:transition-none ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
      <div className="flex h-full flex-col overflow-auto bg-brand">
      <nav className="flex-1 px-12 md:flex md:items-center">
        <ul className="flex flex-col gap-4 md:gap-0">
          {pages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                onClick={closeMenu}
                className="font-tanker text-[48px] leading-[1.2] font-normal tracking-normal uppercase transition-colors duration-200 hover:text-[#131313] md:text-[80px]"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex mt-4 md:mt-0 flex-col items-center gap-6 px-8 pb-10 md:flex-row md:justify-between md:border-b md:border-brand-white/50 md:px-12 md:py-6">
        <Link href="/" onClick={closeMenu} className="flex items-center hidden md:flex gap-3">
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
        <ul className="flex flex-wrap justify-center items-center gap-5">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex"
              >
                <span
                  className="h-6 w-6 bg-brand-white mask-(--icon) mask-center mask-no-repeat mask-contain transition-colors duration-200 group-hover:bg-[#131313]"
                  style={{ "--icon": `url("${social.src}")` } as CSSProperties}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}
