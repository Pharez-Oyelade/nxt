import { create } from "zustand";
import { Lead } from "@/services/leads";

export type ColumnId = "new" | "contacted" | "qualified" | "lost";

interface LeadStore {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  updateLeadStatusOptimistic: (leadId: string, newStatus: ColumnId) => void;
}

export const useLeadStore = create<LeadStore>((set) => ({
  leads: [],
  setLeads: (leads) => set({ leads }),
  updateLeadStatusOptimistic: (leadId, newStatus) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      ),
    })),
}));
