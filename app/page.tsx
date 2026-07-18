
"use client";

import dynamic from "next/dynamic";
import Hero from "./Components/Landing/Hero";
import Navbar from "./Components/Navbar";
import LazySection from "./Components/LazySection";


const PhoneShowcase = dynamic(() => import("./Components/Landing/PhoneShowcase"), {
  loading: () => <div className="min-h-[1400px] lg:min-h-screen w-full" />,
});

const StoryTelling = dynamic(() => import("./Components/Landing/StoryTelling"), {
  ssr: false,
  loading: () => <div className="min-h-screen w-full" />,
});

const HowItWorks = dynamic(() => import("./Components/Landing/HowItWorks"), {
  ssr: false,
  loading: () => <div className="min-h-[1200px] lg:min-h-screen w-full" />,
});

const FAQ = dynamic(() => import("./Components/Landing/FAQ"), {
  ssr: false,
  loading: () => <div className="min-h-[700px] lg:min-h-[600px] w-full" />,
});

const Footer = dynamic(() => import("./Components/Footer"), {
  ssr: false,
  loading: () => <div className="min-h-[350px] lg:min-h-[300px] w-full" />,
});

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      
      <LazySection className="min-h-[1400px] lg:min-h-screen">
        <PhoneShowcase />
      </LazySection>
      
      <LazySection className="min-h-screen">
        <StoryTelling />
      </LazySection>
      
      
      
      <LazySection className="min-h-[1200px] lg:min-h-screen">
        <HowItWorks />
      </LazySection>
      
      <LazySection className="min-h-[700px] lg:min-h-[600px]">
        <FAQ />
      </LazySection>
      
      <LazySection className="min-h-[350px] lg:min-h-[300px]">
        <Footer />
      </LazySection>
    </div>
  );
};

export default page;
