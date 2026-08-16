"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetLead, useUpdateLead, useConvertLead } from "@/hooks/useLeads";
import { Loader2, ArrowLeft, Send, UserPlus } from "lucide-react";
import Link from "next/link";
import { EditableField } from "@/components/admin/leads/editable-field";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { label: "New Lead", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Lost", value: "lost" },
];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  
  const { data: lead, isLoading, error } = useGetLead(leadId);
  const updateMutation = useUpdateLead();
  const convertMutation = useConvertLead();
  
  const [newMessage, setNewMessage] = useState("");

  const handleFieldSave = async (field: string, value: string) => {
    await updateMutation.mutateAsync({
      id: leadId,
      data: { [field]: value }
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await updateMutation.mutateAsync({
      id: leadId,
      data: { newMessage }
    });
    
    setNewMessage("");
  };

  const handleConvert = async () => {
    if (confirm("Are you sure you want to convert this lead to an active client? This action will archive the lead and create a new Client record.")) {
      await convertMutation.mutateAsync(leadId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-full text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive font-medium mb-4">Failed to load lead details.</p>
        <Button onClick={() => router.push("/admin/leads")} variant="outline">
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-5xl mx-auto space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/leads"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Lead Details
          </h2>
        </div>
        
        <Button 
          onClick={handleConvert}
          disabled={convertMutation.isPending || lead.archived}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md h-10 rounded-xl"
        >
          {convertMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          {lead.archived ? "Converted" : "Convert to Client"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 border-b border-border/40 pb-3">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <EditableField
                label="Full Name"
                field="name"
                value={lead.name}
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Email Address"
                field="email"
                value={lead.email}
                type="email"
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Company"
                field="company"
                value={lead.company || ""}
                onSave={handleFieldSave}
              />

              <EditableField
                label="Pipeline Status"
                field="status"
                value={lead.status}
                type="select"
                options={STATUS_OPTIONS}
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Project Type"
                field="projectType"
                value={lead.projectType || ""}
                onSave={handleFieldSave}
              />
              
              <EditableField
                label="Budget Range"
                field="budgetRange"
                value={lead.budgetRange || ""}
                onSave={handleFieldSave}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Messages / Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col h-[600px]">
            <h3 className="text-lg font-semibold mb-4 border-b border-border/40 pb-3">
              Activity & Notes
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {lead.messages?.map((msg, idx) => (
                <div key={idx} className="bg-muted/30 p-4 rounded-xl border border-border/30 text-sm text-foreground">
                  {msg}
                </div>
              ))}
              
              {(!lead.messages || lead.messages.length === 0) && (
                <p className="text-muted-foreground text-sm italic text-center mt-10">
                  No messages recorded yet.
                </p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-border/40 space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Add a new note or message..."
                rows={3}
                className="w-full resize-none rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || updateMutation.isPending}
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Add Note
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
