"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// ALL available images from /public/images folder
const HERO_IMAGES = [
  "/images/Desa Nyalian_1.webp",
  "/images/Desa Nyalian_2.webp",
  "/images/Desa Nyalian_3.webp",
  "/images/Desa Nyalian_4.webp",
  "/images/Desa Nyalian_5.webp",
  "/images/Desa Nyalian_6.webp",
  "/images/Desa Nyalian_7.webp",
  "/images/Desa Nyalian_8.webp",
  "/images/Desa Nyalian_9.webp",
  "/images/Desa Nyalian_10.webp",
  "/images/Desa Nyalian_11.webp",
  "/images/Desa Nyalian_12.webp",
  "/images/Desa Nyalian_13.webp",
  "/images/Desa Nyalian_14.webp",
  "/images/Jamu Sirkuma_1.webp",
  "/images/Jamu Sirkuma_2.webp",
  "/images/Jamu Sirkuma_3.webp",
  "/images/Pura Puncak Sari_1.webp",
  "/images/Pura Puncak Sari_2.webp",
  "/images/Pura Tirta Tadah Uwuk_1.webp",
  "/images/Pura Tirta Tadah Uwuk_2.webp",
  "/images/Pura Tirta Tadah Uwuk_3.webp",
  "/images/Pura Tirta Tadah Uwuk_4.webp",
  "/images/Pura Tirta Tadah Uwuk_5.webp",
  "/images/Pura Tirta Tadah Uwuk_6.webp",
  "/images/Pura Tirta Tadah Uwuk_7.webp",
  "/images/Pura Tirta Tadah Uwuk_8.webp",
  "/images/Pura Tirta Tadah Uwuk_9.webp",
  "/images/Pura Tirta Tadah Uwuk_10.webp",
  "/images/Pura Tirtha Harum_1.webp",
  "/images/Pura Tirtha Harum_2.webp",
  "/images/Pura Tirtha Harum_3.webp",
  "/images/Pura Tirtha Harum_4.webp",
  "/images/Pura Tirtha Harum_5.webp",
  "/images/Pura Tirtha Harum_6.webp",
  "/images/Pura Tirtha Harum_7.webp",
  "/images/Pura Tirtha Harum_8.webp",
  "/images/Sanggar Seni Tirtapudja_1.webp",
  "/images/Sanggar Seni Tirtapudja_2.webp",
  "/images/Sanggar Seni Tirtapudja_3.webp",
  "/images/Topi Capil_1.webp",
  "/images/Topi Capil_2.webp",
  "/images/Topi Capil_3.webp",
];

const SLIDE_INTERVAL = 10000; // 10 seconds

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image Slideshow */}
      <AnimatePresence initial={false}>
        {HERO_IMAGES.map((image, index) => (
          index === currentImageIndex && (
            <motion.div
              key={image}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${image}')`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )
        ))}
      </AnimatePresence>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/80" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
           <h1 
             className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
             style={{ 
               background: 'linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               backgroundClip: 'text',
               filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 20px rgba(74, 222, 128, 0.3))',
             }}
           >
             Desa Nyalian
           </h1>
            <p 
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-5 font-semibold text-white"
              style={{ textShadow: '0 3px 8px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)' }}
            >
              Sebuah desa di Kabupaten Klungkung yang memadukan keindahan alam, warisan budaya, tradisi Hindu Bali, dan kehidupan masyarakat yang terus lestari sebagai bagian dari identitasnya.
            </p>
            <p 
              className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto text-white/95 leading-relaxed px-4"
              style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.7), 0 1px 3px rgba(0, 0, 0, 0.5)' }}
            >
              Kunjungi kami untuk mengalami kehidupan desa yang autentik, dengan ritual keagamaan yang masih hidup, pemandangan persawahan yang indah, dan keramahan masyarakat Nyalian yang tulus.
            </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
             <Link href="/destinations" className="w-full sm:w-auto">
               <Button
                 size="lg"
                 className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg h-12 sm:h-14 shadow-xl hover:shadow-2xl transition-all"
               >
                 Jelajahi Destinasi
               </Button>
             </Link>
             <Link href="/packages" className="w-full sm:w-auto">
               <Button
                 size="lg"
                 variant="outline"
                 className="w-full sm:w-auto bg-white/20 backdrop-blur-md border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg h-12 sm:h-14 shadow-xl hover:shadow-2xl transition-all"
               >
                 Lihat Paket Wisata
               </Button>
             </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Button */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white hover:text-accent transition-colors cursor-pointer"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 0.8, duration: 0.3 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        }}
        aria-label="Scroll to content"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
}
