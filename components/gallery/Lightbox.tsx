"use client";

import { useState, useEffect } from "react";
import SafeImage from "@/components/shared/SafeImage";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { GalleryImage } from "@/lib/api/galeri";

interface LightboxProps {
  images: string[] | GalleryImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

function LightboxContent({
  images,
  initialIndex,
  isOpen,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(Math.min(initialIndex, Math.max(0, images.length - 1)));

  const getImageUrl = (img: string | GalleryImage | undefined): string => {
    if (!img) return '';
    if (typeof img === 'string') {
      return img;
    }
    return img.url_foto_cdn || '';
  };

  const getImageAlt = (img: string | GalleryImage | undefined): string => {
    if (!img) return `Image`;
    if (typeof img === 'string') {
      return `Image ${currentIndex + 1}`;
    }
    return img.alt_text || `Image ${currentIndex + 1}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];
  if (!currentImage) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </Button>

           <div className="relative w-full h-full flex items-center justify-center p-12">
             <SafeImage
               src={getPlaceholderImage(getImageUrl(currentImage))}
               alt={getImageAlt(currentImage)}
               fill
               sizes="90vw"
               className="object-contain"
             />
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Lightbox(props: LightboxProps) {
  return <LightboxContent key={props.initialIndex} {...props} />;
}
