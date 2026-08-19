import api from "@/lib/axios";

export interface ContentBlock {
  type: "text" | "image" | "heading" | "quote";
  content: string;
}

export interface CaseStudy {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  coverImage?: Array<{ url: string; public_id: string }>;
  contentBlocks: ContentBlock[];
  status: "draft" | "published" | "archived";
  order: number;
  selected?: boolean;
  createdAt: string;
}

export const getCaseStudies = async (
  selected?: boolean,
  limit?: number
): Promise<CaseStudy[]> => {
  const params = new URLSearchParams();
  if (selected !== undefined) params.append("selected", String(selected));
  if (limit !== undefined) params.append("limit", String(limit));
  
  const queryString = params.toString() ? `?${params.toString()}` : "";
  const { data } = await api.get(`/casestudies${queryString}`);
  return data.caseStudies || [];
};

export const getCaseStudy = async (id: string): Promise<CaseStudy> => {
  const { data } = await api.get(`/casestudies/${id}`);
  return data.caseStudy;
};

export const createCaseStudy = async (
  formData: FormData,
): Promise<CaseStudy> => {
  const { data } = await api.post("/casestudies", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.caseStudy || data.data; // Handles both controller variations
};

export const updateCaseStudy = async (
  id: string,
  formData: FormData,
): Promise<CaseStudy> => {
  const { data } = await api.put(`/casestudies/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.caseStudy || data.data;
};

export const deleteCaseStudy = async (id: string): Promise<void> => {
  await api.delete(`/casestudies/${id}`);
};
