import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Extract LQIP from Sanity CDN URL
 * Fetches metadata from Sanity API based on image URL
 */
export async function fetchSanityImageLQIP(
  imageUrl: string,
): Promise<string | null> {
  try {
    // Extract asset ID from Sanity CDN URL
    // URL format: https://cdn.sanity.io/media-libraries/{projectId}/images/{assetId}-{width}x{height}.{ext}
    const match = imageUrl.match(
      /cdn\.sanity\.io\/(?:images|media-libraries)\/[^/]+\/images\/([a-f0-9]+)-\d+x\d+\.\w+/,
    );

    if (!match || !match[1]) {
      return null;
    }

    const assetId = match[1];

    // Query Sanity for image metadata
    const query = `*[_type == "sanity.imageAsset" && assetId == $assetId][0]{
      metadata {
        lqip
      }
    }`;

    const result = await sanityClient.fetch(query, { assetId });

    return result?.metadata?.lqip || null;
  } catch (error) {
    console.error("Error fetching LQIP:", error);
    return null;
  }
}

/**
 * Get LQIP URL from Sanity CDN URL by adding query parameter
 * This is a simpler approach that uses Sanity's on-the-fly LQIP generation
 */
export function getSanityUrlWithLQIP(imageUrl: string): string {
  if (!imageUrl.includes("cdn.sanity.io")) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);
    url.searchParams.set("blur", "50");
    url.searchParams.set("w", "20");
    url.searchParams.set("q", "30");
    return url.toString();
  } catch {
    return imageUrl;
  }
}

/**
 * Extract dimensions from Sanity image URL or metadata
 */
export function getSanityImageDimensions(
  image: SanityImageWithMetadata | string,
): { width: number; height: number } | null {
  // If image object with metadata, use that first
  if (typeof image === "object" && image.asset?.metadata?.dimensions) {
    const { width, height } = image.asset.metadata.dimensions;
    return { width, height };
  }

  // Fallback to parsing URL
  const url = typeof image === "string" ? image : image.asset?.url || "";
  const match = url.match(/-(\d+)x(\d+)\.\w+$/);
  if (match) {
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    return { width, height };
  }

  return null;
}

/**
 * Get LQIP (Low Quality Image Placeholder) from Sanity image
 */
export function getSanityImageLQIP(
  image: SanityImageWithMetadata,
): string | null {
  return image.asset?.metadata?.lqip || null;
}

/**
 * Calculate the effective aspect ratio after crop is applied
 * Returns the cropped aspect ratio, or original if no crop exists
 */
export function getCroppedAspectRatio(image: SanityImageWithMetadata): number {
  const dimensions = image.asset?.metadata?.dimensions;
  if (!dimensions) return 1;

  const { width, height } = dimensions;
  const crop = image.crop;

  if (!crop) {
    return dimensions.aspectRatio || width / height;
  }

  // Calculate cropped dimensions
  const croppedWidth = width * (1 - (crop.left || 0) - (crop.right || 0));
  const croppedHeight = height * (1 - (crop.top || 0) - (crop.bottom || 0));

  return croppedWidth / croppedHeight;
}

/**
 * Build optimized Sanity image URL with parameters
 */
export function buildSanityImageUrl(
  image: SanityImageWithMetadata,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
    auto?: "format";
  } = {},
): string {
  let imageBuilder = builder.image(image);

  if (options.width) imageBuilder = imageBuilder.width(options.width);
  if (options.height) imageBuilder = imageBuilder.height(options.height);
  if (options.quality) imageBuilder = imageBuilder.quality(options.quality);
  if (options.fit) imageBuilder = imageBuilder.fit(options.fit);
  if (options.auto) imageBuilder = imageBuilder.auto(options.auto);

  return imageBuilder.url();
}

/**
 * Get complete image data for BlurImage component
 */
export function getSanityImageProps(
  image: SanityImageWithMetadata,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {},
) {
  const dimensions = getSanityImageDimensions(image);
  const lqip = getSanityImageLQIP(image);

  if (!dimensions) {
    throw new Error("Could not determine image dimensions");
  }

  const source = buildSanityImageUrl(image, {
    width: options.width || dimensions.width,
    height: options.height || dimensions.height,
    quality: options.quality || 75,
    auto: "format",
    fit: "max",
  });

  return {
    src: source,
    lqip: lqip || "",
    width: options.width || dimensions.width,
    height: options.height || dimensions.height,
    alt: image.alt || "",
  };
}
