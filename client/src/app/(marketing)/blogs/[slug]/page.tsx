import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";
import { format } from "date-fns";
import { notFound } from "next/navigation";

// Fetch data on the server
async function getBlog(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      },
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch blog");
    }

    const data = await res.json();
    return data.blogPost;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Post Not Found | NXT Agency",
    };
  }

  return {
    title: `${blog.title} | NXT Agency Insights`,
    description: blog.excerpt || `Read ${blog.title} on NXT Agency Insights`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage?.url ? [blog.coverImage.url] : [],
    },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound(); // Triggers the nearest not-found.tsx or default 404 page
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 md:pt-40 pb-24 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <article className="w-full max-w-5xl mx-auto px-4 md:px-8 lg:px-0 relative z-10">
          {/* Back button */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Insights</span>
          </Link>

          {/* Hero Section */}
          <header className="mb-12 md:mb-16">
            <div className="flex flex-wrap gap-3 mb-8">
              {blog.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-1.5 rounded-full text-sm font-medium bg-sidebar/50 border border-border/50 text-foreground backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {blog.publishedAt && (
                <span className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground">
                  {format(new Date(blog.publishedAt), "MMMM d, yyyy")}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-fraunces font-semibold leading-tight tracking-tight mb-8 text-foreground">
              {blog.title}
            </h1>
          </header>

          {/* Cover Image */}
          {blog.coverImage?.url && (
            <div className="w-full aspect-[16/9] md:aspect-[21/9] relative rounded-3xl overflow-hidden mb-16 md:mb-24 border border-border/20 shadow-2xl bg-sidebar/50">
              <Image
                src={blog.coverImage.url}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Body Content */}
          <div
            className="
              w-full max-w-5xl mx-auto
              [&>p]:text-lg md:[&>p]:text-xl [&>p]:leading-relaxed [&>p]:mb-8 [&>p]:text-muted-foreground
              [&>h2]:text-3xl md:[&>h2]:text-4xl [&>h2]:font-fraunces [&>h2]:font-semibold [&>h2]:mt-16 [&>h2]:mb-8 [&>h2]:text-foreground
              [&>h3]:text-2xl md:[&>h3]:text-3xl [&>h3]:font-semibold [&>h3]:mt-12 [&>h3]:mb-6 [&>h3]:text-foreground
              [&>h4]:text-xl md:[&>h4]:text-2xl [&>h4]:font-semibold [&>h4]:mt-8 [&>h4]:mb-4 [&>h4]:text-foreground
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:text-lg md:[&>ul>li]:text-xl [&>ul>li]:text-muted-foreground [&>ul>li]:mb-3
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol>li]:text-lg md:[&>ol>li]:text-xl [&>ol>li]:text-muted-foreground [&>ol>li]:mb-3
              [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-6 md:[&>blockquote]:pl-8 [&>blockquote]:italic [&>blockquote]:my-10 [&>blockquote]:text-xl md:[&>blockquote]:text-2xl [&>blockquote]:font-fraunces [&>blockquote]:text-foreground
              [&>a]:text-primary [&>a]:hover:underline [&>a]:transition-all
              [&>img]:w-full [&>img]:rounded-2xl [&>img]:my-12 [&>img]:border [&>img]:border-border/50
              [&>pre]:bg-sidebar/80 [&>pre]:p-6 [&>pre]:rounded-2xl [&>pre]:overflow-x-auto [&>pre]:my-8 [&>pre]:border [&>pre]:border-border/50
              [&>code]:text-primary [&>code]:bg-primary/10 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md
            "
            dangerouslySetInnerHTML={{
              __html: blog.body.replace(/&nbsp;/g, " "),
            }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
