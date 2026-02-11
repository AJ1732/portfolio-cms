"use client";
import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button, InputField, TextareaField } from "@/components/ui";
import { ENV } from "@/lib/env";

const contactSchema = z.object({
  subject: z.string().min(1, "What's the title of this chapter"),
  name: z.string().min(1, "You've got to have a Name"),
  email: z.email("But I need an email to reach out to you"),
  message: z
    .string()
    .min(10, "I want to hear (actually read) what you have to say (write)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: "",
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const result = await emailjs.send(
        ENV.SERVICE_ID,
        ENV.TEMPLATE_ID,
        data,
        ENV.PUBLIC_KEY,
      );
      // console.log(result);
      if (result.status === 200) {
        toast(
          <h3 className="text-base-expand font-neue-einstellung mt-2 rounded-2xl bg-orange-50/80 p-2">
            Thank you soooooooooo much for reaching out!
            <br />
            See you soon {":)"}
          </h3>,
        );
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        <p className="text-sm-expand md:text-base-expand font-neue-einstellung rounded-2xl bg-red-500 p-2 text-white">
          Something went wrong
          <br />
          Couldn&apos;t get your message, Try again
        </p>,
      );
    }
  };

  return (
    <section className="space-y-12 max-md:row-start-2 md:-mt-10 md:space-y-8">
      <h2 className="text-4xl-expand md:text-5xl-expand lg:text-6xl-expand">
        Contact me
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid w-full gap-x-4 gap-y-10 lg:grid-cols-[auto_1fr_auto]"
      >
        <InputField
          label="Subject"
          placeholderLabel="What's the topic?"
          {...register("subject")}
          error={errors.subject?.message}
        />
        <div className="flex gap-9 max-md:flex-wrap md:gap-4 lg:col-start-1">
          <InputField
            label="Name"
            placeholderLabel="Hmmm, Who are you?"
            {...register("name")}
            error={errors.name?.message}
            className="max-w-72"
          />
          <InputField
            label="Email"
            placeholderLabel="How can I find you?"
            {...register("email")}
            error={errors.email?.message}
            className="max-w-80 min-w-72"
          />
        </div>
        <TextareaField
          label="Message"
          placeholderLabel="What do you want to say? Lemme guess... I've got nothing, help me out :)"
          {...register("message")}
          error={errors.message?.message}
          className="lg:col-start-3 lg:row-start-1"
        />
        <Button type="submit" disabled={isSubmitting} className="w-fit">
          Send{isSubmitting && "ing"}
        </Button>
      </form>
    </section>
  );
}
