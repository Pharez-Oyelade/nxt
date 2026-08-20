"use client";

import React, { useState } from "react";
import { useGetAdminDashboard } from "@/hooks/useDashboard";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";
import { 
  Users, 
  FolderOpen, 
  DollarSign, 
  AlertCircle,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminHome() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useGetAdminDashboard();
  
  const [revenueFilter, setRevenueFilter] = useState<"allTime" | "monthly" | "yearly">("allTime");

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
    newLeadsCount,
    recentLeads,
    projectsByPhase,
    activeProjectsCount,
    outstandingInvoices,
    revenue,
    upcomingTasks,
  } = data;

  const currentRevenue = revenue[revenueFilter];

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-7xl mx-auto space-y-8 w-full pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Welcome back, {user?.name?.split(" ")[0] || "Admin"}
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your agency today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
          <Calendar className="w-4 h-4" />
          {format(new Date(), "MMMM d, yyyy")}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Revenue"
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
          value={formatCurrency(currentRevenue, user?.settings?.currency || "USD")}
          description={
            <select 
              className="text-xs bg-transparent text-muted-foreground focus:outline-none focus:ring-0 p-0 border-none cursor-pointer"
              value={revenueFilter}
              onChange={(e) => setRevenueFilter(e.target.value as any)}
            >
              <option value="allTime">All Time</option>
              <option value="yearly">This Year</option>
              <option value="monthly">This Month</option>
            </select>
          }
          trend="+12% from last period" // Mock trend for UI
        />
        <StatCard
          title="Outstanding Balance"
          icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
          value={formatCurrency(outstandingInvoices.totalAmount, user?.settings?.currency || "USD")}
          description={`${outstandingInvoices.count} unpaid invoice${outstandingInvoices.count !== 1 ? 's' : ''}`}
        />
        <StatCard
          title="Active Projects"
          icon={<FolderOpen className="w-5 h-5 text-blue-500" />}
          value={activeProjectsCount}
          description="In progress"
        />
        <StatCard
          title="New Leads"
          icon={<Users className="w-5 h-5 text-purple-500" />}
          value={newLeadsCount}
          description="Awaiting contact"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Project Pipeline */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Project Pipeline</h3>
                <p className="text-sm text-muted-foreground">Distribution of active projects by phase</p>
              </div>
              <Link href="/admin/projects" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="space-y-5">
                {Object.entries(projectsByPhase).map(([phase, count]: [string, any]) => (
                  <div key={phase} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-medium text-muted-foreground">{phase}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${getPhaseColor(phase)}`}
                        style={{ 
                          width: activeProjectsCount > 0 
                            ? `${(count / activeProjectsCount) * 100}%` 
                            : '0%' 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Leads */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <h3 className="text-lg font-semibold">Recent Leads</h3>
              <Link href="/admin/leads" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                Go to Kanban <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {recentLeads.length > 0 ? (
              <div className="space-y-3">
                {recentLeads.map((lead: any) => (
                  <div key={lead._id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.company}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {format(new Date(lead.createdAt), "MMM d")}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${getLeadStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No recent leads found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width) - Upcoming Tasks */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <h3 className="text-lg font-semibold">Priority Tasks</h3>
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-md">
                {upcomingTasks.length} Pending
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2 space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task: any) => {
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));
                  return (
                    <div key={task._id} className="p-4 rounded-xl border border-border/50 bg-muted/10 group">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0 text-muted-foreground">
                          <Clock className={`w-4 h-4 ${isOverdue ? "text-destructive" : ""}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground line-clamp-2">
                            {task.title}
                          </p>
                          <Link 
                            href={`/admin/projects/${task.projectId?._id}`}
                            className="text-xs text-muted-foreground mt-1 hover:text-primary transition-colors block truncate"
                          >
                            {task.projectId?.title || "Unknown Project"}
                          </Link>
                          
                          {task.dueDate && (
                            <div className={`mt-2 text-[10px] font-semibold uppercase tracking-wider ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                              {isOverdue ? "Overdue" : "Due"}: {format(new Date(task.dueDate), "MMM d")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground mt-1">No upcoming tasks found.</p>
                </div>
              )}
            </div>
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
  trend
}: { 
  title: string; 
  icon: React.ReactNode; 
  value: string | number; 
  description: React.ReactNode;
  trend?: string;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
      <div className="flex justify-between items-start mb-4 relative">
        <h4 className="font-medium text-muted-foreground text-sm">{title}</h4>
        <div className="p-2 bg-background border border-border/50 rounded-lg shadow-sm">
          {icon}
        </div>
      </div>
      <div className="relative">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm text-muted-foreground font-medium flex items-center">
            {description}
          </div>
          {trend && (
            <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getPhaseColor(phase: string) {
  switch (phase) {
    case "proposed": return "bg-slate-400";
    case "discovery": return "bg-purple-500";
    case "design": return "bg-pink-500";
    case "development": return "bg-blue-500";
    case "review": return "bg-amber-500";
    case "delivered": return "bg-emerald-500";
    case "maintenance": return "bg-teal-500";
    default: return "bg-slate-200";
  }
}

function getLeadStatusColor(status: string) {
  switch (status) {
    case "new": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "contacted": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "qualified": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "lost": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
}
