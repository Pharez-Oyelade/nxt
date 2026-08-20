import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-fraunces font-bold tracking-tighter leading-none text-foreground mb-4 select-none">
          404
        </h1>
        
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
          <h2 className="text-2xl md:text-4xl font-fraunces font-semibold text-foreground">
            Looks like you've wandered off.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto mb-10">
            The page you're looking for doesn't exist, has been renamed, or is temporarily unavailable.
          </p>
          
          <Link 
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-medium text-lg hover:bg-foreground/90 transition-all hover:scale-105 shadow-xl mx-auto"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
