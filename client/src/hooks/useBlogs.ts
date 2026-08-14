import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
} from "../services/blogs";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });
};

export const useGetBlog = (id: string) => {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => getBlog(id),
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      notify.success("Blog post created successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      router.push("/admin/blog");
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to create blog post");
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateBlog(id, data),
    onSuccess: (_, variables) => {
      notify.success("Blog post updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", variables.id] });
      router.push("/admin/blog");
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update blog post");
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      notify.success("Blog post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to delete blog post");
    },
  });
};

export const useUpdateBlogStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateBlogStatus(id, status),
    onSuccess: (_, variables) => {
      notify.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", variables.id] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update status");
    },
  });
};
