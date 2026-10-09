import type { CSSProperties } from "react";
import Link from "next/link";
import { linkedSocials } from "@/lib/socials";

export function Footer({
  links = [],
}: {
  links?: { label: string; url: string }[];
}) {
  const socials = linkedSocials(links);
  return (
    <footer className="w-full px-6 py-8 md:px-10">
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

        <ul className="order-2 flex flex-wrap justify-center items-center gap-5 md:order-3 md:justify-self-end">
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
                  className="h-6 w-6 bg-[#717680] mask-(--icon) mask-center mask-no-repeat mask-contain transition-colors duration-200 group-hover:bg-brand"
                  style={{ "--icon": `url("${social.src}")` } as CSSProperties}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
