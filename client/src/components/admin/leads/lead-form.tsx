"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateAdminLead } from "@/hooks/useLeads";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  company: z.string().optional(),
  projectType: z.string().optional(),
  budgetRange: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "lost"]),
  message: z.string().min(1, "A starting message or note is required"),
});

type LeadFormValues = z.infer<typeof formSchema>;

export function LeadForm() {
  const createMutation = useCreateAdminLead();
  const isSubmitting = createMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      budgetRange: "",
      status: "new",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<LeadFormValues> = async (data) => {
    try {
      await createMutation.mutateAsync(data);
    } catch {
      // Errors handled by mutation hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-12">
      <section className="space-y-6 bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Lead Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Name <span className="text-destructive">*</span></label>
            <Input {...register("name")} placeholder="Jane Doe" className="h-11" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email Address <span className="text-destructive">*</span></label>
            <Input {...register("email")} type="email" placeholder="jane@example.com" className="h-11" />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Company (Optional)</label>
            <Input {...register("company")} placeholder="Acme Corp" className="h-11" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Project Type (Optional)</label>
            <Input {...register("projectType")} placeholder="e.g. E-commerce, Branding" className="h-11" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Budget Range (Optional)</label>
            <Input {...register("budgetRange")} placeholder="e.g. $5k - $10k" className="h-11" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Pipeline Status</label>
            <select
              {...register("status")}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all hover:border-accent/40"
            >
              <option value="new">New Lead</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <label className="text-sm font-medium leading-none">Initial Message / Note <span className="text-destructive">*</span></label>
          <textarea
            {...register("message")}
            placeholder="Enter the initial inquiry or internal note..."
            rows={4}
            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all hover:border-accent/40"
          />
          {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
        </div>
      </section>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg shadow-accent/20 transition-all hover:-translate-y-1"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Create Lead"
          )}
        </Button>
      </div>
    </form>
  );
}
