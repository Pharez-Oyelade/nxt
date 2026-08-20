"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { useGetCaseStudies } from "@/hooks/useCaseStudies";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Work() {
  const containerRef = useRef<HTMLElement>(null);
  const { data: caseStudies = [], isLoading } = useGetCaseStudies();

  // Filter for published case studies
  const publishedCaseStudies = caseStudies
    .filter((cs: any) => cs.status === "published" || !cs.status)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { y: 10 },
      {
        y: -200,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 0.1,
        },
      },
    );
  });

  return (
    <section
      ref={containerRef}
      id="work"
      className="bg-sidebar py-32 md:py-40 rounded-t-3xl relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <h2 className="text-5xl md:text-7xl font-fraunces font-semibold mb-16 md:mb-20 tracking-tight">
          Selected Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {isLoading ? (
            // Skeleton loaders
            [...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-6 animate-pulse ${idx % 2 !== 0 ? "md:mt-24" : ""}`}
              >
                <div className="bg-background/50 rounded-3xl h-[400px] md:h-[500px] w-full border border-border/50" />
                <div className="w-2/3 h-8 bg-background/50 rounded-lg" />
                <div className="w-full h-24 bg-background/50 rounded-lg" />
              </div>
            ))
          ) : publishedCaseStudies.length > 0 ? (
            publishedCaseStudies.map((study: any, idx: number) => {
              const imageUrl =
                study.coverImage && study.coverImage.length > 0
                  ? study.coverImage[0].url
                  : "";

              return (
                <Link
                  href={`/case-studies/${study.slug || study._id}`}
                  key={study._id}
                  className={`group flex flex-col gap-6 ${idx % 2 !== 0 ? "md:mt-24" : ""}`}
                >
                  <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-border/20 bg-background/50">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={study.title}
                        fill
                        sizes="1000px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-700 ease-out">
                        NXT
                      </div>
                    )}

                    {/* Hover overlay with button */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="bg-white text-black rounded-full p-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pr-8">
                    <h3 className="text-3xl font-medium font-fraunces group-hover:text-primary transition-colors">
                      {study.title}
                    </h3>
                    {study.description && (
                      <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
                        {study.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-border rounded-3xl">
              No selected works available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
