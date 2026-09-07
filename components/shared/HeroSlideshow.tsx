"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSlideshowProps {
  images: string[];
  title: string;
  slideInterval?: number;
}

const DEFAULT_SLIDE_INTERVAL = 10000; // 10 seconds

export default function HeroSlideshow({ 
  images, 
  title, 
  slideInterval = DEFAULT_SLIDE_INTERVAL 
}: HeroSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [images.length, slideInterval]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[50vh] md:h-[60vh] w-full">
      {/* Background Image Slideshow */}
      <AnimatePresence initial={false}>
        {images.map((image, index) => (
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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <div className="container mx-auto max-w-7xl">
          <h1 
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold"
            style={{ color: '#22c55e' }}
          >
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
