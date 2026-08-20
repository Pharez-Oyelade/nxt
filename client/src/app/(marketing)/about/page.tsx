import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | NXT",
  description: "Who we are and how we build products that work.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-32 md:mb-48">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-fraunces font-bold tracking-tight mb-8">
            Who we are.
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed">
            We are an independent agency that partners with ambitious founders
            to design and engineer digital products that combine deep strategic
            clarity with flawless execution.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-6 mb-32 md:mb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
          <div className="sticky top-32">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-fraunces font-bold mb-6 leading-tight">
              Unglamorous <br className="hidden md:block" /> Confidence.
            </h2>
            <p className="text-lg md:text-xl text-primary font-medium">
              We believe in substance over spectacle.
            </p>
          </div>
          <div className="flex flex-col gap-10">
            <div className="space-y-6">
              <Quote className="text-primary/30 w-10 h-10" />
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Great products aren't built on buzzwords or fleeting trends.
                They are the result of rigorous research, intentional design,
                and rock-solid engineering.
              </p>
            </div>
            <div className="w-16 h-px bg-border" />
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We cut through the noise to focus on what actually matters:
              solving real problems for your users and driving measurable growth
              for your business. We don't just hand off pretty mockups; we embed
              with your team, taking ownership of the entire lifecycle from the
              first wireframe to the final deployment.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              When you work with us, you get a partner who is as invested in
              your product's success as you are. We build the thing, and it
              works.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="container mx-auto px-6 mb-32 md:mb-48">
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-fraunces font-bold mb-6">
            The Team.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            A tight-knit collective of strategists, designers, and engineers
            dedicated to doing the best work of our lives.
          </p>
        </div>

        {/* Team Grid (Currently 1 column for the founder, highly scalable) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 group">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-secondary/30 border border-border/50 shadow-xl flex flex-col md:flex-row items-center p-8 md:p-12 gap-10 md:gap-16">
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />

              {/* Image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 shrink-0 rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
                <Image
                  src="/images/pharez.jpg"
                  alt="Pharez Oyelade"
                  fill
                  className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                />
              </div>

              {/* Bio Content */}
              <div className="flex flex-col relative z-10 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-fraunces font-bold mb-2">
                      Pharez Oyelade
                    </h3>
                    <p className="text-primary font-medium text-lg tracking-wide uppercase">
                      Founder & Technical Director
                    </p>
                  </div>
                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <Link
                      href="#"
                      className="p-3 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                      {/* <Twitter className="w-5 h-5" /> */}
                    </Link>
                    <Link
                      href="#"
                      className="p-3 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                      {/* <Linkedin className="w-5 h-5" /> */}
                    </Link>
                    <Link
                      href="#"
                      className="p-3 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                      {/* <Github className="w-5 h-5" /> */}
                    </Link>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                  With a deep background in full-stack engineering and product
                  design, Pharez founded NXT to bridge the gap between aesthetic
                  vision and technical reality. He leads the agency's strategic
                  direction, ensuring that every product shipped not only looks
                  exceptional but performs flawlessly at scale.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                  His philosophy is simple: build interfaces that feel
                  effortless and architecture that never breaks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 mt-40 mb-10">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-7xl font-fraunces font-bold mb-10">
            Ready to build?
          </h2>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-10 py-5 rounded-full bg-accent text-accent-foreground font-medium text-lg hover:bg-accent/90 transition-all hover:scale-105 shadow-xl"
          >
            Let&apos;s talk about your project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}
