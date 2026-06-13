
"use client";

import dynamic from "next/dynamic";
import Hero from "./Components/Landing/Hero";
import Navbar from "./Components/Navbar";
import LazySection from "./Components/LazySection";

// Dynamically import below-the-fold components
const PhoneShowcase = dynamic(() => import("./Components/Landing/PhoneShowcase"), { ssr: false });
const StoryTelling = dynamic(() => import("./Components/Landing/StoryTelling"), { ssr: false });
const AudioAnimation = dynamic(() => import("./Components/Landing/AudioAnimation"), { ssr: false });
const HowItWorks = dynamic(() => import("./Components/Landing/HowItWorks"), { ssr: false });
const FAQ = dynamic(() => import("./Components/Landing/FAQ"), { ssr: false });
const Footer = dynamic(() => import("./Components/Footer"), { ssr: false });

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      
      <LazySection minHeight="100vh">
        <PhoneShowcase />
      </LazySection>
      
      <LazySection minHeight="100vh">
        <StoryTelling />
      </LazySection>
      
      <LazySection minHeight="100vh">
        <AudioAnimation />
      </LazySection>
      
      <LazySection minHeight="100vh">
        <HowItWorks />
      </LazySection>
      
      <LazySection minHeight="600px">
        <FAQ />
      </LazySection>
      
      <LazySection minHeight="300px">
        <Footer />
      </LazySection>
    </div>
  );
};

export default page;