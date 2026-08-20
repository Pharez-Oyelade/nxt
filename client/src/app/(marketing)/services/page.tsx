import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { servicesData } from "@/data/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | NXT",
  description: "Strategy, Identity, Design, and Engineering services.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-32 md:mb-40">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-fraunces font-bold tracking-tight mb-8">
            What we do.
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed">
            We partner with founders and teams to build products that combine
            strategy and confidence. Deep identity systems and pixel-perfect
            engineering.
          </p>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="container mx-auto px-6 flex flex-col gap-32 md:gap-48">
        {servicesData.map((service, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={service.slug}
              className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-24 items-center`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2 group">
                <Link
                  href={`/services/${service.slug}`}
                  className="block relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl"
                >
                  <Image
                    src={service.heroImage}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </Link>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2 flex flex-col items-start">
                <h2 className="text-4xl md:text-6xl font-fraunces font-bold mb-4">
                  {service.name}
                </h2>
                <h3 className="text-xl md:text-2xl text-primary font-medium mb-8 leading-snug">
                  {service.subtitle}
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-12 w-full">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-5">
                    Core Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {service.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="px-4 py-2 rounded-full bg-secondary/80 text-foreground text-sm font-medium border border-border/50"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all hover:scale-105"
                >
                  Explore {service.name}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Methodology Teaser */}
      <section className="container mx-auto px-6 mt-40 md:mt-48">
        <div className="bg-secondary/30 rounded-[2.5rem] p-10 md:p-24 border border-border/50 text-center">
          <h2 className="text-4xl md:text-6xl font-fraunces font-bold mb-8">
            Built for impact.
          </h2>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-20 leading-relaxed">
            We don't just deliver assets; we embed with your team to deeply
            understand your market, iterating rapidly until we achieve
            excellence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
                <span className="text-2xl font-fraunces font-bold text-foreground">
                  1
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Discovery</h3>
              <p className="text-muted-foreground text-lg text-center md:text-left leading-relaxed">
                Uncovering the truth about your audience and business goals to
                set a solid foundation.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
                <span className="text-2xl font-fraunces font-bold text-foreground">
                  2
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Strategy</h3>
              <p className="text-muted-foreground text-lg text-center md:text-left leading-relaxed">
                Mapping out the exact steps, visual language, and positioning
                needed to win in your market.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
                <span className="text-2xl font-fraunces font-bold text-foreground">
                  3
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Execution</h3>
              <p className="text-muted-foreground text-lg text-center md:text-left leading-relaxed">
                Building high-performance design and engineering solutions that
                scale seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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
