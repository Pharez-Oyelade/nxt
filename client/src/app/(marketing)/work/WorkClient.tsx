"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useGetCaseStudies } from "@/hooks/useCaseStudies";

export default function WorkClient() {
  // fetch all published case studies (selected=undefined, limit=undefined, status="published")
  const { data: caseStudies, isLoading } = useGetCaseStudies(undefined, undefined, "published");

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24 md:mb-32">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-fraunces font-bold tracking-tight mb-8">
            Our Work.
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed">
            A collection of projects where we&apos;ve turned complex problems into elegant, high-performing digital experiences.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container mx-auto px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex flex-col gap-6">
                <div className="w-full aspect-[4/3] bg-secondary/50 rounded-[2rem]" />
                <div className="space-y-3">
                  <div className="h-8 bg-secondary/50 rounded-full w-2/3" />
                  <div className="h-4 bg-secondary/50 rounded-full w-full" />
                  <div className="h-4 bg-secondary/50 rounded-full w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : caseStudies && caseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {caseStudies.map((work: any) => (
              <Link 
                href={`/case-studies/${work.slug}`} 
                key={work._id}
                className="group flex flex-col gap-6"
              >
                <div className="w-full aspect-[4/3] relative rounded-[2rem] overflow-hidden bg-secondary shadow-lg">
                  {work.coverImage && Array.isArray(work.coverImage) && work.coverImage.length > 0 && work.coverImage[0].url ? (
                    <Image
                      src={work.coverImage[0].url}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Floating Action Button */}
                  <div className="absolute top-6 right-6 w-12 h-12 bg-background/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                    <ArrowUpRight className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <h2 className="text-3xl font-fraunces font-bold group-hover:text-primary transition-colors">
                    {work.title}
                  </h2>
                  <p className="text-lg text-muted-foreground line-clamp-2">
                    {work.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-secondary/20 rounded-[2rem] border border-border/50">
            <h3 className="text-2xl font-bold mb-4">No case studies yet</h3>
            <p className="text-muted-foreground mb-8">Check back later for our latest work.</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all"
            >
              Return Home
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 mt-40 mb-10">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-7xl font-fraunces font-bold mb-10">Have a project?</h2>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-10 py-5 rounded-full bg-accent text-accent-foreground font-medium text-lg hover:bg-accent/90 transition-all hover:scale-105 shadow-xl"
          >
            Let&apos;s talk about it
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}
