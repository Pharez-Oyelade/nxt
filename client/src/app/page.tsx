import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import About from "@/components/marketing/About";
import Logos from "@/components/marketing/Logos";
import Work from "@/components/marketing/Work";
import Services from "@/components/marketing/Services";
import FounderCard from "@/components/marketing/FounderCard";
import BlogSection from "@/components/marketing/BlogSection";
import Testimonials from "@/components/marketing/Testimonials";
import ContactForm from "@/components/marketing/ContactForm";

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
        <FounderCard />
        <BlogSection />
        <Testimonials />
        <ContactForm />
      </main>
    </>
  );
}
