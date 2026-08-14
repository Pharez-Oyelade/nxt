"use client";

import React, { useEffect } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2 } from "lucide-react";
import { useCreateBlog, useUpdateBlog } from "@/hooks/useBlogs";
import { TagsInput } from "./tags-input";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// ─── Schema ─────────────────────────────────────────────────────────────────

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  coverImage: z.any().optional(),
  body: z.string().min(1, "Blog body is required"),
  tags: z.array(z.string()),
});

type BlogFormValues = z.infer<typeof formSchema>;

// ─── Props ───────────────────────────────────────────────────────────────────

interface BlogFormProps {
  mode: "create" | "edit";
  initialData?: any | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_VALUES: BlogFormValues = {
  title: "",
  slug: "",
  status: "draft",
  coverImage: undefined,
  body: "",
  tags: [],
};

function buildFormData(data: BlogFormValues): FormData {
  const fd = new FormData();
  fd.append("title", data.title);
  if (data.slug) fd.append("slug", data.slug);
  fd.append("status", data.status);
  fd.append("body", data.body);
  fd.append("tags", JSON.stringify(data.tags));
  if (data.coverImage instanceof File) {
    fd.append("coverImage", data.coverImage);
  }
  return fd;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BlogForm({ mode, initialData }: BlogFormProps) {
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Populate form when editing an existing record
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        title: initialData.title,
        slug: initialData.slug,
        status: initialData.status,
        coverImage: initialData.coverImage?.url ?? undefined,
        body: initialData.body ?? "",
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
      });
    }
  }, [initialData, mode, reset]);

  const onSubmit: SubmitHandler<BlogFormValues> = async (data) => {
    try {
      const fd = buildFormData(data);
      if (mode === "create") {
        await createMutation.mutateAsync(fd);
      } else {
        await updateMutation.mutateAsync({ id: initialData._id, data: fd });
      }
    } catch {
      // Toasts are handled inside the mutation hooks if we had them, or react-query global defaults
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-5xl pb-12">
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
              placeholder="Blog Post Title"
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
        </div>
      </section>

      {/* ── Tags & Cover Image ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section className="space-y-6 bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-primary">
              Tags
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Organize your blog by adding related tags.
            </p>
          </div>

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagsInput value={field.value} onChange={field.onChange} />
            )}
          />
        </section>

        <section className="space-y-6 bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-primary">
              Cover Image
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Main image for the blog feed and header.
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
      </div>

      {/* ── Rich Text Body ── */}
      <section className="space-y-6 bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm overflow-visible">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-primary">
            Blog Content
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Write your rich text article below.
          </p>
        </div>

        <div className="min-h-[400px]">
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={quillModules}
                className="h-[350px] mb-12 rounded-xl overflow-hidden"
              />
            )}
          />
          {errors.body && (
            <p className="text-xs text-destructive mt-12">{errors.body.message}</p>
          )}
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="flex justify-end pt-4">
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
            "Create Blog Post"
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
