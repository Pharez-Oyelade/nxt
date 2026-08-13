"use client";

import { use, useEffect } from "react";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import { useGetCaseStudy } from "@/hooks/useCaseStudies";
import { Loader2 } from "lucide-react";

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: caseStudy, isLoading, error } = useGetCaseStudy(id);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full min-h-[500px]">
        <div className="flex flex-col items-center space-y-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading case study...</p>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="flex-1 p-8 text-center text-destructive">
        Failed to load case study.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Edit Case Study</h2>
      </div>
      <CaseStudyForm mode="edit" initialData={caseStudy} />
    </div>
  );
}
