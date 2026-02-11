# Sanity Image with LQIP Usage Guide

## Overview

The `SanityImage` component integrates Sanity's LQIP (Low Quality Image Placeholder) functionality with the `BlurImage` component for smooth image loading with blur effects.

## What Was Implemented

### 1. **Enhanced Type Definitions** (`src/types/blog.ts`)

- `SanityImageAsset` - Sanity image asset reference
- `SanityImageMetadata` - Image metadata including LQIP, palette, dimensions
- `SanityImageWithMetadata` - Complete image object with all data
- Updated `BlogPost` interface to use rich image types

### 2. **Updated GROQ Queries** (`src/lib/sanity/queries.ts`)

- Added `imageWithMetadataFragment` to fetch:
  - LQIP (blur placeholder)
  - Dimensions (width, height, aspectRatio)
  - Color palette
  - URL, alt text, hotspot, crop
- Both `getBlogPosts()` and `getBlogPostBySlug()` now fetch complete image data

### 3. **Sanity Utility Functions** (`src/lib/sanity/utils.ts`)

- `getSanityImageDimensions()` - Extract dimensions from metadata or URL
- `getSanityImageLQIP()` - Get LQIP blur placeholder
- `buildSanityImageUrl()` - Build optimized Sanity CDN URLs
- `getSanityImageProps()` - Get all props needed for `BlurImage` component

### 4. **SanityImage Component** (`src/components/elements/sanity-image.tsx`)

- Convenient wrapper around `BlurImage`
- Automatically extracts LQIP and dimensions
- Builds optimized Sanity CDN URLs
- Exported from `@/components/elements`

## Usage Examples

### Basic Usage

```tsx
import { SanityImage } from "@/components/elements";

<SanityImage
  image={post.mainImage}
  width={800}
  quality={85}
  className="rounded-lg"
/>;
```

### Blog Post Card

```tsx
import { SanityImage } from "@/components/elements";

export function BlogCard({ post }) {
  return (
    <article>
      {post.mainImage && (
        <SanityImage
          image={post.mainImage}
          width={600}
          quality={80}
          className="aspect-video"
        />
      )}
      <h2>{post.title}</h2>
    </article>
  );
}
```

### Author Avatar

```tsx
{
  post.author?.image && (
    <SanityImage
      image={post.author.image}
      width={48}
      height={48}
      quality={90}
      className="rounded-full"
    />
  );
}
```

### Full-width Hero Image

```tsx
<SanityImage
  image={post.mainImage}
  width={1920}
  height={1080}
  quality={90}
  className="w-full"
/>
```

### Using BlurImage Directly

If you need more control, use `getSanityImageProps()`:

```tsx
import { BlurImage } from "@/components/elements";
import { getSanityImageProps } from "@/lib/sanity/utils";

const imageProps = getSanityImageProps(post.mainImage, {
  width: 800,
  quality: 85,
});

<BlurImage {...imageProps} className="custom-class" />;
```

## How It Works

1. **Sanity Studio**: When images are uploaded to Sanity, LQIP is automatically generated
2. **GROQ Query**: Fetches image with metadata including LQIP
3. **SanityImage Component**: Extracts LQIP and passes to BlurImage
4. **BlurImage Component**:
   - Shows blurred LQIP initially (scaled 110%, blurred)
   - Loads full-quality image in background
   - Fades to full image when loaded (700ms transition)

## Image Data Structure

```typescript
{
  asset: {
    _ref: "image-abc123...",
    _type: "reference",
    url: "https://cdn.sanity.io/images/...",
    metadata: {
      lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFB...",
      dimensions: {
        width: 1920,
        height: 1080,
        aspectRatio: 1.777777
      },
      palette: {
        dominant: {
          background: "#4a5568",
          foreground: "#ffffff"
        }
      }
    }
  },
  alt: "Image description",
  hotspot: { x: 0.5, y: 0.5 },
  crop: { top: 0, bottom: 0, left: 0, right: 0 }
}
```

## Props Reference

### SanityImage Props

| Prop        | Type                      | Required | Default         | Description             |
| ----------- | ------------------------- | -------- | --------------- | ----------------------- |
| `image`     | `SanityImageWithMetadata` | Yes      | -               | Sanity image object     |
| `width`     | `number`                  | No       | Original width  | Target width in pixels  |
| `height`    | `number`                  | No       | Original height | Target height in pixels |
| `quality`   | `number`                  | No       | 75              | Image quality (1-100)   |
| `className` | `string`                  | No       | -               | Additional CSS classes  |

### BlurImage Props

| Prop        | Type     | Required | Description            |
| ----------- | -------- | -------- | ---------------------- |
| `lqip`      | `string` | Yes      | Base64 LQIP data URL   |
| `src`       | `string` | Yes      | Full image URL         |
| `alt`       | `string` | Yes      | Alt text               |
| `width`     | `number` | Yes      | Image width            |
| `height`    | `number` | Yes      | Image height           |
| `className` | `string` | No       | Additional CSS classes |

## Performance Benefits

- **Faster perceived load time**: LQIP shows immediately
- **Smooth transitions**: 700ms fade from blur to sharp
- **Optimized delivery**: Sanity CDN handles resizing/optimization
- **Auto format**: WebP/AVIF for supported browsers
- **Responsive**: Proper sizing prevents layout shift

## Sanity Studio Configuration

Make sure your Sanity image fields have metadata enabled:

```typescript
// In your Sanity schema
{
  name: 'mainImage',
  type: 'image',
  options: {
    hotspot: true, // Enable focal point selection
    metadata: ['lqip', 'palette', 'dimensions'] // Enable metadata
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
    }
  ]
}
```

## References

- [Sanity Image Metadata API](https://www.sanity.io/docs/apis-and-sdks/image-metadata)
- [Sanity Image Type](https://www.sanity.io/docs/studio/image-type)
- [Sanity Image URLs](https://www.sanity.io/docs/image-url)
