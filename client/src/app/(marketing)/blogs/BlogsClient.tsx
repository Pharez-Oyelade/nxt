"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGetPublishedBlogs } from "@/hooks/useBlogs";

export default function BlogsClient() {
  const { data: blogs, isLoading } = useGetPublishedBlogs();

  // Sort blogs to ensure newest is first based on publishedAt or createdAt
  const sortedBlogs = blogs ? [...blogs].sort((a: any, b: any) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt).getTime();
    return dateB - dateA;
  }) : [];

  const featuredBlog = sortedBlogs.length > 0 ? sortedBlogs[0] : null;
  const standardBlogs = sortedBlogs.length > 1 ? sortedBlogs.slice(1) : [];

  const extractExcerpt = (body: string, length = 150) => {
    if (!body) return "";
    let plainText = body.replace(/<[^>]+>/g, ""); // Strip HTML tags if any
    plainText = plainText
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    return plainText.length > length ? plainText.substring(0, length) + "..." : plainText;
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-20 md:mb-32">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-fraunces font-bold tracking-tight mb-8">
            Thinking.
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed">
            Our perspectives on design, engineering, and building digital products that actually work.
          </p>
        </div>
      </section>

      {/* Blog Feed */}
      <section className="container mx-auto px-6">
        {isLoading ? (
          <div className="flex flex-col gap-16 md:gap-24">
            {/* Featured Skeleton */}
            <div className="animate-pulse w-full aspect-[21/9] bg-secondary/50 rounded-[2.5rem]" />
            {/* Grid Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex flex-col gap-6">
                  <div className="w-full aspect-[4/3] bg-secondary/50 rounded-[2rem]" />
                  <div className="h-6 bg-secondary/50 rounded-full w-2/3" />
                  <div className="h-4 bg-secondary/50 rounded-full w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : sortedBlogs.length > 0 ? (
          <div className="flex flex-col gap-16 md:gap-24">
            {/* Featured Post */}
            {featuredBlog && (
              <Link 
                href={`/blogs/${featuredBlog.slug}`}
                className="group flex flex-col md:flex-row gap-8 md:gap-16 items-center"
              >
                <div className="w-full md:w-3/5 aspect-video md:aspect-[4/3] lg:aspect-[16/9] relative rounded-[2.5rem] overflow-hidden bg-secondary shadow-2xl">
                  {featuredBlog.coverImage?.url ? (
                    <Image
                      src={featuredBlog.coverImage.url}
                      alt={featuredBlog.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                
                <div className="w-full md:w-2/5 flex flex-col items-start">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredBlog.tags && featuredBlog.tags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="px-4 py-1.5 rounded-full bg-secondary text-foreground text-sm font-medium border border-border/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-fraunces font-bold mb-6 group-hover:text-primary transition-colors leading-tight">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-8 break-words line-clamp-4">
                    {extractExcerpt(featuredBlog.body, 250)}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                    <span>{new Date(featuredBlog.publishedAt || featuredBlog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    <span className="flex items-center gap-1 group-hover:text-foreground transition-colors">
                      Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Standard Grid */}
            {standardBlogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 pt-8 border-t border-border/50">
                {standardBlogs.map((blog: any) => (
                  <Link 
                    href={`/blogs/${blog.slug}`} 
                    key={blog._id}
                    className="group flex flex-col gap-6"
                  >
                    <div className="w-full aspect-[4/3] relative rounded-[2rem] overflow-hidden bg-secondary shadow-lg">
                      {blog.coverImage?.url ? (
                        <Image
                          src={blog.coverImage.url}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/50">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap gap-2">
                        {blog.tags && blog.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-secondary/50 text-foreground text-xs font-medium border border-border/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-fraunces font-bold group-hover:text-primary transition-colors leading-snug">
                        {blog.title}
                      </h3>
                      <p className="text-lg text-muted-foreground line-clamp-2 break-words">
                        {extractExcerpt(blog.body)}
                      </p>
                      
                      <div className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mt-2">
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-32 bg-secondary/20 rounded-[2.5rem] border border-border/50">
            <h3 className="text-3xl font-fraunces font-bold mb-4">No insights yet</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              We're currently writing some great content. Check back soon for updates on our latest thinking.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all shadow-xl"
            >
              Return Home
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 mt-40 mb-10">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-7xl font-fraunces font-bold mb-10">Want to work with us?</h2>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-10 py-5 rounded-full bg-accent text-accent-foreground font-medium text-lg hover:bg-accent/90 transition-all hover:scale-105 shadow-xl"
          >
            Get in touch
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}
