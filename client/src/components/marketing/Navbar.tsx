"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useGetCaseStudies } from "@/hooks/useCaseStudies";
import { servicesData } from "@/data/services";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: selectedWorks } = useGetCaseStudies(true, 4);

  // Close dropdown on mouse leave
  const handleMouseLeave = () => setActiveDropdown(null);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-fraunces font-bold tracking-tight text-foreground pointer-events-auto transition-opacity hover:opacity-80"
          onMouseEnter={handleMouseLeave}
        >
          NXT.
        </Link>

        {/* Desktop Navigation */}
        <div 
          className="hidden md:flex relative pointer-events-auto"
          onMouseLeave={handleMouseLeave}
        >
          {/* Main Nav Pill */}
          <nav className="flex items-center gap-2 p-1.5 rounded-full bg-secondary/90 backdrop-blur-md border border-border/50 shadow-sm relative z-20">
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("services")}
            >
              <Link
                href="/services"
                className="text-sm font-medium px-4 py-2 rounded-full flex items-center gap-1.5 text-foreground/80 hover:text-foreground hover:bg-background/80 transition-all"
              >
                Services
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 rounded-full">
                  {servicesData.length}
                </span>
              </Link>
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown("work")}
            >
              <Link
                href="/work"
                className="text-sm font-medium px-4 py-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background/80 transition-all"
              >
                Work
              </Link>
            </div>

            <div onMouseEnter={handleMouseLeave}>
              <Link
                href="/about"
                className="text-sm font-medium px-4 py-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background/80 transition-all"
              >
                About
              </Link>
            </div>

            <div onMouseEnter={handleMouseLeave}>
              <Link
                href="/contact"
                className="text-sm font-medium px-4 py-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background/80 transition-all"
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Mega Menus Background Plate */}
          <div 
            className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ease-out origin-top z-10 w-max max-w-[calc(100vw-3rem)] md:max-w-[800px]
              ${activeDropdown ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible pointer-events-none"}
            `}
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-6 min-w-[300px] md:min-w-[600px] w-full overflow-hidden relative">
              
              {/* Services Mega Menu */}
              {activeDropdown === "services" && (
                <div className="flex gap-8 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex-1 flex flex-col gap-6">
                    {servicesData.map((service) => (
                      <Link 
                        key={service.slug} 
                        href={`/services/${service.slug}`}
                        className="group block p-3 -m-3 rounded-xl hover:bg-accent/5 transition-all duration-300"
                      >
                        <h4 className="text-base font-semibold group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                          {service.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1 group-hover:translate-x-1 transition-all duration-300">
                          {service.subtitle}
                        </p>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="w-64 bg-sidebar/50 rounded-2xl p-5 border border-border/50 flex flex-col justify-between shrink-0">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">View all Services</h4>
                      <p className="text-sm text-muted-foreground">Discover how our comprehensive approach can elevate your brand.</p>
                    </div>
                    
                    <Link 
                      href="/services" 
                      className="mt-6 w-full aspect-video relative rounded-xl overflow-hidden group block"
                    >
                      <Image 
                        src="/images/services/strategy_bg_1786802101253.jpg" 
                        alt="All Services" 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Work Mega Menu */}
              {activeDropdown === "work" && (
                <div className="flex gap-8 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex-1 flex flex-col gap-6">
                    {selectedWorks && selectedWorks.length > 0 ? (
                      selectedWorks.map((work: any) => (
                        <Link 
                          key={work.slug} 
                          href={`/case-studies/${work.slug}`}
                          className="group block p-3 -m-3 rounded-xl hover:bg-accent/5 transition-all duration-300"
                        >
                          <h4 className="text-base font-semibold group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                            {work.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1 group-hover:translate-x-1 transition-all duration-300">
                            {work.description || "View case study details"}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground italic h-full flex items-center">
                        No selected works available yet.
                      </div>
                    )}
                  </div>
                  
                  <div className="w-64 bg-sidebar/50 rounded-2xl p-5 border border-border/50 flex flex-col justify-between shrink-0">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">View all Work</h4>
                      <p className="text-sm text-muted-foreground">Check out all the exceptional case studies we've delivered.</p>
                    </div>
                    
                    <Link 
                      href="/work" 
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Browse full portfolio
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex items-center pointer-events-auto" onMouseEnter={handleMouseLeave}>
          <Link
            href="/contact"
            className="hidden md:flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 shadow-sm"
          >
            Let&apos;s talk
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 rounded-full bg-secondary/80 backdrop-blur-md border border-border/50 text-foreground ml-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
