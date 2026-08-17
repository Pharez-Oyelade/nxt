"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetInvoice, useSendInvoice } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading, error } = useGetInvoice(invoiceId);
  const { mutate: sendInvoice, isPending: isSending } = useSendInvoice();

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center h-[50vh] text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive font-medium mb-4">
          Failed to load invoice details.
        </p>
        <Button onClick={() => router.push("/admin/invoices")} variant="outline">
          Back to Invoices
        </Button>
      </div>
    );
  }

  const handleSend = () => {
    sendInvoice(invoiceId);
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-4xl mx-auto space-y-6 w-full pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:bg-muted"
            nativeButton={false}
            render={<Link href="/admin/invoices" />}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              {invoice.invoiceNumber}
            </h2>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                invoice.status === "paid"
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : invoice.status === "sent"
                  ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        {invoice.status === "draft" && (
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send to Client
          </Button>
        )}
        {invoice.status === "sent" && (
          <Button variant="outline" disabled>
            <CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> Awaiting Payment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-border/40 pb-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Billed To
                </h3>
                <p className="text-lg font-medium">{invoice.clientId?.companyName}</p>
                <p className="text-sm text-muted-foreground">{invoice.clientId?.email}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Project
                </h3>
                <p className="text-lg font-medium">{invoice.projectId?.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Line Items</h3>
              <div className="border border-border/50 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {invoice.lineItems?.map((item: any) => (
                      <tr key={item._id} className="bg-card">
                        <td className="px-4 py-3 text-foreground">{item.desc}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          ₦{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/20">
                    <tr>
                      <td className="px-4 py-4 text-right font-semibold">Total</td>
                      <td className="px-4 py-4 text-right font-bold text-lg text-primary">
                        ₦{invoice.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 border-b border-border/40 pb-3">
              Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                  Generated On
                </p>
                <p className="text-sm font-medium">
                  {format(new Date(invoice.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
              {invoice.dueDate && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-medium">
                    {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
                  </p>
                </div>
              )}
              {invoice.paystackRef && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
                    Payment Reference
                  </p>
                  <p className="text-sm font-mono bg-muted/50 p-1.5 rounded text-muted-foreground break-all">
                    {invoice.paystackRef}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
