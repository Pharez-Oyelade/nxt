import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  SquigglyWave,
  SquigglyZigzag,
  SquigglyMark,
  SquigglyCurl,
  SquigglyDiamond,
  SquigglyArrow,
  SquigglyArrowDown,
} from "./SquigglyDecorations";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-svh flex flex-col justify-center items-center m-auto text-center overflow-hidden bg-sidebar "
    >
      {/* ── Squiggly background decorations (animated) ── */}

      {/* Top area — scattered marks */}
      <SquigglyCurl className="squiggly-anim-drift absolute -top-[25%] left-1/2 -translate-x-1/2 w-16 h-full text-foreground/15 pointer-events-none" />
      <SquigglyMark className="squiggly-anim-1 absolute top-[15%] right-[22%] w-6 text-foreground/12 pointer-events-none" />
      <SquigglyDiamond className="squiggly-anim-sway absolute top-[18%] left-[18%] w-5 text-foreground/10 pointer-events-none" />

      {/* Mid-left area */}
      <SquigglyZigzag className="squiggly-anim-2 absolute top-[40%] left-[8%] w-5 text-foreground/12 pointer-events-none rotate-12" />
      <SquigglyWave className="squiggly-anim-3 absolute bottom-[35%] left-[20%] w-24 text-foreground/18 pointer-events-none -rotate-6" />

      {/* Mid-right area */}
      <SquigglyMark className="squiggly-anim-sway absolute top-[30%] right-[12%] w-4 text-foreground/10 pointer-events-none" />
      <SquigglyZigzag className="squiggly-anim-1 absolute top-[55%] right-[20%] w-5 text-foreground/12 pointer-events-none -rotate-12" />

      {/* Bottom area */}
      <SquigglyWave className="squiggly-anim-drift absolute bottom-[18%] right-[20%] w-20 text-foreground/8 pointer-events-none rotate-3" />
      <SquigglyDiamond className="squiggly-anim-2 absolute bottom-[22%] left-[25%] w-4 text-foreground/10 pointer-events-none" />
      <SquigglyCurl className="squiggly-anim-3 absolute h-full -bottom-[30%] right-[40%] w-14 text-foreground/10 pointer-events-none rotate-6" />

      {/* ── Main content (UNCHANGED layout, just made responsive) ── */}
      <div className="m-auto space-y-5 px-4 z-10 relative">
        <h1 className="leading-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-fraunces font-semibold">
          We build the brands <br /> We design.
        </h1>
        <p className="text-lg md:text-xl max-w-[500px] w-full mx-auto text-center">
          A digital agency creating bold identities, digital experiences and
          lasting impact
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
          <Link
            href="#"
            className="w-full sm:w-auto justify-center bg-accent px-6 py-3 text-primary rounded-md font-medium flex items-center gap-2 border-2 border-accent hover:bg-accent/90 hover:border-accent/90 active:scale-90 transition-all group"
          >
            See Work
            <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link
            href="#"
            className="w-full sm:w-auto justify-center text-center bg-transparent px-6 py-3 text-primary border-2 border-accent rounded-md active:scale-90 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* ── Project card with hover squiggly arrow ── */}
      <div className="hidden md:block absolute top-50 left-2 lg:left-10 w-[200px] lg:w-[250px] overflow-visible rotate-[-10deg] opacity-90 group/card cursor-pointer border-2 border-background rounded-md animate-[pulse_3s_ease-in-out_infinite]">
        <Image
          src="/arca_hero.png"
          width={1000}
          height={1000}
          alt="Arca Project"
          className="transition-transform duration-300 group-hover/card:scale-105 border-2 border-background rounded-md"
        />
        {/* Squiggly arrow — appears on hover */}
        <SquigglyArrow className="absolute -top-12 -right-14 w-14 text-foreground/60 opacity-0 scale-75 transition-all duration-300 ease-out group-hover/card:opacity-100 group-hover/card:scale-100" />
        <SquigglyArrowDown className="absolute -bottom-10 -left-8 w-10 text-foreground/50 opacity-0 scale-75 transition-all duration-300 ease-out delay-75 group-hover/card:opacity-100 group-hover/card:scale-100" />
        <span className="absolute -top-13 rotate-[35deg] -right-18 text-foreground/60 opacity-0 transition-all duration-300 ease-out group-hover/card:opacity-100">
          Arca
        </span>
      </div>

      {/* Card 2 */}
      <div className="hidden md:block absolute bottom-20 right-10 lg:right-32 w-[200px] lg:w-[250px] overflow-visible rotate-[10deg] opacity-90 group/card cursor-pointer border-2 border-background rounded-md animate-[pulse_3s_ease-in-out_infinite]">
        <Image
          src="/GlamsHero.png"
          width={1000}
          height={1000}
          alt="Glams Project"
          className="transition-transform duration-300 group-hover/card:scale-105 border-2 border-background rounded-md"
        />
        {/* Squiggly arrow — appears on hover */}
        <SquigglyArrow className="absolute -top-12 -right-14 w-14 text-foreground/60 opacity-0 scale-75 transition-all duration-300 ease-out group-hover/card:opacity-100 group-hover/card:scale-100" />
        <SquigglyArrowDown className="absolute -bottom-10 -left-8 w-10 text-foreground/50 opacity-0 scale-75 transition-all duration-300 ease-out delay-75 group-hover/card:opacity-100 group-hover/card:scale-100" />
        <span className="absolute -top-13 rotate-[35deg] -right-18 text-foreground/60 opacity-0 transition-all duration-300 ease-out group-hover/card:opacity-100">
          Glams
        </span>
      </div>
    </section>
  );
}
