"use client";

import React from "react";
import { useGetClients } from "@/hooks/useClients";
import { Loader2, Plus, Building2, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { buttonVariants } from "@/components/ui/button";

export default function ClientsPage() {
  const { data: clients, isLoading, error } = useGetClients();
  const router = useRouter();

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Clients
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your active clients, projects, and billing contacts.
          </p>
        </div>

        {/* <Link
          href="/admin/clients/new"
          className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90 h-10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Link>
      </div> */}
        <Link
          href="/admin/clients/new"
          className={buttonVariants({
            className: "h-10 bg-accent hover:bg-accent/90 text-white shadow-md",
          })}
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline mr-2">Add Client</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-destructive font-medium mb-4">
            Failed to load clients.
          </p>
        </div>
      ) : !clients || clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-border/60 rounded-2xl bg-card">
          <div className="flex aspect-square size-20 items-center justify-center rounded-full bg-accent/5 text-accent/40 mb-4">
            <Building2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-primary">
            No clients found
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 text-center max-w-sm">
            You don't have any clients yet. Convert a lead or manually add one
            here.
          </p>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90"
          >
            Add First Client
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Company</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {clients.map((client) => (
                  <tr
                    key={client._id}
                    onClick={() => router.push(`/admin/clients/${client._id}`)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {client.companyName}
                          </div>
                          {client.industry && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {client.industry}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-foreground">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          {client.primaryContactName || (
                            <span className="italic text-muted-foreground/50">
                              Not set
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                          <Mail className="w-3.5 h-3.5" />
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                          client.status === "active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : client.status === "prospect"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                      {format(new Date(client.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
