import React from "react";
import type { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "Insights & Blog | NXT",
  description: "Our perspectives on design, engineering, and building digital products that actually work.",
};

export default function BlogsPage() {
  return <BlogsClient />;
}
