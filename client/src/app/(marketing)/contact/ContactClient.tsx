"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateLead } from "@/hooks/useLeads";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: createLead, isPending } = useCreateLead();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createLead(data, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background flex flex-col">
      <div className="container mx-auto px-6 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-7xl mx-auto w-full">
          {/* Left Column: Context */}
          <div className="flex flex-col pt-10">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-fraunces font-bold tracking-tight mb-8">
              Let&apos;s talk.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-lg">
              Whether you have a clear vision or just a rough idea, we&apos;re
              here to help you turn it into a high-performing digital product.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/80 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Email us
                  </p>
                  <a
                    href="mailto:hello@nxt.agency"
                    className="text-lg font-bold hover:text-primary transition-colors"
                  >
                    pharezoyelade@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-secondary/20 border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl font-fraunces font-bold mb-4">
                  Request Received
                </h3>
                <p className="text-muted-foreground text-lg mb-10 max-w-md">
                  Thank you for reaching out. We&apos;ll review your inquiry and
                  get back to you within 24 hours.
                </p>
                <Link
                  href="/"
                  className="px-8 py-4 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 relative z-10 animate-in fade-in duration-500"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground/80 pl-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    {...register("name")}
                    placeholder="John Doe"
                    className="w-full px-6 py-4 rounded-2xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm pl-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground/80 pl-1"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm pl-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="company"
                    className="text-sm font-semibold text-foreground/80 pl-1"
                  >
                    Company (Optional)
                  </label>
                  <input
                    id="company"
                    {...register("company")}
                    placeholder="Your Company Name"
                    className="w-full px-6 py-4 rounded-2xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-foreground/80 pl-1"
                  >
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    placeholder="Tell us a bit about what you're trying to build..."
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm pl-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-4 group w-full inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-xl"
                >
                  {isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Inquiry
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Decorative gradient for form container */}
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </div>
    </main>
  );
}
