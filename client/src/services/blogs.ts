import api from "@/lib/axios";

// Fetch all blogs (admin view)
export const getBlogs = async () => {
  const response = await api.get("/blogs/admin");
  return response.data.blogPosts;
};

// Fetch all published blogs (public view)
export const getPublishedBlogs = async () => {
  const response = await api.get("/blogs");
  return response.data.blogPosts;
};

// Fetch a single published blog by slug (public view)
export const getPublishedBlog = async (slug: string) => {
  const response = await api.get(`/blogs/${slug}`);
  return response.data.blogPost;
};

// Fetch a single blog by ID
export const getBlog = async (id: string) => {
  const response = await api.get(`/blogs/admin/${id}`);
  return response.data.blogPost;
};

// Create a new blog post
export const createBlog = async (data: FormData) => {
  const response = await api.post("/blogs/admin", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.blog;
};

// Update an existing blog post
export const updateBlog = async (id: string, data: FormData) => {
  const response = await api.put(`/blogs/admin/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.blogPost;
};

// Delete a blog post
export const deleteBlog = async (id: string) => {
  const response = await api.delete(`/blogs/admin/${id}`);
  return response.data;
};

// Update blog status
export const updateBlogStatus = async (id: string, status: string) => {
  const response = await api.put(`/blogs/admin/${id}`, { status });
  return response.data.blogPost;
};
