"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMenu } from "@/components/menu";

const desktopLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Selected work", href: "/selected-work" },
  { label: "Resume", href: "/resume" },
];

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { openMenu, covered } = useMenu();
  const pathname = usePathname();

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b border-[#C0C0C0] bg-[#131313] bg-[url('/backgrounds/default.svg')] bg-cover bg-fixed bg-center md:border-b-0 ${
          covered ? "invisible" : ""
        }`}
      >
        <div className="relative flex h-[93px] w-full items-center justify-between px-8 md:h-[84px] md:px-10">
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <img
              src="/logo-orange.svg"
              alt="Jayintop"
              width={35}
              height={52}
              className="h-[52px] w-[35px] md:hidden"
            />
            <img
              src="/logo-white.svg"
              alt=""
              width={22}
              height={32}
              className="hidden h-8 w-[22px] md:block"
            />
            <span className="hidden font-inter text-[30px] leading-[31.47px] font-medium tracking-[-0.04em] text-brand-white uppercase md:inline">
              Jayintop
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center md:flex"
          >
            <ul className="pointer-events-auto flex items-center gap-8">
              {desktopLinks.map((item) => {
                const active = linkActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`inline-flex items-center border-b-2 pb-2 font-bespoke text-[14px] leading-[1.5] font-normal tracking-normal text-brand-white uppercase transition-colors duration-200 ${
                        active
                          ? "border-brand"
                          : "border-transparent hover:border-brand/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 hidden shrink-0 items-center md:flex">
            <Link
              href="/contact"
              className="inline-flex h-[52px] cursor-pointer items-center justify-center rounded-tl-[12px] rounded-bl-[12px] rounded-tr-[1000px] rounded-br-[1000px] bg-brand px-6 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap text-brand-white uppercase transition-colors duration-200 hover:bg-brand/70"
            >
              Work with me
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={false}
            aria-controls="site-menu"
            onClick={openMenu}
            className={`inline-flex h-[49px] cursor-pointer flex-col items-end justify-center gap-[6px] md:hidden ${
              covered ? "invisible" : ""
            }`}
          >
            <span className="h-[4px] w-[43px] bg-brand-white" />
            <span className="h-[4px] w-[43px] bg-brand-white" />
          </button>
        </div>
      </header>
      <div aria-hidden className="h-[93px] shrink-0 md:h-[84px]" />
    </>
  );
}
