import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import About from "@/components/marketing/About";
import Logos from "@/components/marketing/Logos";
import Work from "@/components/marketing/Work";
import Services from "@/components/marketing/Services";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Logos />
        <Work />
        <Services />
      </main>
    </>
  );
}
