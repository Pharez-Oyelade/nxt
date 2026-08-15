import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import About from "@/components/marketing/About";
import Logos from "@/components/marketing/Logos";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Logos />
      </main>
    </>
  );
}
