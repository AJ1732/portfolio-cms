"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MenuBars4Icon } from "@/assets/svgs";
import { NAVLINKS } from "@/constants/navlinks";

import { ContactMenu, NavLink } from "../elements";

export default function Navigation() {
  const pathname = usePathname();
  const container = useRef<HTMLDivElement>(null);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = isNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavOpen]);

  const toggleNav = () => setIsNavOpen((previous) => !previous);

  useGSAP(() => {}, { scope: container });

  const isHomePage = pathname === "/";
  if (isHomePage) return;

  return (
    <nav ref={container} className="menu-container">
      <div className="menu-bar fixed right-6 bottom-6 z-50 lg:top-6">
        <button
          onClick={toggleNav}
          className="menu-bar grid size-12 place-content-center rounded-full bg-neutral-900 text-white drop-shadow-sm"
        >
          <MenuBars4Icon className="size-3" />
        </button>

        {isNavOpen && (
          <div
            style={{ clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)" }}
            className="menu-overlay fixed top-0 left-0 flex h-dvh w-dvw flex-col gap-8 bg-neutral-900 p-8 text-neutral-200"
          >
            <button
              onClick={toggleNav}
              className="text-base-expand lg:text-xl-expand ml-auto size-fit"
            >
              Close
            </button>
            <ul className="menu-links text-4xl-expand font-bebas-neue md:text-6xl-expand lg:text-7xl-expand flex flex-1 flex-col items-start justify-end gap-4 font-black tracking-wide">
              {NAVLINKS.map((link) => (
                <li
                  key={link.label}
                  onClick={toggleNav}
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                  }}
                  className="menu-link-item capitalize"
                >
                  <NavLink {...link} className="menu-link-item-holder">
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <ContactMenu className="flex flex-wrap justify-between gap-4" />
          </div>
        )}
      </div>
    </nav>
  );
}
