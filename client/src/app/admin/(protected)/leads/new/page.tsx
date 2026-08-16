import React from "react";
import { LeadForm } from "@/components/admin/leads/lead-form";

export default function NewLeadPage() {
  return (
    <div className="flex-1 p-4 md:p-8 pt-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">
          Add New Lead
        </h2>
        <p className="text-sm text-muted-foreground">
          Manually enter a new lead into the pipeline CRM.
        </p>
      </div>

      <LeadForm />
    </div>
  );
}
