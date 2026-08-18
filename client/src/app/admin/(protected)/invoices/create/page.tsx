"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { useGetProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

function CreateInvoiceContent() {
  const router = useRouter();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects();
  const { mutate: createInvoice, isPending } = useCreateInvoice();
  const { user } = useAuthStore();
  const currency = user?.settings?.currency || "NGN";

  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("projectId") || "";

  const [projectId, setProjectId] = useState(initialProjectId);

  useEffect(() => {
    if (initialProjectId && !projectId) {
      setProjectId(initialProjectId);
    }
  }, [initialProjectId]);
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState([{ desc: "", amount: "" }]);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { desc: "", amount: "" }]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    const newItems = [...lineItems];
    newItems.splice(index, 1);
    setLineItems(newItems);
  };

  const handleLineItemChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newItems = [...lineItems] as any;
    newItems[index][field] = value;
    setLineItems(newItems);
  };

  const totalAmount = lineItems.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId) {
      toast.error("Please select a project");
      return;
    }

    // Find the client from the selected project
    const selectedProject = projects?.find((p: any) => p._id === projectId);
    if (!selectedProject || !selectedProject.clientId) {
      toast.error("Project must have an associated client");
      return;
    }

    const cleanedLineItems = lineItems
      .filter((item) => item.desc && item.amount)
      .map((item) => ({
        desc: item.desc,
        amount: parseFloat(item.amount),
      }));

    if (cleanedLineItems.length === 0) {
      toast.error("Please add at least one valid line item");
      return;
    }

    createInvoice(
      {
        clientId: selectedProject.clientId._id || selectedProject.clientId,
        projectId,
        lineItems: cleanedLineItems,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      },
      {
        onSuccess: () => {
          router.push("/admin/invoices");
        },
      },
    );
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-4xl mx-auto space-y-6 w-full pb-12">
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
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Generate Invoice
          </h2>
          <p className="text-muted-foreground text-sm">
            Create a new invoice and bill a client for a project.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoadingProjects}
              >
                <option value="">Select a project...</option>
                {projects?.map((project: any) => (
                  <option key={project._id} value={project._id}>
                    {project.title} (
                    {project.clientId?.companyName || "Unknown"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h3 className="text-lg font-semibold">Line Items</h3>
          </div>

          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Label className={index !== 0 ? "sr-only" : ""}>
                    Description
                  </Label>
                  <Input
                    placeholder="E.g., Website Design"
                    value={item.desc}
                    onChange={(e) =>
                      handleLineItemChange(index, "desc", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label className={index !== 0 ? "sr-only" : ""}>
                    Amount ({currency === "USD" ? "$" : "₦"})
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) =>
                      handleLineItemChange(index, "amount", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="pt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLineItem(index)}
                    disabled={lineItems.length === 1}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddLineItem}
            className="w-full mt-2"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>

          <div className="flex justify-end pt-4 border-t border-border/40">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(totalAmount, currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="text-primary">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              "Generate Invoice"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 p-8 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CreateInvoiceContent />
    </Suspense>
  );
}
