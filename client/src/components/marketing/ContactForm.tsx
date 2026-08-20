"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useCreateLead } from "@/hooks/useLeads";

export default function ContactForm() {
  const { mutateAsync, isPending } = useCreateLead();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("project") as string,
    };

    try {
      await mutateAsync(data);
      setIsSuccess(true);
    } catch (error) {
      // Error toast is handled in the hook
    }
  };

  return (
    <section
      id="contact"
      className="w-full py-24 md:py-32 px-4 flex justify-center bg-sidebar relative overflow-hidden"
    >
      {/* Decorative background element */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" /> */}

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        {/* Left: Copy */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-fraunces font-medium leading-tight mb-6">
            Ready to build <br /> the next thing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
            Drop us a line. We'll get back to you within 24 hours to discuss how
            we can help you scale.
          </p>

          {/* <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Taking on new projects for Q4
          </div> */}
        </div>

        {/* Right: Form */}
        <div className="bg-sidebar/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-border shadow-2xl">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-primary mb-6" />
              <h3 className="text-2xl font-semibold mb-2">Message Received</h3>
              <p className="text-muted-foreground">
                We'll be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground/80 pl-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground/80 pl-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-foreground/80 pl-1">Company <span className="text-muted-foreground/60 font-normal">(Optional)</span></label>
                <input 
                  id="company"
                  name="company"
                  type="text" 
                  placeholder="Acme Inc."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="project"
                  className="text-sm font-medium text-foreground/80 pl-1"
                >
                  Project Details
                </label>
                <textarea
                  id="project"
                  name="project"
                  required
                  rows={4}
                  placeholder="Tell us about what you're building..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-muted-foreground/50"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-medium rounded-xl px-6 py-4 mt-2 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="animate-pulse">Sending...</span>
                ) : (
                  <>
                    Let's Build
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
