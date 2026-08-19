"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { useGetPublishedBlogs } from "@/hooks/useBlogs";

export default function BlogSection() {
  const { data: blogs = [], isLoading } = useGetPublishedBlogs();
  const scrollRef = useRef<HTMLDivElement>(null);

  const publishedBlogs = blogs;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400; // approximate card width + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="blog"
      className="w-full py-24 md:py-32 bg-sidebar relative overflow-hidden pl-4 md:pl-16 lg:pl-32 border-t border-border/50"
    >
      <div className="flex flex-col xl:flex-row gap-12 xl:gap-20">
        {/* Left Column */}
        <div className="flex flex-col justify-between shrink-0 xl:w-[400px] pr-4 xl:pr-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
              <span className="text-sm font-medium tracking-wide">Blog</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-fraunces font-medium leading-tight mb-8">
              The latest
              <br />
              from our
              <br />
              design studio
            </h2>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity w-max"
            >
              View the blog
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden xl:flex gap-4 mt-20">
            <button
              onClick={() => scroll("left")}
              className="p-4 rounded-full bg-sidebar border border-border hover:bg-muted transition-colors flex items-center justify-center group"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-4 rounded-full bg-sidebar border border-border hover:bg-muted transition-colors flex items-center justify-center group"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
        </div>

        {/* Right Column: Carousel */}
        <div className="w-full overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pr-4 md:pr-16 lg:pr-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {isLoading ? (
              // Loading skeletons
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[300px] md:min-w-[400px] shrink-0 snap-start animate-pulse"
                >
                  <div className="w-full aspect-[4/3] bg-sidebar rounded-2xl mb-6 border border-border" />
                  <div className="w-24 h-4 bg-sidebar rounded mb-4" />
                  <div className="w-full h-8 bg-sidebar rounded mb-3" />
                  <div className="w-2/3 h-8 bg-sidebar rounded mb-4" />
                  <div className="w-full h-4 bg-sidebar rounded mb-2" />
                  <div className="w-4/5 h-4 bg-sidebar rounded" />
                </div>
              ))
            ) : publishedBlogs.length > 0 ? (
              publishedBlogs.map((blog: any) => (
                <Link
                  href={`/blogs/${blog.slug || blog._id}`}
                  key={blog._id}
                  className="min-w-[300px] md:min-w-[400px] max-w-[400px] shrink-0 snap-start group"
                >
                  <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 border border-border bg-sidebar/50">
                    {blog.coverImage?.url &&
                    typeof blog.coverImage.url === "string" &&
                    blog.coverImage.url.trim() !== "" ? (
                      <Image
                        src={blog.coverImage.url.trim()}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-700">
                        NXT
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                    <span>{blog.readTime || "5"} min read</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {blog.excerpt || "Read more about this topic on our blog."}
                  </p>
                </Link>
              ))
            ) : (
              <div className="min-w-[300px] text-muted-foreground py-20">
                No articles published yet.
              </div>
            )}
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex xl:hidden gap-4 mt-2 px-4">
            <button
              onClick={() => scroll("left")}
              className="p-3 rounded-full bg-sidebar border border-border hover:bg-muted transition-colors flex items-center justify-center group"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 rounded-full bg-sidebar border border-border hover:bg-muted transition-colors flex items-center justify-center group"
            >
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
