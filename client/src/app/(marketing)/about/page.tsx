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
          <div className="md:sticky md:top-32 mb-8 md:mb-0">
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
                      href="https://x.com/Pharez_Oye"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 fill-primary transition-colors"
                      >
                        <title>X</title>
                        <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
                      </svg>
                    </Link>
                    <Link
                      href="https://www.linkedin.com/in/pharez-oyelade-b90263312"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        className="w-5 h-5 fill-primary transition-colors"
                      >
                        <path
                          d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </Link>
                    <Link
                      href="https://github.com/Pharez-Oyelade"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 fill-primary transition-colors"
                      >
                        <title>GitHub</title>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
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
