"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import SafeImage from "@/components/shared/SafeImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { GalleryImage } from "@/lib/api/galeri";

interface ImageGalleryProps {
  images: string[] | GalleryImage[];
  onImageClick?: (index: number) => void;
  variant?: "carousel" | "grid";
}

export default function ImageGallery({ images, onImageClick, variant = "carousel" }: ImageGalleryProps) {
  // Helper function to get image URL
  const getImageUrl = (img: string | GalleryImage): string => {
    if (typeof img === 'string') {
      return img;
    }
    return img.url_foto_cdn;
  };

  // Helper function to get alt text
  const getImageAlt = (img: string | GalleryImage, index: number): string => {
    if (typeof img === 'string') {
      return `Gallery image ${index + 1}`;
    }
    return img.alt_text || `Gallery image ${index + 1}`;
  };

  // Filter out empty, null, undefined, or invalid image entries
  const validImages = images.filter((img) => {
    const url = getImageUrl(img);
    return url && typeof url === 'string' && url.trim().length > 0;
  });
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Debug: Log what images are being rendered
  if (process.env.NODE_ENV === 'development') {
    console.log('=== ImageGallery RENDER DEBUG ===');
    console.log('Variant:', variant);
    console.log('Images received:', images);
    console.log('Images after filtering:', validImages);
    console.log('Filtered count:', validImages.length);
  }

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") scrollPrev();
      if (event.key === "ArrowRight") scrollNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi, scrollPrev, scrollNext]);

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {validImages.map((image, index) => (
          <div
            key={`grid-${index}-${getImageUrl(image)}`}
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => onImageClick?.(index)}
          >
            <SafeImage
              src={getPlaceholderImage(getImageUrl(image))}
              alt={getImageAlt(image, index)}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
       <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {validImages.map((image, index) => (
              <div
                key={`carousel-${index}-${getImageUrl(image)}`}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-2"
              >
                <div
                  className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => onImageClick?.(index)}
                >
                  <SafeImage
                    src={getPlaceholderImage(getImageUrl(image))}
                    alt={getImageAlt(image, index)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
       </div>

       <Button
         variant="outline"
         size="icon"
         className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10 w-8 h-8 sm:w-10 sm:h-10"
         onClick={scrollPrev}
         disabled={!canScrollPrev}
         aria-label="Previous image"
       >
         <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
       </Button>

       <Button
         variant="outline"
         size="icon"
         className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10 w-8 h-8 sm:w-10 sm:h-10"
         onClick={scrollNext}
         disabled={!canScrollNext}
         aria-label="Next image"
       >
         <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
       </Button>

        <div className="flex justify-center gap-2 mt-4">
          {validImages.map((image, index) => (
            <button
              key={`indicator-${index}-${getImageUrl(image)}`}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? "bg-primary w-8"
                  : "bg-border hover:bg-primary/50"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
    </div>
  );
}
