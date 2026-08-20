import React from "react";
import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact | NXT",
  description: "Get in touch with us to start building your next digital product.",
};

export default function ContactPage() {
  return <ContactClient />;
}
