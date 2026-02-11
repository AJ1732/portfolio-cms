import { ContactMenu } from "@/components/elements";
import { ClipUpText, ScreenFitText } from "@/components/ui";
import { ContactForm } from "@/sections/contact-page/components";

export default function ContactPage() {
  return (
    <div className="content-grid relative min-h-dvh space-y-10 py-20">
      <ScreenFitText className="opacity-30">
        <ClipUpText>HEY THERE!</ClipUpText>
      </ScreenFitText>
      <ContactForm />
      <ContactMenu className="mt-8 flex flex-wrap justify-between gap-4" />
    </div>
  );
}
