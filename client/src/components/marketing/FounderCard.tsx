import Image from "next/image";
import { Quote } from "lucide-react";

export default function FounderCard() {
  return (
    <section
      id="founder"
      className="w-full py-24 md:py-32 px-4 flex justify-center"
    >
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-sidebar/50 border border-border backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center p-8 md:p-16 gap-10 md:gap-16 group">
        {/* Subtle decorative glows */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-100" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Avatar */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full md:rounded-2xl overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-700 shadow-xl">
          <Image
            src="/images/pharez.jpg"
            alt="Pharez Oyelade"
            fill
            className="object-cover scale-150"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col text-center md:text-left relative z-10">
          <Quote className="text-primary/30 w-12 h-12 mb-6 mx-auto md:mx-0" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-fraunces font-medium leading-tight mb-8">
            "We build the thing
            <br className="hidden md:block" /> and it works."
          </h2>
          <div>
            <div className="text-xl font-semibold text-foreground">
              Pharez Oyelade
            </div>
            <div className="text-muted-foreground text-sm uppercase tracking-widest mt-1">
              Founder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
