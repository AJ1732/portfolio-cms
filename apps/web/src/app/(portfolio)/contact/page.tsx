import type { Metadata } from "next";
import Script from "next/script";

import { ContactMenu } from "@/components/elements";
import { ClipUpText, ScreenFitText } from "@/components/ui";
import { ContactForm } from "@/sections/contact-page/components";

export const metadata: Metadata = {
  title:
    "Contact | Ejemen Iboi — Pixel Perfect Engineer · Frontend · TypeScript · React / Next.js",
  description:
    "Get in touch with Ejemen Iboi — open to frontend engineering roles, collaborations, and freelance projects.",
  openGraph: {
    title: "Contact — Ejemen Iboi",
    description:
      "Reach out to Ejemen Iboi for frontend engineering roles, collaborations, or freelance projects.",
    url: "https://ejemeniboi.com/contact",
    images: [
      {
        url: "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/containers/39o30nGwWVI9Iw7o0YrrSeKtIyA/aj1732-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Ejemen Iboi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Ejemen Iboi",
    description:
      "Reach out to Ejemen Iboi for frontend engineering roles, collaborations, or freelance projects.",
    images: [
      "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/containers/39o30nGwWVI9Iw7o0YrrSeKtIyA/aj1732-contact.jpg",
    ],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="content-grid relative min-h-dvh space-y-10 py-20">
      {/* JSON-LD for ContactPage */}
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Ejemen Iboi",
            url: "https://ejemeniboi.com/contact",
            description:
              "Get in touch with Ejemen Iboi for frontend engineering roles, collaborations, or freelance projects.",
            mainEntity: {
              "@type": "Person",
              name: "Ejemen Iboi",
              email: "mailto:ejemeniboi@gmail.com",
              url: "https://ejemeniboi.com",
            },
          }),
        }}
      />

      <ScreenFitText className="opacity-30">
        <ClipUpText>HEY THERE!</ClipUpText>
      </ScreenFitText>
      <ContactForm />
      <ContactMenu className="mt-8 flex flex-wrap justify-between gap-4" />
    </div>
  );
}
