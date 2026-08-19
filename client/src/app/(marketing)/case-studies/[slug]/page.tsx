"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useGetCaseStudy } from "@/hooks/useCaseStudies";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export default function CaseStudyDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: study, isLoading } = useGetCaseStudy(slug);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (isLoading || !study) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px" } // Triggers when element crosses the top 40% of the screen
    );

    const sections = document.querySelectorAll(".scroll-section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [study, isLoading]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-24 px-4 md:px-10 max-w-7xl mx-auto flex flex-col gap-10 animate-pulse">
          <div className="w-2/3 h-20 bg-sidebar/50 rounded-2xl"></div>
          <div className="w-1/2 h-10 bg-sidebar/50 rounded-2xl"></div>
          <div className="w-full aspect-[21/9] bg-sidebar/50 rounded-3xl mt-10"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!study) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl font-fraunces font-bold">
            Case Study Not Found
          </h1>
          <Link
            href="/#work"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Work
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const coverImageUrl =
    study.coverImage && study.coverImage.length > 0
      ? study.coverImage[0].url
      : null;
  const headingBlocks =
    study.contentBlocks?.filter((block: any) => block.type === "heading") || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-30 md:pt-35 pb-24 relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-10 z-10 relative">
          {/* Back button */}
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Work</span>
          </Link>

          {/* Hero Section */}
          <div className="mb-16 md:mb-24 max-w-5xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-fraunces font-semibold leading-tight tracking-tight mb-8">
              {study.title}
            </h1>
            {study.description && (
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed max-w-4xl">
                {study.description}
              </p>
            )}
          </div>

          {/* Cover Image */}
          {coverImageUrl && (
            <div className="w-full aspect-[16/9] md:aspect-[21/9] relative rounded-3xl overflow-hidden mb-20 md:mb-32 border border-border/20 shadow-2xl">
              <Image
                src={coverImageUrl}
                alt={study.title}
                fill
                className="object-cover hover:scale-110 transition-all duration-700"
                priority
              />
            </div>
          )}

          {/* Two-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
            {/* Left: Sticky Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32">
                <div className="relative mb-10">
                  <h4 className="pl-4 font-bold text-lg tracking-wider text-muted-foreground uppercase">
                    Contents
                  </h4>
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-0.5 h-6 bg-primary"></div>
                </div>

                <nav className="flex flex-col gap-6">
                  {headingBlocks.map((block: any, idx: number) => {
                    // Create an ID from the heading content
                    const blockId = block.content
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    return (
                      <a
                        key={idx}
                        href={`#${blockId}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(blockId)?.scrollIntoView({ behavior: "smooth" });
                          setActiveId(blockId);
                        }}
                        className={`text-base transition-all duration-300 border-l-2 pl-4 py-1 ${
                          activeId === blockId
                            ? "text-primary border-primary font-medium"
                            : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                        }`}
                      >
                        {block.content}
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Right: Content Blocks */}
            <article className="flex-1 space-y-12 md:space-y-20 max-w-3xl">
              {study.contentBlocks?.map((block: any, idx: number) => {
                switch (block.type) {
                  case "heading":
                    const blockId = block.content
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "");
                    return (
                      <div
                        key={idx}
                        id={blockId}
                        className="scroll-section relative pt-10 mt-10 first:mt-0 first:pt-0"
                      >
                        <div className="absolute top-0 left-0 w-8 h-1 bg-primary/20"></div>
                        <h2 className="text-3xl md:text-4xl font-fraunces font-semibold text-foreground">
                          {block.content}
                        </h2>
                      </div>
                    );
                  case "text":
                    return (
                      <div
                        key={idx}
                        className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-loose"
                      >
                        <p>{block.content}</p>
                      </div>
                    );
                  case "image":
                    return (
                      <div
                        key={idx}
                        className="w-full relative rounded-2xl overflow-hidden border border-border/20 shadow-lg my-10 bg-sidebar/50"
                      >
                        <img
                          src={block.content}
                          alt="Case study section"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    );
                  case "quote":
                    return (
                      <blockquote
                        key={idx}
                        className="my-12 py-8 pl-8 md:pl-12 border-l-4 border-primary bg-primary/5 rounded-r-2xl relative overflow-hidden"
                      >
                        <p className="text-2xl md:text-3xl font-fraunces italic text-foreground leading-relaxed">
                          "{block.content}"
                        </p>
                      </blockquote>
                    );
                  default:
                    return null;
                }
              })}
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
