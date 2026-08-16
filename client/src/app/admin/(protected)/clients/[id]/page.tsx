"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetClient, useUpdateClient } from "@/hooks/useClients";
import { Loader2, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { EditableField } from "@/components/admin/leads/editable-field"; // Reusing this from leads
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { label: "Prospect", value: "prospect" },
  { label: "Active", value: "active" },
  { label: "Past", value: "past" },
];

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const { data: client, isLoading, error } = useGetClient(clientId);
  const updateMutation = useUpdateClient();
  
  const handleFieldSave = async (field: string, value: string) => {
    await updateMutation.mutateAsync({
      id: clientId,
      data: { [field]: value }
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-full text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive font-medium mb-4">Failed to load client details.</p>
        <Button onClick={() => router.push("/admin/clients")} variant="outline">
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-5xl mx-auto space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/clients"
          className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            {client.companyName}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 border-b border-border/40 pb-3">
              Company & Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <EditableField
                label="Company Name"
                field="companyName"
                value={client.companyName}
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Status"
                field="status"
                value={client.status}
                type="select"
                options={STATUS_OPTIONS}
                onSave={handleFieldSave}
              />

              <EditableField
                label="Primary Contact Name"
                field="primaryContactName"
                value={client.primaryContactName || ""}
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Account Email"
                field="email"
                value={client.email}
                type="email"
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Billing Email"
                field="billingEmail"
                value={client.billingEmail || ""}
                type="email"
                onSave={handleFieldSave}
              />

              <EditableField
                label="Industry"
                field="industry"
                value={client.industry || ""}
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Project Type"
                field="projectType"
                value={client.projectType || ""}
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Budget Range"
                field="budgetRange"
                value={client.budgetRange || ""}
                onSave={handleFieldSave}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar / Stats / Notes */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-border/40 pb-3">
              Quick Stats
            </h3>
            
            <div className="space-y-4">
               <div>
                 <p className="text-sm font-medium text-muted-foreground">Joined On</p>
                 <p className="text-base text-foreground font-medium">
                   {new Date(client.createdAt).toLocaleDateString()}
                 </p>
               </div>
            </div>
          </div>
          
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-border/40 pb-3 flex justify-between items-center">
              <span>Internal Notes</span>
            </h3>
            
            <div className="space-y-4">
              {client.notes?.map((note, idx) => (
                <div key={idx} className="bg-muted/30 p-3 rounded-xl border border-border/30 text-sm text-foreground">
                  {note}
                </div>
              ))}
              
              {(!client.notes || client.notes.length === 0) && (
                <p className="text-muted-foreground text-sm italic text-center py-4">
                  No notes recorded.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
