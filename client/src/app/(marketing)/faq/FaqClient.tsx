"use client";

import React, { useState } from "react";
import { Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What services do you offer?",
    answer: "We specialize in end-to-end digital product design and development. This includes brand identity, UI/UX design, full-stack web and mobile engineering, and ongoing strategic product support. We focus on building products that look premium and perform flawlessly."
  },
  {
    question: "What is your typical project timeline?",
    answer: "Timelines vary depending on the scope and complexity of the project. A typical branding and marketing website can take 4-8 weeks, while comprehensive web applications and platforms generally require 12-16 weeks from discovery to launch."
  },
  {
    question: "How do you handle project pricing?",
    answer: "We offer both fixed-price and retainer-based pricing models depending on your needs. For well-defined scopes, we provide a fixed project cost. For ongoing product development or teams needing flexible engineering resources, we offer monthly retainers."
  },
  {
    question: "Do you work with startups or established companies?",
    answer: "Both. We love working with ambitious early-stage startups to help them define their brand and build their MVP, as well as partnering with established enterprises to modernize their digital presence and scale their engineering capacity."
  },
  {
    question: "What technology stack do you use?",
    answer: "We are framework-agnostic but strongly prefer modern, performant stacks. For the frontend, we primarily use React and Next.js. For the backend, we utilize Node.js, Express, or serverless architectures, often backed by MongoDB or PostgreSQL."
  },
  {
    question: "Will I own the intellectual property (IP)?",
    answer: "Absolutely. Once the project is completed and final payments are cleared, all intellectual property, source code, and design assets are fully transferred to you."
  }
];

export default function FaqClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background flex flex-col">
      <div className="container mx-auto px-6 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start max-w-7xl mx-auto w-full">
          
          {/* Left Column: Context */}
          <div className="lg:col-span-5 flex flex-col pt-10 lg:sticky lg:top-32 z-10 bg-background/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none lg:z-auto lg:pb-0 pb-6 mb-4 lg:mb-0">
            <h1 className="text-5xl md:text-7xl font-fraunces font-bold tracking-tight mb-8 leading-tight">
              Questions & <br /> Answers.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
              Everything you need to know about our process, pricing, and how we build digital products.
            </p>
            
            <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border/50">
              <h3 className="text-2xl font-fraunces font-bold mb-3">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Please chat to our friendly team.
              </p>
              <Link 
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-all hover:scale-105"
              >
                Get in touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`overflow-hidden transition-all duration-500 rounded-[2rem] border ${
                  openIndex === index 
                    ? "bg-secondary/40 border-primary/20 shadow-lg" 
                    : "bg-background border-border/50 hover:border-border"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                >
                  <h3 className={`text-xl md:text-2xl font-semibold pr-8 transition-colors ${
                    openIndex === index ? "text-primary font-fraunces" : "text-foreground group-hover:text-primary"
                  }`}>
                    {faq.question}
                  </h3>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}>
                    {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                
                <div 
                  className={`px-6 md:px-8 transition-all duration-500 ease-in-out overflow-hidden ${
                    openIndex === index ? "max-h-96 pb-8 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}
