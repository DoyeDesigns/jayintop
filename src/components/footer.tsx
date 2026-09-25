import Link from "next/link";
import { socials } from "@/lib/socials";

export function Footer() {
  return (
    <footer className="px-6 py-8 md:px-10 w-full max-w-[1380px] mx-auto">
      <div className="flex flex-col items-center gap-8 md:grid md:grid-cols-3 md:items-center">
        <Link
          href="/"
          className="order-1 flex items-center gap-3 md:justify-self-start"
        >
          <img
            src="/logo-white.svg"
            alt=""
            width={22}
            height={32}
            className="h-8 w-[22px]"
          />
          <span className="font-inter text-[30px] leading-[31.47px] font-medium tracking-[-0.04em] text-brand-white uppercase">
            Jayintop
          </span>
        </Link>

        <p className="order-3 text-center font-bespoke text-sm text-[#A4A7AE] md:order-2">
          © {new Date().getFullYear()} Jayintop. All rights reserved.
        </p>

        <ul className="order-2 flex items-center gap-5 md:order-3 md:justify-self-end">
          {socials.map((social) => (
            <li key={social.name}>
              <a href="#" aria-label={social.name} className="inline-flex">
                <img src={social.src} alt="" width={24} height={24} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
