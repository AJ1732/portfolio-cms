import "./globals.css";

import type { Metadata } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

import { bebasNeue, neueEinstellung } from "@/assets/font/next-font";
import { Footer, Navigation } from "@/components/layout";
import { getContacts } from "@/lib/sanity/getters";
import { Provider } from "@/provider";

export const metadata: Metadata = {
  title:
    "Ejemen Iboi — Pixel Perfect Engineer · Frontend · TypeScript · Pixel-Perfect UI · Design · React / Next.js",
  description:
    "Software Engineer building pixel-perfect, accessible and high-performance UIs. Open to SWE roles. View projects, case studies, and contact info.",
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    title: "Ejemen Iboi - Pixel Perfect Engineer · Frontend Portfolio",
    type: "website",
    url: "https://ejemeniboi.com/",
    description:
      "Software Engineer building pixel-perfect, accessible and high-performance UIs. Open to SWE roles. View projects, case studies, and contact info.",
    images: [
      {
        url: "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/ef11f328d022ba5f53dc3708443553500bae7c7f-4800x2520.png",
        width: 1200,
        height: 630,
        alt: "Ejemen Iboi Pixel Perfect Engineer · Frontend Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ejemen Iboi - Pixel Perfect Engineer · Frontend Portfolio",
    description:
      "Software Engineer building pixel-perfect, accessible and high-performance UIs. Open to SWE roles. View projects, case studies, and contact info.",
    images: [
      "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/ef11f328d022ba5f53dc3708443553500bae7c7f-4800x2520.png",
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contacts = await getContacts();

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${neueEinstellung.variable}`}
    >
      <body className={`font-neue-einstellung font-light antialiased`}>
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ejemen Iboi",
              url: "https://ejemeniboi.com",
              image:
                "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/09c49bf0c8cde8cb3b87cac0b5ac62b9271c4a32-969x1280.jpg",
              sameAs: [
                "https://github.com/AJ1732",
                "https://www.linkedin.com/in/osezeleiboi",
              ],
              jobTitle: "Software Engineer",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "professional",
                  email: "mailto:ejemeniboi@gmail.com",
                },
              ],
              knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Sass/Scss",
                "Accessibility",
                "US Design",
                "Problem Solving",
                "Pixel perfect UI",
              ],
            }),
          }}
        />
        <NextTopLoader color="#262626" />
        <Provider {...{ contacts }}>
          <Navigation />
          <main className="min-h-[calc(100dvh-4rem)] border-b">{children}</main>
          <Footer />
        </Provider>
        <Toaster
          closeButton
          position="top-center"
          icons={{
            info: <div className="size-2 rounded-full bg-orange-500"></div>,
            success: <div className="size-2 rounded-full bg-emerald-500"></div>,
            error: <div className="size-2 rounded-full bg-red-500"></div>,
            warning: <div className="size-2 rounded-full bg-amber-500"></div>,
            loading: (
              <div className="ml-2 size-2 animate-pulse rounded-full bg-orange-500 duration-75"></div>
            ),
          }}
          toastOptions={{
            style: {
              borderRadius: "1.5rem",
              padding: "0.5rem",
              gap: "0.125rem",
              alignItems: "flex-start",
            },
            classNames: {
              icon: "justify-end! mt-0.5!",
              content: "w-full",
              description:
                "mt-[0.1rem] -ml-3.25 flex-1 rounded-2xl bg-orange-50/80 font-neue-einstellung py-2 px-2.5 text-base font-light",
            },
          }}
        />
      </body>
    </html>
  );
}
