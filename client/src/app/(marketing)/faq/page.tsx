import React from "react";
import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQs | NXT",
  description: "Frequently asked questions about our services, pricing, and process.",
};

export default function FaqPage() {
  return <FaqClient />;
}
