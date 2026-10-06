"use client";

import Link from "next/link";
import { useMenu } from "@/components/menu";

export function Navbar() {
  const { openMenu } = useMenu();

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#C0C0C0] bg-[#131313] bg-[url('/backgrounds/default.svg')] bg-cover bg-fixed bg-center md:border-b-0">
      <div className="flex h-[93px] w-full items-center justify-between px-8 md:h-[84px] md:px-10">
        <Link href="/" className="flex items-center gap-3">
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

        <div className="hidden shrink-0 items-center gap-5 md:flex">
        <a
          href="/contact"
          className="inline-flex h-[52px] w-[154px] cursor-pointer items-center justify-center rounded-tl-[1000px] rounded-bl-[1000px] border-2 border-brand px-6 py-3 font-tanker text-[20px] leading-[1.2] font-normal tracking-normal whitespace-nowrap text-brand uppercase transition-colors duration-200 hover:bg-brand hover:text-brand-white"
        >
          Work with me
        </a>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={false}
          aria-controls="site-menu"
          onClick={openMenu}
          className="inline-flex h-[52px] w-[86px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-tr-[1000px] rounded-br-[1000px] border-brand bg-brand px-6 py-3 transition-colors duration-200 hover:bg-brand/70"
        >
          <span className="h-[4px] w-full bg-brand-white opacity-100" />
          <span className="h-[4px] w-full bg-brand-white opacity-100" />
        </button>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={false}
          aria-controls="site-menu"
          onClick={openMenu}
          className="inline-flex h-[49px] cursor-pointer flex-col items-end justify-center gap-[6px] md:hidden"
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
