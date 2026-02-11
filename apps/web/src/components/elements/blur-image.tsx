"use client";
import Image from "next/image";
import { memo, useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface BlurImageProps {
  lqip: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export const BlurImage = memo(function BlurImage({
  lqip,
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const cachedRef = useRef(false);

  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) {
      cachedRef.current = true;
      setLoaded(true);
    }
  }, []);

  const animate = !cachedRef.current;

  return (
    <figure className={cn("relative w-full overflow-hidden", className)}>
      {lqip ? (
        <Image
          src={lqip}
          width={width}
          height={height}
          alt={alt}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 size-full scale-110 object-cover blur-lg",
            animate && "transition-opacity duration-700 ease-out",
            loaded ? "opacity-0" : "opacity-100",
          )}
        />
      ) : null}
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "relative size-full object-cover",
          animate && "transition-opacity duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </figure>
  );
});
