"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Work() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Increased the travel distance for a much more pronounced overlap.
    // It starts closer to its normal position to avoid gaps,
    // and shoots up much higher (-300px) over the previous sections.
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
          scrub: 0.1, // Lowered scrub from 1 to 0.5 to make it react faster to the scroll wheel
        },
      },
    );
  });

  return (
    <section
      ref={containerRef}
      id="work"
      // Added relative and z-10 to ensure it layers above the previous sections
      className="bg-sidebar py-40 rounded-t-3xl relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-fraunces font-semibold mb-10">
          Selected Work
        </h2>
        {/* Placeholder for future project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-background rounded-2xl h-[400px] w-full border border-border" />
          <div className="bg-background rounded-2xl h-[400px] w-full border border-border mt-0 md:mt-20" />
        </div>
      </div>
    </section>
  );
}
