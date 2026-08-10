"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Contact form:", data);
    setSent(true);
    toast.success("Message sent! We'll reply within 24 hours.");
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <p className="text-lg font-semibold text-neutral-900">Message Sent!</p>
          <p className="text-sm text-neutral-500 mt-1">
            We&apos;ll get back to you within 24 hours.
          </p>
        </div>
        <button onClick={() => setSent(false)} className="text-sm text-amber-600 hover:text-amber-700">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Your Name" placeholder="Muhammad Ali" error={errors.name?.message} {...register("name")} />
        <Input label="Email Address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
      </div>
      <Input label="Subject" placeholder="How can we help?" error={errors.subject?.message} {...register("subject")} />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-neutral-700">Message</label>
        <textarea
          rows={5}
          placeholder="Describe your issue or question in detail..."
          className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
}
