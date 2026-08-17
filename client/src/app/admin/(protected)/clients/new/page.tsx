"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useCreateClient } from "@/hooks/useClients";
import Link from "next/link";

const formSchema = z.object({
  companyName: z.string().min(1, "Company Name is required"),
  contactName: z.string().min(1, "Primary Contact Name is required"),
  email: z.string().email("Invalid email format"),
  industry: z.string().optional(),
  billingEmail: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof formSchema>;

export default function NewClientPage() {
  const createMutation = useCreateClient();
  const isSubmitting = createMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      industry: "",
      billingEmail: "",
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<ClientFormValues> = async (data) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        billingEmail: data.billingEmail || undefined,
      });
    } catch {
      // Errors handled by mutation hook
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 space-y-6 max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/clients"
          className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Add New Client
          </h2>
          <p className="text-sm text-muted-foreground">
            Create a new client manually. This will also send them an invitation
            email.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-6 bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-primary border-b border-border/40 pb-3">
            Client Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Company Name <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("companyName")}
                placeholder="Acme Corp"
                className="h-11"
              />
              {errors.companyName && (
                <p className="text-xs text-destructive">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Primary Contact Name <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("contactName")}
                placeholder="Jane Doe"
                className="h-11"
              />
              {errors.contactName && (
                <p className="text-xs text-destructive">
                  {errors.contactName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Account Email <span className="text-destructive">*</span>
              </label>
              <Input
                {...register("email")}
                type="email"
                placeholder="jane@example.com"
                className="h-11"
              />
              <p className="text-[11px] text-muted-foreground">
                This email will receive the portal invitation.
              </p>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Billing Email (Optional)
              </label>
              <Input
                {...register("billingEmail")}
                type="email"
                placeholder="billing@example.com"
                className="h-11"
              />
              <p className="text-[11px] text-muted-foreground">
                Defaults to Account Email if left empty.
              </p>
              {errors.billingEmail && (
                <p className="text-xs text-destructive">
                  {errors.billingEmail.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Industry (Optional)
              </label>
              <Input
                {...register("industry")}
                placeholder="e.g. Technology, Retail"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-sm font-medium leading-none">
              Internal Notes (Optional)
            </label>
            <textarea
              {...register("notes")}
              placeholder="Enter any initial notes about this client..."
              rows={4}
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all hover:border-accent/40"
            />
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
                Creating Client...
              </>
            ) : (
              "Create Client & Send Invite"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
