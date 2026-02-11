import { Bebas_Neue, Josefin_Sans } from "next/font/google";
import localFont from "next/font/local";

// BEBAS NEUE
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas-neue",
});

// JOSEFIN SANS
export const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-josefin-sans",
  display: "swap",
});

// NEUE EINSTELLUNG
export const neueEinstellung = localFont({
  variable: "--font-neue-einstellung",
  display: "swap",
  src: [
    {
      path: "../../../public/fonts/neue-einstellung-light/font.woff2",
      weight: "300",
      style: "normal",
    },
  ],
});
