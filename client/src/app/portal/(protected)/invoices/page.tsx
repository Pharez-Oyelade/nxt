"use client";

import React from "react";
import { useGetClientInvoices } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function ClientInvoicesPage() {
  const { data: invoices, isLoading } = useGetClientInvoices();

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-7xl mx-auto space-y-6 w-full pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Billing & Invoices</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            View your payment history and pay outstanding invoices securely.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : !invoices || invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              No Invoices Yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You do not have any invoices at this time. Once an invoice is generated for your project, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice: any) => (
              <div
                key={invoice._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20 hover:border-accent/40 transition-colors gap-4 sm:gap-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {invoice.invoiceNumber} • ₦{invoice.totalAmount.toLocaleString()}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {invoice.projectId?.title || "Project Invoice"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        invoice.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : invoice.status === "sent"
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {invoice.status === "sent" ? "Unpaid" : invoice.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {invoice.dueDate
                        ? `Due: ${format(new Date(invoice.dueDate), "MMM d, yyyy")}`
                        : format(new Date(invoice.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    className="shrink-0"
                    nativeButton={false}
                    render={<Link href={`/portal/invoices/${invoice._id}`} />}
                  >
                    View <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
