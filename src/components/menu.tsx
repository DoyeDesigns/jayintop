"use client";

import { X } from "lucide-react";
import Link from "next/link";
import {
  createContext,
  useContext,
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

function Menu() {
  const { closeMenu, socials } = useMenu();

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
      <div className="flex justify-end px-8 pt-8 md:px-10 md:pt-10">
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close menu"
          className="cursor-pointer"
        >
          <X size={33} strokeWidth={1.25} />
        </button>
      </div>

      <nav className="mt-[100px] flex-1 px-12 md:mt-0 md:flex md:items-center">
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
