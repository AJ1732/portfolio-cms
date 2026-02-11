interface SanityAsset {
  _ref: string;
  _type: "reference";
}

interface SanityImageMetadata {
  lqip?: string;
  palette?: {
    dominant?: {
      background?: string;
      foreground?: string;
    };
  };
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

interface SanityImageWithMetadata {
  asset: SanityAsset & {
    url?: string;
    metadata?: SanityImageMetadata;
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// File/Video types
interface SanityFileMetadata {
  mimeType?: string;
  size?: number;
  originalFilename?: string;
  extension?: string;
}

interface SanityFileWithMetadata {
  _type: "file";
  asset: SanityAsset & {
    url?: string;
    metadata?: SanityFileMetadata;
  };
}
