"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { servicesData } from "@/data/services";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ServicePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const service = servicesData.find((s) => s.slug === slug);

  const heroImageRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!service) return;

    // Parallax hero image
    if (heroImageRef.current) {
      gsap.to(heroImageRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: heroImageRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Staggered fade in for capabilities
    if (capabilitiesRef.current) {
      const cards =
        capabilitiesRef.current.querySelectorAll(".capability-card");
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: capabilitiesRef.current,
            start: "top 80%",
          },
        },
      );
    }

    // Process steps animation
    if (processRef.current) {
      const steps = processRef.current.querySelectorAll(".process-step");
      gsap.fromTo(
        steps,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: processRef.current,
            start: "top 70%",
          },
        },
      );
    }
  }, [service]);

  if (!service) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-fraunces font-bold">
            Service Not Found
          </h1>
          <Link
            href="/#services"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        {/* Hero Section */}
        <section className="pt-32 md:pt-48 pb-20 px-4 md:px-10 max-w-7xl mx-auto relative z-10">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Services</span>
          </Link>

          <div className="flex flex-col gap-8 md:gap-12">
            <h1 className="text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] font-fraunces font-semibold leading-none tracking-tight break-words">
              {service.name}
            </h1>
            <div className="max-w-3xl">
              <p className="text-2xl md:text-3xl lg:text-4xl text-foreground font-medium leading-tight mb-6">
                {service.subtitle}
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        </section>

        {/* Parallax Image Section */}
        <section className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
          <div
            ref={heroImageRef}
            className="absolute inset-[-20%] w-[140%] h-[140%]"
          >
            <Image
              src={service.heroImage}
              alt={service.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-background/20 dark:bg-background/40 mix-blend-multiply" />
          </div>
        </section>

        {/* Capabilities Section */}
        <section
          className="py-32 md:py-48 px-4 md:px-10 max-w-7xl mx-auto"
          ref={capabilitiesRef}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <h2 className="text-5xl md:text-6xl font-fraunces font-semibold">
              Capabilities
            </h2>
            <div className="w-full md:w-1/2">
              <p className="text-xl text-muted-foreground">
                Our approach to {service.name.toLowerCase()} is comprehensive.
                We bring deep expertise across these core disciplines to ensure
                exceptional results.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.capabilities.map((cap, index) => (
              <div
                key={index}
                className="capability-card group p-8 rounded-3xl bg-sidebar/50 border border-border/50 hover:border-primary/50 hover:bg-sidebar transition-all duration-500 flex flex-col justify-between aspect-square"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-semibold mt-8 group-hover:text-primary transition-colors">
                  {cap}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* The Process Section */}
        <section
          className="py-32 md:py-48 px-4 md:px-10 bg-sidebar/30 relative"
          ref={processRef}
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-fraunces font-semibold mb-24">
              The Process
            </h2>

            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-border/50 -z-10" />

              {service.process.map((step, index) => (
                <div key={index} className="process-step relative group">
                  <div className="text-[120px] md:text-[180px] font-fraunces font-bold text-muted-foreground/10 absolute -top-12 md:-top-24 -left-4 z-0 pointer-events-none group-hover:text-primary/10 transition-colors duration-500">
                    0{index + 1}
                  </div>

                  <div className="relative z-10 pt-16 md:pt-24 pl-8 md:pl-0">
                    <h3 className="text-3xl font-semibold mb-6">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 md:py-48 px-4 md:px-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-fraunces font-semibold mb-8">
            Ready to start your {service.name.toLowerCase()} project?
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            Let's build something exceptional together. Our team is ready to
            dive in.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-medium rounded-2xl px-8 py-5 text-lg transition-all duration-300"
          >
            Get in touch
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
