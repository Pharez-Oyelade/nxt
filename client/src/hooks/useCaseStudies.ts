import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCaseStudies, 
  getCaseStudy, 
  createCaseStudy, 
  updateCaseStudy, 
  deleteCaseStudy 
} from "@/services/casestudies";
import { notify } from "@/lib/toast";
import { useRouter } from "next/navigation";

export const useGetCaseStudies = () => {
  return useQuery({
    queryKey: ["caseStudies"],
    queryFn: getCaseStudies,
  });
};

export const useGetCaseStudy = (id: string) => {
  return useQuery({
    queryKey: ["caseStudy", id],
    queryFn: () => getCaseStudy(id),
    enabled: !!id,
  });
};

export const useCreateCaseStudy = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: FormData) => createCaseStudy(formData),
    onSuccess: () => {
      notify.success("Case study created successfully");
      queryClient.invalidateQueries({ queryKey: ["caseStudies"] });
      router.push("/admin/case-studies");
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to create case study");
    },
  });
};

export const useUpdateCaseStudy = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: FormData) => updateCaseStudy(id, formData),
    onSuccess: () => {
      notify.success("Case study updated successfully");
      queryClient.invalidateQueries({ queryKey: ["caseStudies"] });
      queryClient.invalidateQueries({ queryKey: ["caseStudy", id] });
      router.push("/admin/case-studies");
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update case study");
    },
  });
};

export const useUpdateCaseStudyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const formData = new FormData();
      formData.append("status", status);
      return updateCaseStudy(id, formData);
    },
    onSuccess: (data, variables) => {
      notify.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["caseStudies"] });
      queryClient.invalidateQueries({ queryKey: ["caseStudy", variables.id] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to update status");
    },
  });
};

export const useDeleteCaseStudy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCaseStudy(id),
    onSuccess: () => {
      notify.success("Case study deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["caseStudies"] });
    },
    onError: (error: any) => {
      notify.error(error.message || "Failed to delete case study");
    },
  });
};
