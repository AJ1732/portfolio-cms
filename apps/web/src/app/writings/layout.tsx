import { SanityLive } from "@/lib/sanity/live";

export default function WritingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <SanityLive />
    </>
  );
}
