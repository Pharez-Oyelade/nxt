import React from "react";
import type { Metadata } from "next";
import WorkClient from "./WorkClient";

export const metadata: Metadata = {
  title: "Work | NXT",
  description: "A collection of our selected projects and case studies.",
};

export default function WorkPage() {
  return <WorkClient />;
}
