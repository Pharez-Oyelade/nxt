"use client";

import React, { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { type CaseStudy } from "@/services/casestudies";
import { useCreateCaseStudy, useUpdateCaseStudy } from "@/hooks/useCaseStudies";

// ─── Schema ─────────────────────────────────────────────────────────────────

const BLOCK_TYPES = ["text", "image", "heading", "quote"] as const;

const contentBlockSchema = z.object({
  type: z.enum(BLOCK_TYPES),
  content: z.string().min(1, "Content is required"),
});

/**
 * NOTE: Do NOT use z.number().default() — the Zod v4 + hookform/resolvers
 * combination infers it as `unknown`. Use a plain z.number() and provide
 * the default inside useForm({ defaultValues }).
 */
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  selected: z.boolean().default(false),
  coverImage: z.any().optional(),
  contentBlocks: z
    .array(contentBlockSchema)
    .min(1, "Add at least one content block"),
});

type CaseStudyFormValues = z.infer<typeof formSchema>;

// ─── Props ───────────────────────────────────────────────────────────────────

interface CaseStudyFormProps {
  mode: "create" | "edit";
  initialData?: CaseStudy | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_VALUES: CaseStudyFormValues = {
  title: "",
  description: "",
  slug: "",
  status: "draft",
  selected: false,
  coverImage: undefined,
  contentBlocks: [{ type: "text", content: "" }],
};

function buildFormData(data: CaseStudyFormValues): FormData {
  const fd = new FormData();
  fd.append("title", data.title);
  if (data.description) fd.append("description", data.description);
  if (data.slug) fd.append("slug", data.slug);
  fd.append("status", data.status);
  fd.append("selected", String(data.selected));
  fd.append("contentBlocks", JSON.stringify(data.contentBlocks));
  if (data.coverImage instanceof File) {
    fd.append("coverImage", data.coverImage);
  }
  return fd;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CaseStudyForm({ mode, initialData }: CaseStudyFormProps) {
  const createMutation = useCreateCaseStudy();
  const updateMutation = useUpdateCaseStudy(initialData?._id ?? "");
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CaseStudyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contentBlocks",
  });

  // Populate form when editing an existing record
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const blocks: CaseStudyFormValues["contentBlocks"] =
        Array.isArray(initialData.contentBlocks) &&
        initialData.contentBlocks.length > 0
          ? initialData.contentBlocks.map((b) => ({
              // Ensure the `type` from the server is a valid enum member, fall back to "text"
              type: (BLOCK_TYPES as readonly string[]).includes(b.type)
                ? (b.type as (typeof BLOCK_TYPES)[number])
                : "text",
              content: b.content,
            }))
          : [{ type: "text", content: "" }];

      reset({
        title: initialData.title,
        description: initialData.description ?? "",
        slug: initialData.slug,
        status: initialData.status,
        selected: initialData.selected ?? false,
        coverImage: initialData.coverImage?.[0]?.url ?? undefined,
        contentBlocks: blocks,
      });
    }
  }, [initialData, mode, reset]);

  const onSubmit: SubmitHandler<CaseStudyFormValues> = async (data) => {
    try {
      const fd = buildFormData(data);
      if (mode === "create") {
        await createMutation.mutateAsync(fd);
      } else {
        await updateMutation.mutateAsync(fd);
      }
    } catch {
      // Toasts are handled inside the mutation hooks
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-5xl">
      {/* ── Basic Information ── */}
      <section className="space-y-6 bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Title</label>
            <Input
              {...register("title")}
              placeholder="Case Study Title"
              className="h-11"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Slug (Optional)
            </label>
            <Input
              {...register("slug")}
              placeholder="auto-generated-if-empty"
              className="h-11"
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Brief summary of the case study"
            rows={3}
            className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-accent/40"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-1">
            <label className="text-sm font-medium leading-none">Status</label>
            <select
              {...register("status")}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-accent/40"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-1 flex items-center h-full pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("selected")}
                className="w-5 h-5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-accent transition-all duration-200"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">Selected Work</span>
                <span className="text-xs text-muted-foreground mt-1">Feature this on the mega-menu</span>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* ── Cover Image ── */}
      <section className="space-y-6 bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-primary">
            Cover Image
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            This is the main image displayed on the case study card.
          </p>
        </div>

        <Controller
          name="coverImage"
          control={control}
          render={({ field }) => (
            <ImageUpload
              value={field.value ?? null}
              onChange={field.onChange}
              placeholder="Upload cover image"
            />
          )}
        />
      </section>

      {/* ── Content Blocks ── */}
      <section className="space-y-6 bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-primary">
            Content Blocks
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Build your case study content dynamically.
          </p>
        </div>

        {errors.contentBlocks?.root && (
          <p className="text-xs text-destructive">
            {errors.contentBlocks.root.message}
          </p>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative group flex flex-col md:flex-row gap-4 p-4 border border-border/60 rounded-xl bg-background/50 hover:bg-background hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center justify-center cursor-grab active:cursor-grabbing text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0">
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="w-full md:w-[150px] shrink-0">
                <select
                  {...register(`contentBlocks.${index}.type`)}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 hover:border-accent/40"
                >
                  {BLOCK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <textarea
                  {...register(`contentBlocks.${index}.content`)}
                  placeholder="Enter content..."
                  rows={2}
                  className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 hover:border-accent/40"
                />
                {errors.contentBlocks?.[index]?.content && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.contentBlocks[index]?.content?.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="shrink-0 h-11 w-11 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed h-12 rounded-xl text-primary hover:text-accent hover:border-accent/50 hover:bg-accent/5 transition-all"
          onClick={() => append({ type: "text", content: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content Block
        </Button>
      </section>

      {/* ── Submit ── */}
      <div className="flex justify-end pt-4 pb-12">
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
          ) : mode === "create" ? (
            "Create Case Study"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
