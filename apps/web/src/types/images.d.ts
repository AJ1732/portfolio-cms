import { assets } from "@/assets";

type AssetKey = keyof typeof assets;

interface ImageItem {
  tag: AssetKey;
  src: string;
  caption: string;
  dimensions?: { width: number; height: number } | null;
  lqip?: string;
}
