"use client";
import { memo } from "react";

import { getSanityImageProps } from "@/lib/sanity/image";

import { BlurImage } from "./blur-image";

interface SanityImageProps {
  image: SanityImageWithMetadata;
  width?: number;
  height?: number;
  quality?: number;
  className?: string;
  priority?: boolean;
}

/**
 * SanityImage component - Displays Sanity images with LQIP blur effect
 *
 * Automatically extracts LQIP, dimensions, and builds optimized URLs from Sanity image objects.
 * Uses BlurImage component for smooth loading with blur placeholder.
 *
 * @example
 * ```tsx
 * <SanityImage
 *   image={post.mainImage}
 *   width={800}
 *   quality={85}
 *   className="rounded-lg"
 * />
 * ```
 */
export const SanityImage = memo(function SanityImage({
  image,
  width,
  height,
  quality = 75,
  className,
}: SanityImageProps) {
  if (!image?.asset) {
    return null;
  }

  const imageProps = getSanityImageProps(image, { width, height, quality });

  return <BlurImage {...imageProps} className={className} />;
});
