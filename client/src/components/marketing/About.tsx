import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="flex flex-col gap-10 md:flex-row justify-between items-start px-8 md:px-20 py-20"
    >
      <div className="md:text-xl text-md font-bold">
        <span className="w-2 h-2 rounded-full bg-foreground inline-block" />{" "}
        What's NXT
      </div>

      <div className="w-full md:w-[50%]">
        <p className="text-left md:text-right text-xl md:text-3xl font-semibold pb-10">
          A brand and digital product studio in Nigeria. We build brands and
          digital products that look good and work; handling strategy, identity
          and engineering.
        </p>
        <Link
          href="/about"
          className="bg-accent px-5 py-4 rounded-lg md:mx-10 group active:scale-90 hover:bg-accent/80"
        >
          About NXT
          <ArrowUpRight className="inline-block ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>
      </div>
    </section>
  );
}
