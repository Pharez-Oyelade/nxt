import { useMutation } from "@tanstack/react-query";
import { createLead } from "../services/leads";
import { notify } from "@/lib/toast";

export const useCreateLead = () => {
  return useMutation({
    mutationFn: createLead,
    onError: (error: any) => {
      notify.error(error.response?.data?.message || error.message || "Failed to send message. Please try again.");
    },
  });
};
