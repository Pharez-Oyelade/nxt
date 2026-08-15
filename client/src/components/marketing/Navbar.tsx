import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-fraunces font-bold tracking-tight text-foreground pointer-events-auto transition-opacity hover:opacity-80"
        >
          NXT.
        </Link>

        {/* Desktop Navigation - Floating Pill */}
        <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-full bg-secondary/80 backdrop-blur-md border border-border/50 shadow-sm pointer-events-auto">
          <Link
            href="#work"
            className="text-sm font-medium px-4 py-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background/80 transition-all"
          >
            Work
          </Link>
          <Link
            href="#services"
            className="text-sm font-medium px-4 py-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background/80 transition-all"
          >
            Services
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium px-4 py-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background/80 transition-all"
          >
            About
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium px-4 py-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-background/80 transition-all"
          >
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center pointer-events-auto">
          <Link
            href="#contact"
            className="hidden md:flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 shadow-sm"
          >
            Let&apos;s talk
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 rounded-full bg-secondary/80 backdrop-blur-md border border-border/50 text-foreground">
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
