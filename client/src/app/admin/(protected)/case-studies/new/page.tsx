import { CaseStudyForm } from "@/components/admin/case-study-form";

export default function NewCaseStudyPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          New Case Study
        </h2>
      </div>
      <CaseStudyForm mode="create" />
    </div>
  );
}
