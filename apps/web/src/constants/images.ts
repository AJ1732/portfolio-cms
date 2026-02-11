import { assets } from "@/assets";
import { getSanityImageDimensions } from "@/lib/sanity/image";
import { ImageItem } from "@/types/images";

export const PROFILES: ImageItem[] = [
  {
    tag: "profile",
    src: assets["profile"],
    caption: "lemme stare in your eyes a little bit",
    dimensions: getSanityImageDimensions(assets["profile"]),
  },
  {
    tag: "camera-shy",
    src: assets["camera-shy"],
    caption: "6 eyes? Call me Gojo now",
    dimensions: getSanityImageDimensions(assets["camera-shy"]),
  },
  {
    tag: "full-view",
    caption: "Lightskin mode activated",
    src: assets["full-view"],
    dimensions: getSanityImageDimensions(assets["full-view"]),
  },
];
