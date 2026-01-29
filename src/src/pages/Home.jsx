import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <>
    <HeroSection />
    <div className="p-6 text-center min-h-screen" data-aos="fade-up">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-bold text-blue-900"
      >
        Welcome to Bizpole1
      </motion.h1>
      <p className="mt-4 text-gray-600">Your awesome React + Vite + Tailwind project 🚀</p>

    
      
      <div className="min-h-screen">
        haii
      </div>
    </div>
    </>
  );
}
