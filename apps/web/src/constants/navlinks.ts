import type { NavLinkType } from "@/types/navlink";

export const NAVLINKS: NavLinkType[] = [
  {
    label: "home",
    href: "/",
    description: "Let's go back to base",
  },
  {
    label: "selected works",
    href: "/works",
    description: "What have I been working on?",
  },
  {
    label: "about the author",
    href: "/about",
    description: "Learn more about me.",
  },
  // {
  //   label: "Stuff I write",
  //   href: "/writings",
  //   description: "Read my thoughts about code and design",
  // },
  {
    label: "Reach Out",
    href: "/contact",
    description: "Can I hear from you?",
  },
];
