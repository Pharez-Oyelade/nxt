"use client";

import React from "react";
import { useGetClientDashboard } from "@/hooks/useDashboard";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";
import { 
  FolderOpen, 
  AlertCircle,
  Loader2,
  Calendar,
  FileIcon,
  Download,
  ExternalLink,
  Receipt,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function PortalDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useGetClientDashboard();

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-[calc(100vh-100px)] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive font-medium mb-4">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  const {
    projects,
    activeProjectsCount,
    outStandingBalance,
    recentInvoices,
    latestFile,
  } = data;

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-6xl mx-auto space-y-8 w-full pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Welcome, {user?.name?.split(" ")[0] || "Client"}
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's the latest on your projects and deliverables.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
          <Calendar className="w-4 h-4" />
          {format(new Date(), "MMMM d, yyyy")}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <StatCard
          title="Active Projects"
          icon={<FolderOpen className="w-5 h-5 text-blue-500" />}
          value={activeProjectsCount}
          description="Currently in progress"
        />
        <StatCard
          title="Outstanding Balance"
          icon={<AlertCircle className={`w-5 h-5 ${outStandingBalance > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />}
          value={formatCurrency(outStandingBalance, user?.settings?.currency || "USD")}
          description={outStandingBalance > 0 ? "Awaiting payment" : "All caught up"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Left Column */}
        <div className="space-y-6 md:space-y-8">
          {/* Active Projects */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-full min-h-[300px]">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <h3 className="text-lg font-semibold">Your Projects</h3>
              <Link href="/portal/projects" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <Link 
                    href={`/portal/projects/${project._id}`}
                    key={project._id} 
                    className="block p-5 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 hover:border-accent/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-accent/10 text-accent border border-accent/20 shrink-0">
                        {project.phase}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/5">
                  <FolderOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">No active projects</p>
                  <p className="text-sm text-muted-foreground mt-1">We'll update here when things get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 md:space-y-8">
          
          {/* Latest Deliverable */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-border/40 pb-4">
              Latest Deliverable
            </h3>
            
            {latestFile ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-accent/5 hover:border-accent/30 transition-colors gap-4">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border/50 shadow-sm">
                    <FileIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-foreground truncate">
                      {latestFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      From: {latestFile.projectTitle}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold mt-1">
                      {format(new Date(latestFile.uploadedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <a
                    href={latestFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shadow-sm"
                  >
                    View
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/5">
                <FileIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No deliverables uploaded yet</p>
              </div>
            )}
          </div>

          {/* Recent Invoices */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <h3 className="text-lg font-semibold">Recent Invoices</h3>
              <Link href="/portal/invoices" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {recentInvoices.length > 0 ? (
              <div className="space-y-3">
                {recentInvoices.map((invoice: any) => (
                  <div key={invoice._id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border/50 shrink-0">
                        <Receipt className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {formatCurrency(invoice.totalAmount, user?.settings?.currency || "USD")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {invoice.invoiceNumber}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getInvoiceStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">No invoices found.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponents & Helpers

function StatCard({ 
  title, 
  icon, 
  value, 
  description,
}: { 
  title: string; 
  icon: React.ReactNode; 
  value: string | number; 
  description: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
      <div className="flex justify-between items-start mb-6 relative">
        <h4 className="font-medium text-muted-foreground">{title}</h4>
        <div className="p-2.5 bg-background border border-border/50 rounded-xl shadow-sm">
          {icon}
        </div>
      </div>
      <div className="relative">
        <div className="text-4xl font-bold tracking-tight">{value}</div>
        <div className="text-sm text-muted-foreground font-medium mt-2">
          {description}
        </div>
      </div>
    </div>
  );
}

function getInvoiceStatusColor(status: string) {
  switch (status) {
    case "paid": return "text-emerald-500 bg-emerald-500/10";
    case "sent": return "text-blue-500 bg-blue-500/10";
    case "overdue": return "text-destructive bg-destructive/10";
    default: return "text-muted-foreground bg-muted";
  }
}
