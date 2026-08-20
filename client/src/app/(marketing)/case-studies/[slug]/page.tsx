import { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyClient from "./CaseStudyClient";

// Fetch data on the server
async function getCaseStudy(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/casestudies/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch case study");
    }
    
    const data = await res.json();
    return data.caseStudy;
  } catch (error) {
    console.error("Error fetching case study:", error);
    return null;
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  
  if (!study) {
    return {
      title: "Case Study Not Found | NXT Agency",
    };
  }

  const coverImageUrl = study.coverImage && study.coverImage.length > 0
      ? study.coverImage[0].url
      : undefined;

  return {
    title: `${study.title} | NXT Agency Work`,
    description: study.description || `Read about our work on ${study.title}`,
    openGraph: {
      title: `${study.title} | NXT Agency`,
      description: study.description,
      images: coverImageUrl ? [coverImageUrl] : [],
    },
  };
}

export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);

  if (!study) {
    notFound(); // Triggers the nearest not-found.tsx or default 404 page
  }

  return <CaseStudyClient study={study} />;
}
