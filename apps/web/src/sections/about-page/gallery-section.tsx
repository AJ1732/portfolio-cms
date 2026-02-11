"use client";

import { BlurImage, HorizontalScrollWithLenis } from "@/components/elements";
import { buildSanityImageUrl, getCroppedAspectRatio } from "@/lib/sanity/image";

type GallerySectionProps = {
  gallery: Gallery[];
};

export default function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <section aria-label="gallery section" className="breakout mb-20 grid gap-4">
      <header>
        <h2 className="section-heading">GALLERY</h2>
      </header>
      <HorizontalScrollWithLenis
        data={gallery}
        renderItem={(item) => (
          <article key={item.title}>
            <h3 className="font-bebas-neue text-xl-expand tracking-wide">
              {item.title}
            </h3>
            <div className="space-y-1">
              {item.images.map((image, index) => {
                const dimensions = image.asset?.metadata?.dimensions;
                const lqip = image.asset?.metadata?.lqip || "";
                const imageUrl = buildSanityImageUrl(image, {
                  width: 400,
                  quality: 80,
                  auto: "format",
                });
                const aspectRatio = getCroppedAspectRatio(image);

                return (
                  <figure
                    key={index}
                    className="max-w-80 break-inside-avoid overflow-hidden bg-neutral-800"
                    style={{ aspectRatio }}
                  >
                    <BlurImage
                      src={imageUrl}
                      lqip={lqip}
                      alt={image.alt || item.title}
                      width={dimensions?.width || 400}
                      height={dimensions?.height || 400}
                      className="no-copy size-full object-cover"
                    />
                  </figure>
                );
              })}
            </div>
          </article>
        )}
        className="gallery-scroll"
        gap="gap-1"
        ariaLabel="gallery"
        lenisOptions={{
          duration: 1.5,
          wheelMultiplier: 0.8,
        }}
      />
    </section>
  );
}
