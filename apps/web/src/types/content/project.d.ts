interface Project {
  title: string;
  slug: string;
  description: string;
  favicon: SanityImageWithMetadata;
  demo: {
    src: SanityFileWithMetadata;
    thumbnail: SanityImageWithMetadata;
  };
  stacks: Stack[];
  links: { demo: string; github: string };
}
